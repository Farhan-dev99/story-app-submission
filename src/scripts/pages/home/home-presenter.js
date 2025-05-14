import { storyMapper } from '../../data/api-mapper';

export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoryList() {
    this.#view.showLoading();
    try {
      const response = await this.#model.getAllStories();

      if (response.error) {
        console.error("getStories: response:", response);
        return;
      }

      const stories = await Promise.all(
        response.listStory.map((story) =>
          story.lat != null || story.lon != null ? storyMapper(story) : Promise.resolve(story)
        )
      );      

      this.#view.storiesList(stories);
    } catch (error) {
      console.error("showStoriesListError : error:", error);
    } finally {
      this.#view.hideLoading();
    }
  }
}
