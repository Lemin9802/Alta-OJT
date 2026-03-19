import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header/Header';
import Content from './components/content/Content';
import Footer from './components/footer/Footer';  
import FruitForm from './components/fruitForm/FruitForm';

function App() {
  return (
    <>
    <Header />
    <Content />
    <FruitForm />
    <Footer />
    </>
  );
}

export default App;
