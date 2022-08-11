import axios from "axios";
import { page } from "./index";

const URL = 'https://pixabay.com/api/'
const KEY = '29199195-44cd762621e598e52ffe0971c';

export async function fetchImages(value) {
    try {
        const response = await axios.get(`${URL}?key=${KEY}&per_page=40&page=${page}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true`);
        return response;
    } catch (error) {
        console.log (error)
    }
}