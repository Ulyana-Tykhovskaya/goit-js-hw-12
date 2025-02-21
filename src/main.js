import { fetchImages } from './js/pixabay-api.js';
import { renderImages } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loader = document.querySelector('#loader');
const gallery = document.querySelector('.gallery');
const fetchPostsBtn = document.querySelector('.btn');

let page = 1;
const per_page = 40;
let searchQuery = '';
fetchPostsBtn.style.display = 'none';

fetchPostsBtn.addEventListener('click', async () => {
  page += 1;
  await loadImages();
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    iziToast.warning({ title: 'Ошибка', message: 'Введите поисковый запрос!' });
    return;
  }

  page = 1;
  gallery.innerHTML = '';
  fetchPostsBtn.style.display = 'none';
  loader.style.display = 'block';

  await loadImages();
});

async function loadImages() {
  try {
    const data = await fetchImages(searchQuery, page, per_page);
    loader.style.display = 'none';

    if (!data.hits || data.hits.length === 0) {
      iziToast.error({
        title: 'Ошибка',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    renderImages(data.hits);
    scrollPage();

    if (page * per_page >= data.totalHits) {
      fetchPostsBtn.style.display = 'none';
      iziToast.info({
        title: 'Конец результатов',
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      fetchPostsBtn.style.display = 'block';
    }
  } catch (error) {
    loader.style.display = 'none';
    iziToast.error({
      title: 'Ошибка',
      message: 'Не удалось загрузить больше изображений',
    });
  }
}

function scrollPage() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    const { height } = galleryItems[0].getBoundingClientRect();
    window.scrollBy({
      top: height * 2,
      behavior: 'smooth',
    });
  }
}
