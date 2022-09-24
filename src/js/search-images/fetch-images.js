import axios from 'axios';


export default async function fetchImages(value, page) {
    const url = 'https://pixabay.com/api/';
    const key = '30098517-b57c06f0b96fc3ff10cf16452';
    const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
   
    return await axios.get(`${url}${filter}`).then(response => response.data );
};

