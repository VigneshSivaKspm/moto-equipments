
import React from 'react';
import './App.css';

import MainLayout from './components/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MotorcycleHelmetsPage from './components/MotorcycleHelmetsPage';
import BikerEquipmentsPage from './components/BikerEquipmentsPage';
import AirbagProtectionPage from './components/AirbagProtectionPage';
import SparePartsAccessoriesPage from './components/SparePartsAccessoriesPage';
import SportswerePage from './components/SportswerePage';
import CategoryPage from './components/CategoryPage';
import ScooterEquipmentPage from './components/ScooterEquipmentPage';
import ContactPage from './components/ContactPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import ScrollToTop from './components/ScrollToTop';


const Home = () => (
  <>
    <div style={{marginBottom: 80}}>
      <SparePartsAccessoriesPage variant="carousel" />
    </div>
    <div style={{marginBottom: 80}}>
      <SportswerePage variant="carousel" />
    </div>
    <div style={{marginBottom: 80}}>
      <BikerEquipmentsPage variant="carousel" />
    </div>
    <div style={{marginBottom: 80}}>
      <MotorcycleHelmetsPage variant="carousel" />
    </div>
    <div style={{marginBottom: 80}}>
      <AirbagProtectionPage variant="carousel" />
    </div>
  </>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/product" element={<ProductDetailsPage />} />
          <Route path="/helmets" element={<MotorcycleHelmetsPage />} />
          <Route path="/biker-equipments" element={<BikerEquipmentsPage />} />
          <Route path="/airbag-protection" element={<AirbagProtectionPage />} />
          <Route path="/spare-parts-accessories" element={<SparePartsAccessoriesPage />} />
          <Route path="/sportswear" element={<SportswerePage />} />
          <Route path="/scooter-equipment" element={<ScooterEquipmentPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
