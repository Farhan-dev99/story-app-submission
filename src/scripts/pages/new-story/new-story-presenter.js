export default class NewStoryPresenter {
  #view;
  #model;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
  }

  async showMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewStory({ description, latitude, longitude, photo }) {
    this.#view.showSubmitLoadingButton();
    try {
      const data = {
        description: description,
        photo: photo,
        latitude: latitude,
        longitude: longitude,
      };
      const response = await this.#model.storeNewStory(data);

      if (response.error) {
        console.error('postNewStory: response:', response);
        this.#view.storeFailed(response.message);
        return;
      }

      this.#view.storeSuccessfully(response.message, response.data);
    } catch (error) {
      console.error('postNewStory: error:', error);
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
