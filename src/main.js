import { fetchImages } from './js/pixabay-api.js';
import { renderImages } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loader = document.querySelector('#loader');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', async event => {
  event.preventDefault();
  const query = event.target.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.warning({ title: 'Ошибка', message: 'Введите поисковый запрос!' });
    return;
  }

  gallery.innerHTML = '';
  loader.style.display = 'block';

  const images = await fetchImages(query);
  loader.style.display = 'none';

  if (images.length === 0) {
    iziToast.error({
      title: 'Ошибка',
      message:
        'Sorry, there are no images matching your search query. Please try again!',
    });
    return;
  }
  renderImages(images);
});
