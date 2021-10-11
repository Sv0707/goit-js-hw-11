import axios from 'axios';

export default class ApiService {
  #key = '23791107-11d3cac259792c6d6696bfd74';
  BASE_URL = 'https://pixabay.com/api/';

  constructor() {
    this.page = 1;
    this.searchItem = '';
  }

  async fetchGallery() {
    const queryParams = new URLSearchParams({
      key: this.#key,
      q: this.searchItem,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: 40,
    });

    const res = await axios.get(`${this.BASE_URL}?${queryParams}`);
    return res.data;
  }

  incrementPage() {
    this.page += 1;
  }

  set newInput(input) {
    this.searchItem = input;
  }
}
