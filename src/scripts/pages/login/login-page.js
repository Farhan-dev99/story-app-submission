import LoginPresenter from "./login-presenter";
import * as API from '../../data/api';
import * as AuthModel from '../../utils/auth';
import {successAlert, errorAlert} from '../../utils/alert';

export default class LoginPage {
  #presenter = null;
  async render() {
    return `
      <section class="container-xl d-flex justify-content-center align-items-center p-2">
        <div class="bg-white shadow rounded-4 p-5 w-100" style="max-width: 450px;">
          <h1 class="fs-4 fw-semibold text-dark mb-1">Welcome back!</h1>
          <p class="text-muted mb-4">Enter your email and password to continue</p>
          <form role="form" id="login-form">
            <div class="form-floating mb-3">
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                placeholder="name@example.com"
                required>
              <label for="email"><i class="fas fa-envelope me-2"></i>Email address</label>
            </div>
            <div class="form-floating mb-4">
              <input 
                type="password" 
                class="form-control" 
                id="password" 
                placeholder="Password"
                required>
              <label for="password"><i class="fas fa-lock me-2"></i>Password</label>
            </div>
            <div class="d-grid mb-3">
              <button type="submit" id="submit-login-button" class="btn border-0 btn-primary fw-semibold shadow">
                Login
              </button>
              <div class="spinner-border text-primary mt-3 d-none mx-auto" role="status" id="loading-spinner">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </form>
          <div class="text-center mt-3">
            <a href="#/register" class="text-decoration-none text-primary">Don’t have an account? <span class="fw-semibold" >Register</span></a>
          </div>
        </div>
      </section>
      `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
        view : this,
        model: API,
        authModel: AuthModel,
    })

    this.#submitForm();
  }

  #submitForm() {
    document.getElementById("login-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        }
        await this.#presenter.getLogin(data);
    })
  }

  loginSuccessfully(message) {
    successAlert("Berhasil Login");
    location.hash = '/';
  }

  loginFailed(message) {
    errorAlert(message);
  }

  showSubmitLoadingButton() {
    const button = document.getElementById('submit-login-button');
    const spinner = document.getElementById('loading-spinner');
    button.classList.add("d-none");
    spinner.classList.remove("d-none");
  }

  hideSubmitLoadingButton() {
    const button = document.getElementById('submit-login-button');
    const spinner = document.getElementById('loading-spinner');
    button.classList.remove("d-none");
    spinner.classList.add("d-none");
  }

}
