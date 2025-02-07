//ed65938f4936c280db46de5c05ad2cc1

import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Row from './Row';
import requests from "./requests";
import Banner from './Banner';
import Nav from './Nav';
import VotingPage from './VotingPage';
import SignUp from './SignUp';
import SignIn from './SignIn';
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={
            <>
              <Banner />
              <Row title="Netflix Originals" fetchUrl={requests.fetchNetflixOriginals} isLargeRow />
              <Row title="Trending" fetchUrl={requests.fetchTrending} />
              <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
              <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
              <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
              <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
              <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
              <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
            </>
          } />
          <Route path="/voting" element={<VotingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />


        

        </Routes>
      </div>
    </Router>
  );
}

export default App;
