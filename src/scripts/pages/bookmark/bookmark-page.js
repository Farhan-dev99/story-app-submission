import BookmarkPresenter from "./bookmark-presenter";
import { generateListStories, generateLoadingTemplate, generateStoriesListEmptyTemplate} from "../../template";
import Database from '../../data/database';

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="container-md py-3">
      <h1>Daftar Cerita Tersimpan</h1>
        <div class="w-100 d-flex justify-content-center my-3 gap-3" id="loading-list-container">
          
        </div>
        <div id="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model : Database,
    });

    this.#presenter.showStoryList();
  }

  storiesList(stories) {
    if (stories.length <= 0) {
      this.storiesListEmpty();
      return;
    }

    const htmlTemplate = stories.map(generateListStories).join("");

    document.getElementById("story-list").innerHTML = `
      <div class="row g-4 justify-content-center">${htmlTemplate}</div>
    `;
  }

  storiesListEmpty() {
    document.getElementById("story-list").innerHTML =
      generateStoriesListEmptyTemplate();
  }

  showLoading() {
    const loading = document.getElementById("loading-list-container");
    loading.innerHTML = generateLoadingTemplate();
  }

  hideLoading() {
    const loading = document.getElementById("loading-list-container");
    loading.innerHTML = ``;
  }
}
