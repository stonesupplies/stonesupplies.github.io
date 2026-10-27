import React, { useState } from 'react';
import { Product } from '../types';
import { Search, Eye, Plus, Calculator, Check, X, Shield, Sparkles } from 'lucide-react';

interface CatalogProps {
  products: Product[];
  onOpenProductDetail: (product: Product) => void;
  onUseInCalculator: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  onOpenProductDetail,
  onUseInCalculator,
  onQuickAdd
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickAddStatus, setQuickAddStatus] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'todos', label: 'Todos los Materiales' },
    { id: 'decorativa', label: 'Piedra Decorativa' },
    { id: 'marmol', label: 'Mármoles' },
    { id: 'canto_rodado', label: 'Canto Rodado' },
    { id: 'lajas', label: 'Lajas & Pizarra' },
    { id: 'triturados', label: 'Triturados' },
    { id: 'arenas', label: 'Arenas' },
  ];

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.applications.some(app => app.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleQuickAddClick = (product: Product) => {
    onQuickAdd(product);
    setQuickAddStatus(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setQuickAddStatus(prev => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section id="catalogo" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 mb-2">
              <span>Cantera & Variedades</span>
              <span aria-hidden="true">·</span>
              <span>Garantía Mineral</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-display">
              Catálogo de Piedras & Agregados
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl">
              Materiales clasificados por calibre, textura y uso paisajístico. Disponibles en bulto sellado de 25kg/40kg o despacho en volqueta por m³ y toneladas.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar piedra, mármol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-sm pl-9 pr-4 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs (Segmented filter controls) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-medium rounded-sm whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-sm p-8">
            <p className="text-stone-600 font-medium">No se encontraron materiales con ese criterio.</p>
            <button
              onClick={() => { setSelectedCategory('todos'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-stone-900 border border-stone-300 rounded-sm hover:bg-stone-100"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-sm border border-stone-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200"
              >
                {/* Product Image */}
                <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle hover overlay for quick view */}
                  <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={() => onOpenProductDetail(product)}
                      className="px-3 py-1.5 bg-white/95 text-stone-900 text-xs font-semibold rounded-sm hover:bg-white flex items-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ficha Técnica</span>
                    </button>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed clean metadata (No pills) */}
                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1.5">
                      <span>{product.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.granulometry}</span>
                    </div>

                    <h3 className="text-base font-semibold text-stone-900 font-display leading-snug">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Pricing and Action row */}
                  <div className="mt-5 pt-4 border-t border-stone-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs text-stone-500">Desde</span>
                      <div className="text-right">
                        <span className="text-base font-bold font-mono text-stone-900 tabular-nums">
                          ${product.estimatedPriceCOP.toLocaleString('es-CO')}
                        </span>
                        <span className="text-[11px] text-stone-500 block font-normal">
                          / {product.priceUnitLabel}
                        </span>
                      </div>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onUseInCalculator(product.id)}
                        className="w-full py-2 px-2 text-[11px] font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-sm flex items-center justify-center gap-1 transition-colors"
                        title="Calcular metros cuadrados necesarios"
                      >
                        <Calculator className="w-3.5 h-3.5 shrink-0" />
                        <span>Calcular m²</span>
                      </button>

                      <button
                        onClick={() => handleQuickAddClick(product)}
                        className={`w-full py-2 px-2 text-[11px] font-semibold rounded-sm flex items-center justify-center gap-1 transition-colors ${
                          quickAddStatus[product.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-900 text-white hover:bg-stone-800'
                        }`}
                      >
                        {quickAddStatus[product.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span>Agregado</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 shrink-0" />
                            <span>Cotizar</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
