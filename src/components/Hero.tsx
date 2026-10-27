import React from 'react';
import { ArrowRight, Calculator, CheckCircle2, ShieldCheck, Truck, Sparkles } from 'lucide-react';

interface HeroProps {
  onScrollToCalculator: () => void;
  onScrollToCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToCalculator, onScrollToCatalog }) => {
  return (
    <section className="relative bg-stone-900 text-stone-100 overflow-hidden border-b border-stone-800">
      {/* Background ambient lighting */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#a8a29e_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          
          {/* Left Column: Brand Copy & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Clean unboxed metadata separator */}
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-stone-400 mb-4">
              <span>Bogotá & Sabana</span>
              <span aria-hidden="true">·</span>
              <span>Cantera y Paisajismo</span>
              <span aria-hidden="true">·</span>
              <span>Piedra Natural Seleccionada</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-display text-balance mb-6">
              Piedra natural, mármol y agregados para arquitectura y jardines.
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl mb-8">
              Suministramos piedra blanca crystal, pizarra negra, cantos rodados de río y mármoles triturados en Bogotá y toda Colombia. Calidad de cantera para paisajistas, arquitectos y proyectos residenciales con entrega en obra.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                onClick={onScrollToCalculator}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-stone-950 bg-stone-100 rounded-sm hover:bg-stone-200 transition-colors shadow-sm whitespace-nowrap"
              >
                <Calculator className="w-4 h-4 shrink-0" />
                <span>Calcular Material para mi Proyecto</span>
              </button>

              <button
                onClick={onScrollToCatalog}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-stone-200 border border-stone-700 bg-stone-800/40 hover:bg-stone-800 hover:text-white rounded-sm transition-colors whitespace-nowrap"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

            {/* Micro proof points */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-800 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bultos de 30kg, 40kg o Granel en Volqueta</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Despachos ágiles en Bogotá, Chía y Sabana</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 flex items-stretch">
            <div className="relative w-full rounded-sm overflow-hidden border border-stone-700/60 shadow-2xl bg-stone-800 min-h-[380px] lg:min-h-full flex flex-col">
              <img
                src="/src/assets/images/disenointerior.png"
                alt="Proyecto arquitectónico con piedra decorativa blanca, pizarra negra y vegetación en Bogotá"
                className="w-full h-full object-cover object-center flex-1"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent pointer-events-none" />
              
              {/* Bottom Scrim Caption */}
              <div className="absolute bottom-0 inset-x-0 p-6 text-stone-200">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-stone-400 font-medium">Proyecto Referencia</div>
                    <div className="text-sm font-semibold text-white">Sendero Zen con Piedra Blanca Crystal & Pasos de Pizarra</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-stone-400 block">Acabado</span>
                    <span className="text-xs font-mono font-medium text-emerald-400">Zero Mantenimiento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Full-width 4-metric strip below hero split */}
        <div className="mt-16 pt-10 border-t border-stone-800 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">+12</div>
            <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-medium">Variedades de Cantera</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">100%</div>
            <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-medium">Mineral Natural Genuino</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">+10%</div>
            <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-medium">Factor Merma en Cálculo</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">24 - 48h</div>
            <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-medium">Despacho en Bogotá</div>
          </div>
        </div>

      </div>
    </section>
  );
};
