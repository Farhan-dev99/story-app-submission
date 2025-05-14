import RegisterPresenter from "./register-presenter";
import * as API from '../../data/api';
import * as AuthModel from '../../utils/auth';
import { successAlert, errorAlert} from '../../utils/alert';

export default class RegisterPage {
  #presenter = null;
  async render() {
    return `
        <section class="container-xl d-flex justify-content-center align-items-center p-2">
          <div class="bg-white shadow rounded-4 p-5 w-100" style="max-width: 450px;">
            <h1 class="fs-4 fw-semibold text-dark mb-1 text-center">Create your account</h1>
            <p class="text-muted mb-4 text-center">Fill in your details to register</p>
            <form role="form" id="register-form">
              <div class="form-floating mb-3">
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  placeholder="Full Name" 
                  autocomplete="name"
                  required>
                <label for="name"><i class="fas fa-user me-2"></i>Full Name</label>
              </div>
              <div class="form-floating mb-3">
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  placeholder="name@example.com"
                  autocomplete="email"
                  required>
                <label for="email"><i class="fas fa-envelope me-2"></i>Email address</label>
              </div>
              <div class="form-floating mb-4">
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  placeholder="Password"
                  autocomplete="new-password"
                  required>
                <label for="password"><i class="fas fa-lock me-2"></i>Password</label>
              </div>
              <div class="d-grid mb-3">
                <button type="submit" id="register-submit-button" class="btn border-0 btn-primary fw-semibold shadow">
                  Register
                </button>
                <div class="spinner-border text-primary mt-3 d-none mx-auto" role="status" id="loading-spinner">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </form>
            <div class="text-center mt-3">
              <a href="#/login" class="text-decoration-none text-primary">Already have an account? <span class="fw-semibold">Login</span></a>
            </div>
          </div>
        </section>
      `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
        view : this,
        model: API,
        authModel: AuthModel,
    })

    this.#submitForm();
  }

  #submitForm() {
    document.getElementById("register-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        }
        await this.#presenter.getRegister(data);
    })
  }

  registerSuccessfully(message) {
    successAlert(message);

    // Redirect
    location.hash = '/login';
  }

  registerFailed(message) {
    errorAlert(message);
  }

  showSubmitLoadingButton() {
    const button = document.getElementById('submit-button');
    const spinner = document.getElementById('loading-spinner');
    button.classList.add("d-none");
    spinner.classList.remove("d-none");
  }

  hideSubmitLoadingButton() {
    const button = document.getElementById('submit-button');
    const spinner = document.getElementById('loading-spinner');
    button.classList.remove("d-none");
    spinner.classList.add("d-none");
  }

}
