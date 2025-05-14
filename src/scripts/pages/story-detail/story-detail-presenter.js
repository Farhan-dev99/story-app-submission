import { storyMapper } from "../../data/api-mapper";

export default class StoryDetailPresenter {
  #view;
  #model;
  #storyId;
  #db;

  constructor(storyId, { view, model, db }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#model = model;
    this.#db = db;
  }

  async showStoryDetailMap() {
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showStoryDetailMap: error:", error);
    } finally {
    }
  }

  async showStoryDetail() {
    this.#view.showLoading();
    try {
      const response = await this.#model.getStoryById(this.#storyId);

      if (response.error) {
        console.error("getStories: response:", response);
        return;
      }

      const story = response.story.lat != null || response.story.lon != null ? await storyMapper(response.story) : response.story;
      this.#view.storyDetail(story);
    } catch (error) {
      console.error("showStoryDetailError : error:", error);
    } finally {
      this.#view.hideLoading();
    }
  }

  async saveStory() {
    try {
      const story = await this.#model.getStoryById(this.#storyId);
      await this.#db.putStory(story.story);

      this.#view.saveToBookmarkSuccessfully('Success to save to bookmark');
    } catch (error) {
      console.error('saveStory: error:', error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async removeStory() {
    try {
      await this.#db.removeStory(this.#storyId);
      this.#view.removeFromBookmarkSuccessfully('Success to remove from bookmark');
    } catch (error) {
      console.error('removeSory: error:', error);
      this.#view.removeFromBookmarkFailed(error.message);
    }
  }

  async showSaveButton() {
    if (await this.#isStorySaved()) {
      this.#view.renderRemoveButton();
      return;
    }
 
    this.#view.renderSaveButton();
  }
 
  async #isStorySaved() {
    return !!(await this.#db.getStoryById(this.#storyId));
  }
}
