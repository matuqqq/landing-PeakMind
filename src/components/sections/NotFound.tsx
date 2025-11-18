import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Map, HelpCircle, ArrowLeft } from 'lucide-react';

// Asumo que tienes estos componentes o usaré estilos inline de Tailwind que coinciden con tu UI
// Si tienes los componentes importados, descomenta las líneas y sustituye los botones
// import { Button } from '../ui/Button';
// import { Badge } from '../ui/Badge';

export const NotFound = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center overflow-hidden px-4">
      
      {/* Elementos de fondo decorativos (Background Blobs) */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />

      <div className="max-w-4xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Columna Izquierda: Texto y Acción */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left space-y-6 order-2 lg:order-1"
        >
          {/* Badge de Error */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-3 py-1 rounded-full border border-red-200 bg-violet-50 text-red-700 text-sm font-medium mb-4"
          >
            <Map className="w-4 h-4 mr-2" />
            Error 404
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
            ¡Ups! Este nivel{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              está bloqueado
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0">
            Parece que te has salido del mapa. La página que buscas no existe.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
          >
            <Link to="/">
              <button className="flex items-center justify-center px-8 py-3 bg-violet-600 text-white rounded-xl font-semibold shadow-lg hover:bg-violet-700 transition-all hover:scale-105 w-full sm:w-auto">
                <Home className="w-5 h-5 mr-2" />
                Volver al Lobby
              </button>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Regresar
            </button>
          </motion.div>
        </motion.div>

        {/* Columna Derecha: Visual / Mascota */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative order-1 lg:order-2 flex justify-center"
        >
          <div className="relative w-full max-w-md aspect-square">
            {/* Contenedor estilo Card Glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-indigo-100/50 rounded-3xl border-4 border-white shadow-2xl backdrop-blur-sm flex items-center justify-center">
              
              {/* Mascota Peaky (Confundida/Base) */}
              <img 
                src="/assets/peakyPC.png" 
                alt="Peaky Lost" 
                className="w-64 h-auto object-contain drop-shadow-lg" 
              />
            </div>

            {/* Elementos Flotantes (Floating Elements) */}
            <motion.div
              animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-lg border border-violet-100"
            >
              <HelpCircle className="w-10 h-10 text-red-500" />
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg border border-indigo-100"
            >
              <span className="text-3xl font-bold text-red-500">?</span>
            </motion.div>

             {/* Badge 404 grande decorativo detrás */}
             <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-violet-900/5 select-none pointer-events-none">
               404
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default NotFound;