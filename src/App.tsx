import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'; // <--- 1. AGREGAMOS OUTLET
import { Hero } from './components/sections/Hero';
import { ProblemStats } from './components/sections/ProblemStats';
import { HowItWorks } from './components/sections/HowItWorks';
import { GameMechanics } from './components/sections/GameMechanics';
import { ValueProposition } from './components/sections/ValueProposition';
import { ProductShowcase } from './components/sections/ProductShowcase';
import { Testimonials } from './components/sections/Testimonials';
import { FAQ } from './components/sections/FAQ';
import { Roadmap } from './components/sections/Roadmap';
import { Footer } from './components/sections/Footer';
import PoliticaDePrivacidad from './components/sections/PrivacyPolitics.tsx';
import { StickyNavigation } from './components/navigation/StickyNavigation';
import { StickyCTA } from './components/ui/StickyCTA';
import DeleteAccount from './components/sections/DeleteAccount';
import DeleteData from './components/sections/DeleteData.tsx';
import NotFound from './components/sections/NotFound.tsx';

// 2. CREAMOS ESTE LAYOUT CON TU ESTRUCTURA ACTUAL
const MainLayout = () => {
  return (
    <div className="min-h-screen font-featherBold">
      <StickyNavigation />
      <main>
        {/* El Outlet renderiza la ruta hija seleccionada (Home, Privacy, etc) */}
        <Outlet />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 3. GRUPO CON DISEÑO (Header y Footer) */}
        <Route element={<MainLayout />}>
            <Route path="/" element={
              <>
                <Hero />
                <ProblemStats />
                <HowItWorks />
                <GameMechanics />
                <ValueProposition />
                <ProductShowcase />
                <Testimonials />
                <FAQ />
                <Roadmap />
              </>
            } />
            <Route path="/privacy" element={
              <div className="py-12">
                <PoliticaDePrivacidad />
              </div>
            } />
            <Route path="/delete-account" element={
              <div className="py-12">
                <DeleteAccount />
              </div>
            } /> 
            <Route path="/delete-data" element={
              <div className="py-12">
                <DeleteData />
              </div>
            } />
        </Route>

        {/* 4. RUTA SIN DISEÑO (NotFound limpio) */}
        {/* Nota: Si quieres que mantenga la fuente, envuélvelo en un div con la clase de la fuente */}
        <Route path="*" element={
            <div className="font-featherBold"> 
                <NotFound /> 
            </div>
        } />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;