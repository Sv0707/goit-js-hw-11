import './css/styles.css';
// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

import axios from 'axios';
import Notiflix from 'notiflix';
import ApiService from './js/api-service';

const api = new ApiService();

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const clearData = () => {
  refs.gallery.innerHTML = '';
};

const lightbox = new SimpleLightbox('.gallery a', {
    captions: false,
  });

const getData = data => {
const totalPages = Math.ceil(data.totalHits / api.per_page);
  if (data.totalHits === 0) {
    clearData();
    refs.loadMore.classList.add('visually-hidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    return;
  }

  if ((api.page === totalPages) && data.totalHits > 40) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMore.classList.add('visually-hidden');
    return data.hits;
  }

  if (data.hits.length > 0) {
    if (api.page === 1 && data.totalHits > 40) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
      if (api.page === 1 && data.totalHits <= 40) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    refs.loadMore.classList.add('visually-hidden');
    return data.hits;
  }
    refs.loadMore.classList.remove('visually-hidden');
    return data.hits;
    
  }
};

const makeGalleryMarkup = array => {
  const markup = array
    .map(
      item =>
        `<div class="photo-card">
        <a href=${item.largeImageURL}>       
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes: </b>${item.likes}
      </p>
      <p class="info-item">
        <b>Views: </b>${item.views}
      </p>
      <p class="info-item">
        <b>Comments: </b>${item.comments}
      </p>
      <p class="info-item">
        <b>Downloads: </b>${item.downloads}
      </p>
    </div>
    </div>`,
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
};

const showGallery = async () => {
  return api.fetchGallery();
};

const showNextGallery = async () => {
  api.incrementPage();
  return api.fetchGallery();
};

refs.searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  clearData();
  refs.loadMore.classList.add('visually-hidden');
  api.page = 1;
  const searchQuery = e.currentTarget.elements.searchQuery.value;
  api.newInput = searchQuery.trim();
//   showGallery().then(getData).then(makeGalleryMarkup).catch(err => console.log(err));
  const dataResult = await showGallery().catch(err => console.log(err));
  makeGalleryMarkup(getData(dataResult));
});

refs.loadMore.addEventListener('click', async e => {
  const dataResult = await showNextGallery().catch(err => console.log(err));
  makeGalleryMarkup(getData(dataResult));
// showNextGallery().then(getData).then(makeGalleryMarkup).catch(err => console.log(err));
});
