import * as API from "../../data/api";
import * as AuthModel from "../../utils/auth";
import NewStoryPresenter from "./new-story-presenter";
import Camera from "../../utils/camera";
import Map from "../../utils/map";
import { generateLoadingTemplate } from "../../template";
import {errorAlert, successAlert} from "../../utils/alert"

export default class NewStoryPage {
  #presenter = null;
  #camera = null;
  #form = null;
  #map = null;
  #isCameraOpen = false;
  #takenImage = null;

  async render() {
    return `
    <section class="container-md my-3">
      <div class="row justify-content-center">
        <div class="col-10 col-lg-6 mx-auto">
          <a href="#/" class="text-decoration-none d-inline-flex align-items-center m-3 gap-3">
            <i class="fas fa-arrow-left"></i> Kembali
          </a>
          <div class="text-center p-3">
            <h1 class="fw-semibold fs-4">Unggah Cerita Menarikmu !!</h1>
            <p class="text-muted fs-6">Bagikan pengalaman menarik yang kamu alami.</p>
          </div>
          
          <form id="new-story-form" class="row g-4">
            <div class="col-12">
              <label for="description-textarea" class="form-label fw-semibold">Deskripsi Cerita</label>
              <textarea
                class="form-control"
                id="description-textarea"
                name="description"
                placeholder="Tulis cerita menarikmu di sini..."
                rows="4"
              ></textarea>
            </div>
  
            <div class="col-12">
              <label class="form-label fw-semibold">Ambil Foto</label>
              <div class="d-flex flex-column gap-3">
                <button id="open-camera-button" class="btn btn-outline-primary align-self-start" type="button">Buka Kamera</button>
  
                <div id="camera-container" class="d-none border rounded p-3">
                  <div class="mb-3">
                    <video id="camera-video" class="w-100 rounded border"></video>
                    <canvas id="camera-canvas" class="d-none"></canvas>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <select id="camera-select" class="form-select w-50 me-2"></select>
                    <button id="take-picture-button" class="btn btn-primary" type="button">Ambil Gambar</button>
                  </div>
                </div>
  
                <div id="photo-preview-container" class="mt-3 col-6 col-lg-4"></div>
              </div>
            </div>
  
            <div class="col-12">
              <label class="form-label fw-semibold">Lokasi</label>
              <div class="row">
                <div class="ratio ratio-4x3 rounded-3 shadow-sm border">
                  <div id="map" class="rounded-top-4"></div>
                </div>
                <div id="map-loading-container"></div>
                <div class="d-flex py-2 gap-2 justify-content-around">
                  <input type="number" name="latitude" class="form-control" disabled />
                  <input type="number" name="longitude" class="form-control" disabled />
                </div>
              </div>
            </div>
  
            <div class="col-12 d-flex gap-3">
              <span id="submit-button-container">
                <button class="btn btn-primary" type="submit">Kirim Cerita</button>
              </span>
              <a class="btn btn-outline-secondary" href="#/">Batal</a>
            </div>
          </form>
        </div>
      </div>
    </section>
  `;
  

  }

  async afterRender() {
    this.#presenter = new NewStoryPresenter({
      view: this,
      model: API,
      auth: AuthModel,
    });

    this.#setupForm();
    await this.#initialMap();
  }

  #setupForm() {
    this.#form = document.getElementById("new-story-form");

    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        description: this.#form.elements.namedItem("description").value,
        photo: this.#takenImage,
        latitude: this.#form.elements.namedItem("latitude").value,
        longitude: this.#form.elements.namedItem("longitude").value,
      };
    await this.#presenter.postNewStory(data);
    });

    document
      .getElementById("open-camera-button")
      .addEventListener("click", async (event) => {
        const cameraContainer = document.getElementById("camera-container");
        cameraContainer.classList.toggle("open");
        this.#isCameraOpen = cameraContainer.classList.contains("open");

        if (this.#isCameraOpen) {
          event.currentTarget.textContent = "Tutup Kamera";
          this.#setupCamera();
          await this.#camera.launch();
          cameraContainer.classList.remove("d-none")
        } else {
          event.currentTarget.textContent = "Buka Kamera";
          this.#camera.stop();
          cameraContainer.classList.add("d-none")
        }
      });
  }

  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById("camera-video"),
        cameraSelect: document.getElementById("camera-select"),
        canvas: document.getElementById("camera-canvas"),
      });
    }

    this.#camera.addCheeseButtonListener("#take-picture-button", async () => {
      const image = await this.#camera.takePicture();

      if (image.size > 1024 * 1024) {
        alert("Ukuran foto melebihi 1MB. Silakan ambil ulang dengan ukuran lebih kecil.");
        return;
      }

      this.#takenImage = image;

      const previewContainer = document.getElementById("photo-preview-container");
      const imageUrl = URL.createObjectURL(image);
      previewContainer.innerHTML = `
        <img src="${imageUrl}" alt="Preview Foto" class="img-fluid border rounded mt-3" />
      `;
    });
  }

  async #initialMap() {
    this.#map = await Map.build("#map", {
      zoom: 15,
      locate: true,
    });

    const centerCoordinate = this.#map.getCenter();
    this.#updateLatLngInput(centerCoordinate.latitude, centerCoordinate.longitude);

    const marker = this.#map.addMarker([centerCoordinate.latitude, centerCoordinate.longitude], {
      draggable: "true",
    });

    marker.addEventListener("move", (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener("click", (event) => {
      marker.setLatLng(event.latlng);
    });
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem("latitude").value = latitude;
    this.#form.elements.namedItem("longitude").value = longitude;
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Kirim Cerita
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit">Kirim Cerita</button>
    `;
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML = generateLoadingTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  storeSuccessfully(message) {
    this.#form.reset();
    this.#takenImage = null;
    document.getElementById("photo-preview-container").innerHTML = "";
    successAlert("Cerita Berhasil di Tambahkan")
    location.hash = "/";
  }

  storeFailed(message) {
    errorAlert(message);
  }
}
