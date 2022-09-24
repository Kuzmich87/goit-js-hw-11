import fetchImages from './js/search-images/fetch-images';
import cardTemplate from './js/templates/card-template.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const ref = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    btSearch: document.querySelector('.search-btn'),                //*Доступ к кнопке отправки
    searchInput:document.querySelector('input[name="searchQuery"]') //*Доступ к поля инпута
}

let searchQuery = '';
let currentHits = 0;
let currentPage = 1;


ref.searchForm.addEventListener('submit', onSearch);
ref.loadMoreBtn.addEventListener('click', onloadMoreBtn);

//*Функция на блокировки кнопки отправки когда поле пустое
const checkLength = function (e) {
  if (ref.searchInput != ''){
    ref.btSearch.removeAttribute('disabled')
  }
}
ref.searchInput.addEventListener('keyup', checkLength);
//*
let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function renderCardImage(arr) {
  const markup = arr.map(item => cardTemplate(item)).join('');
  ref.gallery.insertAdjacentHTML('beforeend', markup);
}

async function onSearch(e) {
    e.preventDefault();
    searchQuery = e.currentTarget.searchQuery.value;
    currentPage = 1;
  
    if (searchQuery === '') {
    return;
  }
const response = await fetchImages(searchQuery, currentPage);
  
currentHits = response.hits.length;
  if (response.totalHits > 40) {
  ref.loadMoreBtn.classList.remove('is-hidden');
}
  else {
  ref.loadMoreBtn.classList.add('is-hidden');
  }
 
  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      ref.gallery.innerHTML = '';
      renderCardImage(response.hits);
      lightbox.refresh();

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }

    if (response.totalHits === 0) {
      ref.gallery.innerHTML = '';
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      ref.loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onloadMoreBtn() {
   currentPage += 1;

   const response = await fetchImages(searchQuery, currentPage);
   renderCardImage(response.hits);
   lightbox.refresh();
  
    currentHits += response.hits.length;
  
  if (currentHits === response.totalHits) {
    ref.loadMoreBtn.classList.add('is-hidden');
  }
}

