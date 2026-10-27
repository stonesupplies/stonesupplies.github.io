import React, { useState } from 'react';
import { Product } from '../types';
import { MOCK_PROJECT_SCENES } from '../data/products';
import { Eye, Sun, Moon, Sparkles, ArrowRight, Layers, Check } from 'lucide-react';

interface VisualizerProps {
  products: Product[];
  onSelectProductForCalculator: (productId: string) => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  products,
  onSelectProductForCalculator
}) => {
  const [activeSceneId, setActiveSceneId] = useState<string>('patio-zen');
  const [selectedPrimaryStoneId, setSelectedPrimaryStoneId] = useState<string>('piedra-blanca-crystal');
  const [lightingMode, setLightingMode] = useState<'day' | 'evening'>('day');

  const activeScene = MOCK_PROJECT_SCENES.find(s => s.id === activeSceneId) || MOCK_PROJECT_SCENES[0];
  const primaryStone = products.find(p => p.id === selectedPrimaryStoneId) || products[0];

  return (
    <section id="simulador" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-400 mb-2">
            <span>Visualizador Arquitectónico</span>
            <span aria-hidden="true">·</span>
            <span>Simulación de Texturas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display text-balance">
            Simulador de Ambientes y Combinaciones
          </h2>
          <p className="mt-3 text-base text-stone-300 leading-relaxed">
            Visualiza cómo contrastan las tonalidades de cantera, mármoles y pizarras en diseños exteriores reales bajo diferente iluminación.
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Visual Display (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* Visualizer Canvas Card */}
            <div className="relative aspect-16/10 rounded-sm overflow-hidden border border-stone-800 bg-stone-950 shadow-2xl">
              
              {/* Scene Background */}
              <img
                src={activeScene.ambientImage}
                alt={activeScene.name}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  lightingMode === 'evening' ? 'brightness-75 contrast-110 saturate-90' : 'brightness-100'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Lighting overlay tint */}
              {lightingMode === 'evening' && (
                <div className="absolute inset-0 bg-indigo-950/25 mix-blend-multiply pointer-events-none" />
              )}

              {/* Top Controls Overlay */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-4 pointer-events-auto">
                {/* Scene tag */}
                <div className="bg-stone-900/80 backdrop-blur-md border border-stone-700/60 px-3 py-1.5 rounded-sm text-xs font-medium text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{activeScene.name}</span>
                </div>

                {/* Day / Evening toggle */}
                <div className="flex items-center gap-1 p-1 bg-stone-900/80 backdrop-blur-md border border-stone-700/60 rounded-sm text-xs">
                  <button
                    onClick={() => setLightingMode('day')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm transition-colors ${
                      lightingMode === 'day' ? 'bg-stone-800 text-white font-semibold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>Luz Día</span>
                  </button>
                  <button
                    onClick={() => setLightingMode('evening')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm transition-colors ${
                      lightingMode === 'evening' ? 'bg-stone-800 text-white font-semibold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Tarde / Noche</span>
                  </button>
                </div>
              </div>

              {/* Inset Macro Texture Swatch */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-stone-900/90 backdrop-blur-md border border-stone-700/80 p-3 rounded-sm shadow-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-sm overflow-hidden shrink-0 border border-stone-600">
                  <img
                    src={primaryStone.image}
                    alt={primaryStone.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-mono text-stone-400 tracking-wider">Piedra Seleccionada</div>
                  <div className="text-xs font-bold text-white truncate">{primaryStone.name}</div>
                  <div className="text-[11px] text-stone-300 truncate">{primaryStone.granulometry}</div>
                </div>
                <button
                  onClick={() => onSelectProductForCalculator(primaryStone.id)}
                  className="px-3 py-1.5 bg-white text-stone-950 text-xs font-semibold rounded-sm hover:bg-stone-200 transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Calcular</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>

            {/* Scene Selector Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOCK_PROJECT_SCENES.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    setActiveSceneId(scene.id);
                    setSelectedPrimaryStoneId(scene.defaultStoneId);
                  }}
                  className={`p-3.5 rounded-sm border text-left transition-all ${
                    activeSceneId === scene.id
                      ? 'border-white bg-stone-800 text-white shadow-sm'
                      : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">{scene.name}</div>
                  <div className="text-[11px] text-stone-400 mt-1 line-clamp-1">{scene.description}</div>
                </button>
              ))}
            </div>

          </div>

          {/* Palette & Material Options (4 cols) */}
          <div className="lg:col-span-4 bg-stone-950 p-6 rounded-sm border border-stone-800 space-y-6">
            
            <div className="border-b border-stone-800 pb-3">
              <div className="text-xs uppercase tracking-widest text-stone-400 font-mono">Selector de Piedra</div>
              <h3 className="text-lg font-bold text-white font-display mt-0.5">
                Probar en este Espacio
              </h3>
            </div>

            {/* List of Stones to Test */}
            <div className="space-y-2.5">
              {products.slice(0, 5).map((prod) => {
                const isSelected = selectedPrimaryStoneId === prod.id;
                return (
                  <button
                    key={prod.id}
                    onClick={() => setSelectedPrimaryStoneId(prod.id)}
                    className={`w-full p-2.5 rounded-sm border flex items-center gap-3 text-left transition-colors ${
                      isSelected
                        ? 'border-white bg-stone-800/90 text-white'
                        : 'border-stone-800 bg-stone-900/40 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xs overflow-hidden shrink-0 border border-stone-700">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{prod.name}</div>
                      <div className="text-[11px] text-stone-400 truncate">{prod.categoryLabel}</div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick architectural design tips */}
            <div className="p-4 bg-stone-900/70 border border-stone-800 rounded-sm text-xs text-stone-300 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Consejo de Diseño Stone Supplies</span>
              </div>
              <p className="text-stone-400 leading-relaxed text-[12px]">
                Para lograr profundidad visual en Bogotá, usa la <strong>Piedra Blanca Crystal</strong> como base reflectiva y enmarca con <strong>Piedra Plana Negra</strong>. Esto resalta el verde intenso de agaves, helechos y pasto kikuyo.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
