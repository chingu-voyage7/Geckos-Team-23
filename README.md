# Words - tooltip dictionary

A firefox/chrome extension to view defintions as you browse the web.

Project is based on the need that users, many a times, search for the meaning of a word and it's possible for them to forget it when they come across the same word again.

## Getting Started

The words browser extension relies on merriam webster dictionary api to query word's defintions. You will need to register an API key to start local development.
To get started local development, create a file in the root of the repo named .env with the following content:

> DICT_API_KEY='api-key-here'

### Installation

1.  fork and clone the repo
```
git clone https://github.com/chingu-voyage7/Geckos-Team-23.git
```
2.  run yarn in root directory
```
cd Geckos-Team-23/ && yarn install
```
3.  Add [dictionary api](https://dictionaryapi.com/products/index) key as an environment variable `DICT_API` to in `.env` file (in root directory)
5.  run gulp
```
  gulp build
```
6.  load extension from dict folder in chrome or firefox
