import React from 'react';
import Header from './app/layouts/Header';
import Footer from './app/layouts/Footer';
import Routes from "./routes/Routes";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes />
      <Footer />
    </div >
  );
}

export default App;
