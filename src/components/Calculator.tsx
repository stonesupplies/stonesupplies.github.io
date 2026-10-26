import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Plus, Check, Info } from 'lucide-react';

interface CalculatorProps {
  products: Product[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  onAddToQuote: (product: Product, quantity: number, presentation: 'bulto_30kg' | 'bulto_40kg' | 'm3_granel' | 'tonelada', area: number, depth: number) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  products = [],
  selectedProductId,
  onSelectProduct,
  onAddToQuote
}) => {
  const [shape, setShape] = useState<'rect' | 'circle' | 'direct'>('rect');
  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(3);
  const [diameter, setDiameter] = useState<number>(4);
  const [directArea, setDirectArea] = useState<number>(15);
  const [depthCm, setDepthCm] = useState<number>(4);
  const [includeWastage, setIncludeWastage] = useState<boolean>(true);
  
  const [chosenPresentation, setChosenPresentation] = useState<'bulto_30kg' | 'bulto_40kg' | 'm3_granel' | 'tonelada'>('bulto_30kg');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const activeProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    return products.find(p => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  const handleProductChange = (id: string) => {
    onSelectProduct(id);
    const prod = products?.find(p => p.id === id);
    if (prod) {
      setDepthCm(prod.recommendedDepthCm);
    }
  };

  const areaM2 = useMemo(() => {
    if (shape === 'rect') return Math.max(0.1, length * width);
    if (shape === 'circle') {
      const radius = diameter / 2;
      return Math.max(0.1, Math.PI * radius * radius);
    }
    return Math.max(0.1, directArea);
  }, [shape, length, width, diameter, directArea]);

  const volumeM3 = useMemo(() => {
    const rawVolume = areaM2 * (depthCm / 100);
    return includeWastage ? rawVolume * 1.10 : rawVolume;
  }, [areaM2, depthCm, includeWastage]);

  const totalWeightKg = useMemo(() => {
    const density = activeProduct?.densityKgPerM3 || 1600;
    return Math.round(volumeM3 * density);
  }, [volumeM3, activeProduct]);

  const totalTons = useMemo(() => {
    return (totalWeightKg / 1000).toFixed(2);
  }, [totalWeightKg]);

  const bags30kg = useMemo(() => {
    return Math.ceil(totalWeightKg / 30);
  }, [totalWeightKg]);

  const bags40kg = useMemo(() => {
    return Math.ceil(totalWeightKg / 40);
  }, [totalWeightKg]);

  const calculatedQty = useMemo(() => {
    if (chosenPresentation === 'bulto_30kg') return bags30kg;
    if (chosenPresentation === 'bulto_40kg') return bags40kg;
    if (chosenPresentation === 'm3_granel') return Math.max(1, Math.ceil(volumeM3));
    return Math.max(1, Math.ceil(Number(totalTons)));
  }, [chosenPresentation, bags30kg, bags40kg, volumeM3, totalTons]);

  const estimatedTotalCost = useMemo(() => {
    const price = activeProduct?.estimatedPriceCOP || 0;
    if (chosenPresentation === 'bulto_30kg') return bags30kg * price;
    if (chosenPresentation === 'bulto_40kg') return bags40kg * (price * 1.35);
    if (chosenPresentation === 'm3_granel') return Math.ceil(volumeM3) * (price * 55);
    return Math.ceil(Number(totalTons)) * (price * 38);
  }, [chosenPresentation, bags30kg, bags40kg, volumeM3, totalTons, activeProduct]);

  const handleAdd = () => {
    if (!activeProduct) return;
    onAddToQuote(activeProduct, calculatedQty, chosenPresentation, Number(areaM2.toFixed(1)), depthCm);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
  };

  if (!activeProduct) {
    return <div className="py-20 text-center text-stone-600">Cargando calculadora...</div>;
  }

  return (
    <section id="calculadora" className="py-20 bg-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-display">
            Calculadora de Piedra y Áreas
          </h2>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Calcula el volumen y bultos de 30 kg exactos necesarios para tu proyecto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controles */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-stone-200 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                1. Selecciona el Material Pétreo
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-sm px-4 py-2.5 text-sm text-stone-900"
              >
                {products?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ({p.categoryLabel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                2. Forma de la Superficie
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-sm border border-stone-200 text-xs font-medium">
                <button type="button" onClick={() => setShape('rect')} className={`py-2 ${shape === 'rect' ? 'bg-white shadow-xs font-semibold' : 'text-stone-600'}`}>Rectangular</button>
                <button type="button" onClick={() => setShape('circle')} className={`py-2 ${shape === 'circle' ? 'bg-white shadow-xs font-semibold' : 'text-stone-600'}`}>Circular</button>
                <button type="button" onClick={() => setShape('direct')} className={`py-2 ${shape === 'direct' ? 'bg-white shadow-xs font-semibold' : 'text-stone-600'}`}>Área Directa (m²)</button>
              </div>
            </div>

            <div>
              {shape === 'rect' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Largo (m)</label>
                    <input type="number" min="0.2" step="0.1" value={length} onChange={(e) => setLength(parseFloat(e.target.value) || 0)} className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Ancho (m)</label>
                    <input type="number" min="0.2" step="0.1" value={width} onChange={(e) => setWidth(parseFloat(e.target.value) || 0)} className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-sm" />
                  </div>
                </div>
              )}
              {shape === 'circle' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Diámetro (m)</label>
                  <input type="number" min="0.3" step="0.1" value={diameter} onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)} className="w-full max-w-xs bg-stone-50 border border-stone-300 px-3 py-2 text-sm" />
                </div>
              )}
              {shape === 'direct' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Área (m²)</label>
                  <input type="number" min="0.5" step="0.5" value={directArea} onChange={(e) => setDirectArea(parseFloat(e.target.value) || 0)} className="w-full max-w-xs bg-stone-50 border border-stone-300 px-3 py-2 text-sm" />
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-2 text-xs font-semibold uppercase tracking-wider text-stone-700">
                <span>3. Espesor de la Capa</span>
                <span className="font-mono">{depthCm} cm</span>
              </div>
              <input type="range" min="2" max="12" step="1" value={depthCm} onChange={(e) => setDepthCm(parseInt(e.target.value))} className="w-full accent-stone-900" />
            </div>
          </div>

          {/* Columna de Resultados */}
          <div className="lg:col-span-5 bg-stone-900 text-stone-100 p-6 sm:p-8 rounded-sm border border-stone-800 shadow-lg space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <div className="text-xs uppercase tracking-widest text-stone-400 font-mono">Resumen de Cálculo</div>
              <h3 className="text-xl font-bold text-white mt-1">{activeProduct.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-800/80 p-3.5 rounded-sm border border-stone-700/50">
                <div className="text-xs text-stone-400">Área Neta</div>
                <div className="text-2xl font-bold font-mono text-white mt-0.5">{areaM2.toFixed(1)} m²</div>
              </div>
              <div className="bg-stone-800/80 p-3.5 rounded-sm border border-stone-700/50">
                <div className="text-xs text-stone-400">Peso Total</div>
                <div className="text-2xl font-bold font-mono text-white mt-0.5">{totalWeightKg.toLocaleString()} kg</div>
              </div>
              <div className="col-span-2 bg-stone-800/80 p-3.5 rounded-sm border border-stone-700/50">
                <div className="text-xs text-stone-400">Bultos Recomendados</div>
                <div className="text-3xl font-bold font-mono text-emerald-400 mt-0.5">
                  {bags30kg} <span className="text-sm font-normal text-stone-300">sacos de 30 kg</span>
                </div>
                <div className="text-xs text-stone-400 mt-1">o {bags40kg} sacos de 40 kg</div>
              </div>
            </div>

            {/* Selector de Presentación */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
                Presentación para Cotizar
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setChosenPresentation('bulto_30kg')}
                  className={`p-2.5 rounded-sm border text-left ${chosenPresentation === 'bulto_30kg' ? 'border-white bg-stone-800 text-white font-medium' : 'border-stone-800 bg-stone-900/60 text-stone-400'}`}
                >
                  <div className="font-semibold text-white">Bultos 30 kg</div>
                  <div className="font-mono text-stone-400 text-[11px]">{bags30kg} sacos</div>
                </button>
                <button
                  type="button"
                  onClick={() => setChosenPresentation('bulto_40kg')}
                  className={`p-2.5 rounded-sm border text-left ${chosenPresentation === 'bulto_40kg' ? 'border-white bg-stone-800 text-white font-medium' : 'border-stone-800 bg-stone-900/60 text-stone-400'}`}
                >
                  <div className="font-semibold text-white">Bultos 40 kg</div>
                  <div className="font-mono text-stone-400 text-[11px]">{bags40kg} sacos</div>
                </button>
              </div>
            </div>

            {/* Costo Total en COP */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400 block">Subtotal Estimado Material</span>
                <span className="text-xs text-stone-500">Sin incluir flete en Bogotá</span>
              </div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                ${estimatedTotalCost.toLocaleString('es-CO')} <span className="text-xs font-normal text-stone-400">COP</span>
              </div>
            </div>

            {/* Botón de Agregar */}
            <button
              onClick={handleAdd}
              className={`w-full py-3.5 px-4 rounded-sm text-sm font-semibold flex items-center justify-center gap-2 transition-all ${addedSuccess ? 'bg-emerald-500 text-white' : 'bg-white text-stone-950 hover:bg-stone-200'}`}
            >
              {addedSuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{addedSuccess ? '¡Agregado a tu Cotización!' : `Agregar ${calculatedQty} a mi Cotización`}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
