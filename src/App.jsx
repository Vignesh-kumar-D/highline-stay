import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';

import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import ContactBar from './components/shared/ContactBar';

import Home from './components/routes/Home';
import Rooms from './components/routes/Rooms';
import Services from './components/routes/Services';
import Gallery from './components/routes/Gallery';
import About from './components/routes/About';
import Contact from './components/routes/Contact';

function App() {
  return (
    <BookingProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <ContactBar />
        <Footer />
      </Router>
    </BookingProvider>
  );
}

export default App;
