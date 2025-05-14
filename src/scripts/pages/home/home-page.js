import HomePresenter from "./home-presenter";
import * as API from "../../data/api";
import { generateListStories, generateLoadingTemplate, generateStoriesListEmptyTemplate } from "../../template";

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="container-md">
        <div class="w-100 d-flex justify-content-center my-3 gap-3" id="loading-list-container">
          
        </div>
        <div id="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: API,
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
