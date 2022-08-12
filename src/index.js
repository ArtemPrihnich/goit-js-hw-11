import axios from "axios";
import Notiflix from "notiflix";
import "notiflix/dist/notiflix-3.2.5.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages } from "./search";

const form = document.querySelector("form");
const input = document.querySelector("input");
const btnSubmit = document.querySelector("button");
const list = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more")

export let page = 1;
let loadImagesCounter = 0;
// let lightbox = null;

form.addEventListener("submit", onFormSubmit);
loadMoreBtn.addEventListener("click", onLoadMoreBtnClick);

let gallery = new SimpleLightbox('.gallery a');

async function onFormSubmit(e) {
    e.preventDefault();
    page = 1;
    loadImagesCounter = 0;
    loadMoreBtn.classList.remove("is-visible");
    list.innerHTML = "";

    try {
        const imagesArray = await fetchImages(input.value);
      const itemList = await createImageCard(imagesArray.data.hits);
      // const gallery = await new SimpleLightbox('.gallery a');
      // console.log(await "1")
      //  let gallery = await new SimpleLightbox('.test .gallery .photo-card a', { captionDelay: 250 });
      // const lightbox = new SimpleLightbox('.photo-card a', {});
      // const lightbox = await new SimpleLightbox('.test .gallery .photo-card a', { captionDelay: 250 });
      // console.log(lightbox)
      // console.log(2)
      const visibleBtn = loadMoreBtn.classList.add("is-visible");
      loadImagesCounter += imagesArray.data.hits.length;

        // console.log(imagesArray.data.hits.length)
        if (imagesArray.data.hits.length === 0) {
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else {
          Notiflix.Notify.success(`Hooray! We found ${imagesArray.data.totalHits} images.`);
        }
        return list.insertAdjacentHTML("beforeend", itemList);
    } catch (error) {
        console.log(error);
    }
    // fetchImages(input.value).then(response => console.log(response));
}

function createImageCard(arr) {
    return arr.reduce((acc, { webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => acc + 
    `<div class="photo-card">
  <a class ="link" href ="${largeImageURL}"><img class="img" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b class ="test2">Likes: <span class ="info-text">${likes}</span></b>
    </p>
    <p class="info-item">
      <b class ="test2">Views: <span class ="info-text">${views}</span></b>
    </p>
    <p class="info-item">
      <b class ="test2">Comments: <span class ="info-text">${comments}</span></b>
    </p>
    <p class="info-item">
      <b class ="test2">Downloads: <span class ="info-text">${downloads}</span></b>
    </p>
  </div>
</div>`, "")
}

async function onLoadMoreBtnClick() {
    page += 1;

    // if (page > 1) {
    //     loadMoreBtn.classList.add("is-visible")
    // }

    try {
        const imagesArray = await fetchImages(input.value);
      const itemList = await createImageCard(imagesArray.data.hits);
      loadImagesCounter += imagesArray.data.hits.length;
        if (loadImagesCounter >= imagesArray.data.totalHits) {
            loadMoreBtn.classList.remove("is-visible");
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        }
        return list.insertAdjacentHTML("beforeend", itemList);
    } catch (error) {
        console.log(error);
    }
}

// let gallery = new SimpleLightbox('.photo-card a');
// gallery.on('show.simplelightbox', function () {
// 	// Do something…
// });

// function clickShveps (e) {
//   e.preventDefault();

//   // const gallery = await new SimpleLightbox('.photo-card a');
//         gallery.on('show.simplelightbox', function () {
// 	        // Do something…
//           });
// }
// const lightbox = new SimpleLightbox('.test .gallery .photo-card a', { captionDelay: 250 });
