import './css/styles.css';
// Описан в документации
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";

import axios from "axios";
import Notiflix from 'notiflix';
import ApiService from "./js/api-service";

const api = new ApiService();

const refs = {
    searchForm: document.querySelector("#search-form"),
    gallery: document.querySelector(".gallery"),
    loadMore: document.querySelector(".load-more")
}

const clearData = () => {
    refs.gallery.innerHTML = '';
  } 

const getData = (data) => {

    if (data.hits.length === 0) {
        refs.loadMore.classList.add("visually-hidden");
        clearData();
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    }

    if (api.page === Math.trunc(data.totalHits / data.hits.length)) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        refs.loadMore.classList.add("visually-hidden");
        return;
    }

    if (data.hits.length > 0) {
        if (api.page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
        return data.hits;
    }
}

const makeGalleryMarkup = (array) => {
    const markup = array.map(item =>
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
    </div>`).join('');
    
  refs.gallery.insertAdjacentHTML("beforeend", markup);
  refs.loadMore.classList.remove("visually-hidden");

  const lightbox = new SimpleLightbox('.gallery a');
    }  
    

const showGallery = () => {
        return api.fetchGallery(); 
        }

const showNextGallery = () => {
    api.incrementPage();
    return api.fetchGallery(); 
}

refs.searchForm.addEventListener("submit", e => {
    e.preventDefault();
    clearData();
    const searchQuery = e.currentTarget.elements.searchQuery.value;
    api.newInput = searchQuery;
    showGallery().then(getData).then(makeGalleryMarkup).catch(err => console.log(err));
})

refs.loadMore.addEventListener("click", e => {
    showNextGallery().then(getData).then(makeGalleryMarkup).catch(err => console.log(err));

})



