import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { getToken, getLogout } from '../utils/auth';
import { confirmAlert } from '../utils/alert';
import { setupSkipToContent, transitionHelper, isServiceWorkerAvailable, } from '../utils';
import { subscribe,unsubscribe, isCurrentPushSubscriptionAvailable } from '../utils/notification-helper';
import { generateAuthenticatedNavigationListTemplate, generateUnsubscribeButtonTemplate, generateUnauthenticatedNavigationListTemplate, generateSubscribeButtonTemplate, } from '../template';
import NotFoundPage from '../pages/not-found/not-found-page';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipLinkButton = null;

  constructor({ navigationDrawer, drawerButton, content, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      const isTargetInsideDrawer = this.#navigationDrawer.contains(event.target);
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  #setupNavigationList(){
    const isLogin = !!getToken();
    const navDrawer = document.getElementById('navigation-drawer');

    if (!isLogin) {
      navDrawer.innerHTML = '';
      navDrawer.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    navDrawer.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', async (event) => {
      event.preventDefault();

      const isConfirmed = await confirmAlert('Apakah Anda yakin ingin keluar?');

      if (isConfirmed) {
        getLogout();
        location.hash = '/login';
      }
    });
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
 
    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        unsubscribe().finally(() => {
          this.#setupPushNotification();
        });
      });
 
      return;
    }
 
    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
    document.getElementById('subscribe-button').addEventListener('click', () => {
      subscribe().finally(() => {
        this.#setupPushNotification();
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    const page = new route();

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        if (page.afterRender) page.afterRender();
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.#setupNavigationList();

      if (isServiceWorkerAvailable()) {
        this.#setupPushNotification();
      }
    });
  }
}

export default App;
