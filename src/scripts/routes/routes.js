import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/new-story/new-story-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/stories/:id': () => checkAuthenticatedRoute(new StoryDetailPage()),
  '/new': () => checkAuthenticatedRoute(new AboutPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
};

export default routes;
