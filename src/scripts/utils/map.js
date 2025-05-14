import { map, tileLayer, Icon, icon, marker, popup, latLng } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import CONFIG from "../config";

export default class Map {
  #zoom = 5;
  #map = null;

  static async getPlaceNameByCoordinate(latitude, longitude) {
    try {
      const url = new URL(
        `https://api.maptiler.com/geocoding/${longitude},${latitude}.json`
      );
      url.searchParams.set("key", CONFIG.MAP_SERVICE_API_KEY);
      url.searchParams.set("language", "id");
      url.searchParams.set("limit", "1");
      const response = await fetch(url);
      const json = await response.json();

      // Cek Apakah Latitude dan Longitude tidak valid sehingga tidak menghasilkan placename
      if (
        !json.features ||
        json.features.length === 0 ||
        !json.features[0].place_name
      ) {
        return `${latitude}, ${longitude}`;
      }

      const place = await json.features[0].place_name.split(", ");
      return [place.at(-2), place.at(-1)].map((name) => name).join(", ");
    } catch (error) {
      console.error("getPlaceNameByCoordinate: error:", error);
      return `${latitude}, ${longitude}`;
    }
  }

  static isGeolocationAvailable() {
    return "geolocation" in navigator;
  }

  static getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!Map.isGeolocationAvailable()) {
        reject("Geolocation API unsupported");
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  /**
   * Reference of using this static method:
   * https://stackoverflow.com/questions/43431550/how-can-i-invoke-asynchronous-code-within-a-constructor
   * */
  static async build(selector, options = {}) {
    if ("center" in options && options.center) {
      return new Map(selector, options);
    }

    const jakartaCoordinate = [-6.2, 106.816666];

    // Using Geolocation API
    if ("locate" in options && options.locate) {
      try {
        const position = await Map.getCurrentPosition();
        const coordinate = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        return new Map(selector, {
          ...options,
          center: coordinate,
        });
      } catch (error) {
        console.error("build: error:", error);

        return new Map(selector, {
          ...options,
          center: jakartaCoordinate,
        });
      }
    }

    return new Map(selector, {
      ...options,
      center: jakartaCoordinate,
    });
  }

  constructor(selector, options = {}) {
    this.#zoom = options.zoom ?? this.#zoom;

    const tileOsm = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      }
    );

    const tileEsri = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/" +
        "World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        maxZoom: 19,
      }
    );

    const openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap'
    });

    const cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap & CartoDB',
      subdomains: 'abcd',
      maxZoom: 19
    });

    this.#map = map(document.querySelector(selector), {
      zoom: this.#zoom,
      scrollWheelZoom: false,
      layers: [tileOsm],
      ...options,
    });

    const baseMaps = {
      OpenStreetMap: tileOsm,
      "Esri World Imagery": tileEsri,
      "OpenTopoMap": openTopo,
      "Carto Light": cartoLight,
    };

    L.control.layers(baseMaps).addTo(this.#map);
  }

  createIcon(options = {}) {
    return icon({
      ...Icon.Default.prototype.options,
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      ...options,
    });
  }

  addMarker(coordinates, markerOptions = {}, popupOptions = null) {
    if (typeof markerOptions !== "object") {
      throw new Error("markerOptions must be an object");
    }
    const newMarker = marker(coordinates, {
      icon: this.createIcon(),
      ...markerOptions,
    });
    if (popupOptions) {
      if (typeof popupOptions !== "object") {
        throw new Error("popupOptions must be an object");
      }
      if (!("content" in popupOptions)) {
        throw new Error("popupOptions must include `content` property.");
      }
      const newPopup = popup(coordinates, popupOptions);
      newMarker.bindPopup(newPopup);
    }
    newMarker.addTo(this.#map);
    return newMarker;
  }

  changeCamera(coordinate, zoomLevel = null) {
    if (!zoomLevel) {
      this.#map.setView(latLng(coordinate), this.#zoom);
      return;
    }
    this.#map.setView(latLng(coordinate), zoomLevel);
  }

  getCenter() {
    const { lat, lng } = this.#map.getCenter();
    return {
      latitude: lat,
      longitude: lng,
    };
  }

  addMapEventListener(eventName, callback) {
    this.#map.addEventListener(eventName, callback);
  }
}
