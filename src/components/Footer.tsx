import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contacto" className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="text-xl font-bold tracking-tight text-white uppercase font-display flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-stone-100 rotate-45 inline-block shrink-0" aria-hidden="true" />
              <span>Stones Supplies</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Proveedor líder de piedra natural decorativa, mármoles triturados, cantos rodados y agregados para paisajismo, jardinería y arquitectura en Bogotá, la Sabana y Colombia.
            </p>
            <div className="pt-2 text-xs text-stone-500 font-mono">
              Calidad de Cantera Directa · Despachos a Obra
            </div>
          </div>

          {/* Direct Contact (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs uppercase tracking-widest text-stone-400 font-mono font-medium">
              Contacto Directo
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <a 
                href="mailto:stonesuppliess@gmail.com" 
                className="flex items-center gap-2.5 text-stone-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span>stonesuppliess@gmail.com</span>
              </a>

              <a 
                href="https://wa.me/573178626912" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2.5 text-stone-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                <span>+57 3178626912 (WhatsApp Obra)</span>
              </a>

              <div className="flex items-start gap-2.5 text-stone-400">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>Bogotá D.C. & Cobertura Sabana Norte / Occidente</span>
              </div>
            </div>
          </div>

          {/* Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs uppercase tracking-widest text-stone-400 font-mono font-medium">
              Accesos Rápidos
            </div>

            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">
                  Catálogo de Piedras
                </a>
              </li>
              <li>
                <a href="#calculadora" className="hover:text-white transition-colors">
                  Calculadora de Material (m²)
                </a>
              </li>
              <li>
                <a href="#simulador" className="hover:text-white transition-colors">
                  Simulador de Ambientes
                </a>
              </li>
              <li>
                <a href="#logistica" className="hover:text-white transition-colors">
                  Logística y Despachos
                </a>
              </li>
              <li>
                <a 
                  href="0" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 text-stone-400 hover:text-white transition-colors"
                >
                  <span>ALNS</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Quiet Copyright Row */}
        <div className="mt-12 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Stone Supplies. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6">
            <span>Piedras Naturales y Agregados de Cantera</span>
            <span>Bogotá, Colombia</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
