import React from 'react';
import { Product } from '../types';
import { X, Check, Calculator, Plus, ShieldCheck, Ruler, Layers, Sparkles } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onUseInCalculator: (productId: string) => void;
  onAddToQuote: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onUseInCalculator,
  onAddToQuote
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-sm shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-stone-900/60 hover:bg-stone-900 text-white rounded-full transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Product Image */}
          <div className="relative aspect-4/3 md:aspect-auto bg-stone-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none md:hidden" />
          </div>

          {/* Right Column: Technical Specs */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                <span>{product.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>Cantera Certificada</span>
              </div>

              <h2 className="text-2xl font-bold text-stone-900 font-display">
                {product.name}
              </h2>

              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Technical Spec Matrix */}
              <div className="mt-6 pt-5 border-t border-stone-100 space-y-3">
                <div className="flex items-start justify-between text-xs">
                  <span className="text-stone-500 font-medium flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-stone-400" />
                    Granulometría / Calibre
                  </span>
                  <span className="font-semibold text-stone-900 font-mono text-right">
                    {product.granulometry}
                  </span>
                </div>

                <div className="flex items-start justify-between text-xs">
                  <span className="text-stone-500 font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-stone-400" />
                    Rendimiento Estándar
                  </span>
                  <span className="font-semibold text-stone-900 text-right">
                    {product.coveragePerM2}
                  </span>
                </div>

                <div className="flex items-start justify-between text-xs">
                  <span className="text-stone-500 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                    Densidad Técnica
                  </span>
                  <span className="font-semibold text-stone-900 font-mono text-right">
                    {product.densityKgPerM3} kg/m³
                  </span>
                </div>
              </div>

              {/* Recommended Applications */}
              <div className="mt-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                  Aplicaciones Recomendadas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.applications.map((app, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-sm border border-stone-200"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Purchase / Calculation Bar */}
            <div className="mt-8 pt-5 border-t border-stone-200">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs text-stone-500">Precio de referencia</span>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                    ${product.estimatedPriceCOP.toLocaleString('es-CO')}
                  </span>
                  <span className="text-xs text-stone-500 block">
                    COP por {product.priceUnitLabel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onUseInCalculator(product.id);
                    onClose();
                  }}
                  className="py-2.5 px-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calcular m²</span>
                </button>

                <button
                  onClick={() => {
                    onAddToQuote(product);
                    onClose();
                  }}
                  className="py-2.5 px-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cotizar</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
