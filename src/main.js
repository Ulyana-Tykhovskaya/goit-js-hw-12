import { fetchImages } from './js/pixabay-api.js';
import { renderImages } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loader = document.querySelector('#loader');
const gallery = document.querySelector('.gallery');
const fetchPostsBtn = document.querySelector('.btn');
const inputEl = form.querySelector('input');

let page = 1;
const per_page = 40;
let searchQuery = '';

fetchPostsBtn.style.display = 'none';
loader.style.display = 'none';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  searchQuery = inputEl.value.trim();

  if (!searchQuery) {
    iziToast.warning({ title: 'Ошибка', message: 'Введите поисковый запрос!' });
    return;
  }

  page = 1;
  gallery.innerHTML = '';
  fetchPostsBtn.style.display = 'none';
  loader.style.display = 'block';

  await loadImages(false);
});

fetchPostsBtn.addEventListener('click', async () => {
  page += 1;
  loader.style.display = 'block';
  await loadImages(true);
});

// ✅ Фикс скрытия лоадера и показа кнопки
async function loadImages(shouldScroll) {
  try {
    const data = await fetchImages(searchQuery, page, per_page);

    if (!data.hits || data.hits.length === 0) {
      iziToast.error({
        title: 'Ошибка',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    renderImages(data.hits);
    lightbox.refresh();

    if (shouldScroll) {
      scrollPage();
    }

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
    console.error('Ошибка при загрузке изображений:', error);
    iziToast.error({
      title: 'Ошибка',
      message: 'Не удалось загрузить больше изображений',
    });
  } finally {
    loader.style.display = 'none';
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
