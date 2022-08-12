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
let gallery = null;

form.addEventListener("submit", onFormSubmit);
loadMoreBtn.addEventListener("click", onLoadMoreBtnClick);

async function onFormSubmit(e) {
    e.preventDefault();
    page = 1;
    loadImagesCounter = 0;
    loadMoreBtn.classList.remove("is-visible");
    list.innerHTML = "";

    try {
        const imagesArray = await fetchImages(input.value);
      const itemList = await createImageCard(imagesArray.data.hits);
      const visibleBtn = loadMoreBtn.classList.add("is-visible");
      loadImagesCounter += imagesArray.data.hits.length;

        if (imagesArray.data.hits.length === 0) {
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else {
          Notiflix.Notify.success(`Hooray! We found ${imagesArray.data.totalHits} images.`);
        }
      list.insertAdjacentHTML("beforeend", itemList);
      return gallery = new SimpleLightbox('.gallery a');
    } catch (error) {
        console.log(error);
    }
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

