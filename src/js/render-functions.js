import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
let lightbox = new SimpleLightbox('.gallery a');

export function renderImages(images) {
  gallery.innerHTML = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
            <a href="${largeImageURL}" class="gallery-item">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p>❤️ ${likes}  👁 ${views}  💬 ${comments}  ⬇️ ${downloads}</p>
                </div>
            </a>`
    )
    .join('');
  lightbox.refresh();
}
