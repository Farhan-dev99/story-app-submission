import { showFormattedDate, sliceDescription } from "./utils";

export function generateUnauthenticatedNavigationListTemplate() {
  return `
      <ul id="nav-list" class="nav-list gap-3 list-unstyled m-0">
        <li><a class="" href="#/login">Login</a></li>
        <li><a class="" href="#/register">Register</a></li>
      </ul>
    `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <ul id="nav-list" class="nav-list gap-3 list-unstyled m-0">
      <li id="push-notification-tools" class="push-notification-tools"></li>
      <li><a href="#/bookmark" class="">Cerita Tersimpan</a></li>
      <li><a href="#/new" class="">Buat Cerita</a></li>
      <li>
        <a id="logout-button" class="" href="#/logout">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </a>
      </li>
    </ul>
  `;
}

export function generateLoadingTemplate() {
  return `
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  `;
}
export function generateListStories({
  name,
  description,
  photoUrl,
  createdAt,
  id,
  placeName,
}) {
  return `
    <div class="col-10 col-md-6 col-lg-4">
      <div class="card h-100 border-0 shadow-lg p-3 d-flex flex-column">
        <div class="d-flex align-items-center gap-2 mb-2">
          <i class="fas fa-user p-2 rounded-pill text-black"></i>
          <div class="d-flex flex-column gap-0">
            <p class="fw-bold mb-0">${name}</p>
            ${
              placeName ? `<p class="fw-light small mb-0">${placeName}</p>` : ""
            }
          </div>
        </div>
        <div class="mb-2 flex-grow-1 d-flex ratio ratio-4x3">
          <img src="${photoUrl}" class="w-100 h-100 object-fit-cover" alt="Foto Cerita ${name}">
        </div>
        <div class="mt-auto">
          <div class="p-2">
            <p class="fw-semibold text-end mb-1">${showFormattedDate(
              createdAt
            )}</p>
            <p class="mb-2"><span class="fw-semibold">${name}</span> ${sliceDescription(
    description
  )}</p>
          </div>
          <div class="d-flex justify-content-end align-items-center gap-2 p-3 text-primary">
            <a href="#/stories/${id}" class="text-decoration-none fw-semibold">Cek Detail Story</a>
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function generateStoriesListEmptyTemplate() {
  return `
        <div>
            <h2>Tidak ada story yang tersedia</h2>
        </div>
    `;
}

export function generateStoryDetailTemplate({
  name,
  description,
  photoUrl,
  createdAt,
  placeName,
  lat,
  lon,
}) {
  const locationInfo =
    lat !== null && lon !== null
      ? `<div class="ratio ratio-4x3 rounded-top-4">
          <div id="map" class="w-100 h-100 rounded-top-4"></div>
        </div>
        <p class="m-0 fw-light align-items-center p-3"><i class="fas fa-map-marker-alt text-danger"></i> ${placeName}</p>`
      : ` <p class="m-0 text-center fw-semibold text-muted p-3">Lokasi tidak tersedia</p>`;

  return `
    <div class="container">
    <div class="row g-4 justify-content-center">
      <div class="col-10 col-lg-8">
        <div class="rounded-4 shadow-lg p-3 d-flex flex-column gap-3">
          <div class="ratio ratio-4x3">
            <img src="${photoUrl}" alt="Foto Cerita ${name}" class="rounded-3 w-100 h-100 object-fit-cover">
          </div>
          <div class="">
            <div class="d-flex justify-content-between">
              <h3 class="fw-semibold">${name}</h3>
              <div id="save-actions-container">
              
              </div>
            </div>
            <p class="mb-3">${description}</p>
            <p class="text-muted small">
              <i class="fas fa-calendar-alt me-2"></i> ${showFormattedDate(
                createdAt
              )}
            </p>
          </div>
        </div>
      </div>
      <div class="col-10 col-lg-4">
        <div class="rounded-4 shadow-sm bg-light">
          ${locationInfo}
        </div>
      </div>
    </div>
  </div>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}

export function generateSaveStoryButtonTemplate() {
  return `
    <button id="story-detail-save" class="fs-3 btn btn-transparent m-0 p-0">
      <i class="far fa-bookmark"></i>
    </button>
  `;
}

export function generateRemoveStoryButtonTemplate() {
  return `
    <button id="story-detail-remove" class="fs-3 btn btn-transparent m-0 p-0">
      <i class="fas fa-bookmark"></i>
    </button>
  `;
}