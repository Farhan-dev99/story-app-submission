import StoryDetailPresenter from "./story-detail-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import * as API from "../../data/api";
import { generateStoryDetailTemplate, generateLoadingTemplate, generateSaveStoryButtonTemplate, generateRemoveStoryButtonTemplate } from "../../template";
import Map from '../../utils/map';
import Database from '../../data/database';
import { successAlert, errorAlert } from "../../utils/alert"

export default class StoryDetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
        <section class="container-md py-3">
            <div>
                <div>
                  <a href="#/" class="text-decoration-none d-inline-flex align-items-center m-2 gap-3">
                    <i class="fas fa-arrow-left"></i> Kembali
                  </a>
                  <h3 class="my-3">Detail Story</h3>
                  <div id="container-detail-story" class="w-100 d-flex justify-content-center">
                  </div>
                </div>
            </div>
            <div class="w-100 d-flex justify-content-center my-3 gap-3" id="loading-detail-container">
                
            </div>
        </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      model: API,
      db: Database,
    });

    this.#presenter.showStoryDetail();
  }

  async storyDetail(story) {
    const htmlTemplate = generateStoryDetailTemplate(story);
  
    document.getElementById("container-detail-story").innerHTML = htmlTemplate;

    if(story.lat != null || story.lon != null ){
      await this.#presenter.showStoryDetailMap();
      if (this.#map) {
        const storyCoordinate = [story.lat, story.lon];
        const markerOptions = { alt: story.name };
        const popupOptions = { content: story.name };
        this.#map.changeCamera(storyCoordinate);
        this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
      }
    }
    this.#presenter.showSaveButton();
   
  }
  
  showLoading() {
    const loading = document.getElementById("loading-detail-container");
    loading.innerHTML = generateLoadingTemplate();
  }

  hideLoading() {
    const loading = document.getElementById("loading-detail-container");
    loading.innerHTML = ``;
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  renderSaveButton() {
    document.getElementById('save-actions-container').innerHTML =
    generateSaveStoryButtonTemplate();

    document.getElementById('story-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveStory();
      await this.#presenter.showSaveButton();
    });
  }

  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
    generateRemoveStoryButtonTemplate();

    document.getElementById('story-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeStory();
      await this.#presenter.showSaveButton();
    });
  }

  saveToBookmarkSuccessfully(message) {
    successAlert(message);
  }

  saveToBookmarkFailed(message) {
    errorAlert(message);
  }
  
  removeFromBookmarkSuccessfully(message) {
    successAlert(message);
  }

  removeFromBookmarkFailed(message) {
    errorAlert(message);
  }
}
