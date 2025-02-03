//ed65938f4936c280db46de5c05ad2cc1

import './App.css';
import React from 'react';
import Row from './Row';
import requests from "./requests";
import Banner from './Banner';
import './Row.css';
import Nav from './Nav';

function App() {
  return (
    <div className="App">
      <Nav />
     <Banner />
      <Row title="NETFLIX_ORIGINALS" fetchUrl={requests.fetchNetflixOriginals} isLargeRow={true} />
      <Row title="Trending"fetchUrl={requests.fetchTrending} />
      <Row title="TopRated"fetchUrl={requests.fetchTopRated} />
      <Row title="ActionMovies"fetchUrl={requests.fetchActionMovies} />
      <Row title="ComedyMovies"fetchUrl={requests.fetchComedyMovies} />
      <Row title="HorrorMovies"fetchUrl={requests.fetchHorrorMovies} />
      <Row title="RomanceMovies"fetchUrl={requests.fetchRomanceMovies} />
      <Row title="Documentaries"fetchUrl={requests.fetchDocumentaries} />
    </div>
  );
}

export default App;
