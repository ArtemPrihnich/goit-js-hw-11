import axios from "axios";
import Notiflix from "notiflix";
import "notiflix/dist/notiflix-3.2.5.min.css";
import { fetchImages } from "./search";

const form = document.querySelector("form");
const input = document.querySelector("input");
const btnSubmit = document.querySelector("button");
const list = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more")

export let page = 1;
let loadImagesCounter = 0;

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

        // console.log(imagesArray.data.hits.length)
        if (imagesArray.data.hits.length === 0) {
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300px"/>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
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
        console.log(imagesArray.data.totalHits)
         console.log(loadImagesCounter)
        if (loadImagesCounter >= imagesArray.data.totalHits) {
            loadMoreBtn.classList.remove("is-visible");
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        }
        return list.insertAdjacentHTML("beforeend", itemList);
    } catch (error) {
        console.log(error);
    }
}