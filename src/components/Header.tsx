import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface HeaderProps {
  quoteCount: number;
  onOpenQuote: () => void;
}

export const Header: React.FC<HeaderProps> = ({ quoteCount, onOpenQuote }) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* LOGO OFICIAL CON TU CÓDIGO */}
        <a href="#" className="flex items-center gap-3 shrink-0 group">
          <img 
            src={new URL('../assets/images/logosolo.png', import.meta.url).href} 
            alt="Stones Supplies Logo" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-xl font-bold tracking-tight text-white uppercase font-display hidden sm:inline-block">
            Stones Supplies
          </span>
        </a>

        {/* Menú de Navegación */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
          <a href="#catalogo" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Catálogo
          </a>
          <a href="#calculadora" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Calculadora de Material
          </a>
          <a href="#simulador" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Simulador de Espacios
          </a>
          <a href="#logistica" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Despachos Bogotá
          </a>
          <a href="#contacto" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Contacto
          </a>
        </nav>

        {/* Botón de Cotización */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenQuote}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-stone-100 rounded-sm hover:bg-stone-200 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 shrink-0 text-stone-900" />
            <span>Mi Cotización</span>
            {quoteCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-stone-900 text-stone-100 text-[10px] rounded font-mono font-bold">
                {quoteCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};