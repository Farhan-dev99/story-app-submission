import { storyMapper } from '../../data/api-mapper';

export default class BookmarkPresenter {
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
      console.log(response);

      if (response.error) {
        console.error("getStories: response:", response);
        return;
      }

      const stories = await Promise.all(
        response.map((story) =>
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
