import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Check, Settings } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const COOKIE_KEY = 'stone_supplies_cookie_preferences_v1';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  const [preferences, setPreferences] = useState<{ analytics: boolean; marketing: boolean }>({
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_KEY);
      if (!saved) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('No se pudo guardar la preferencia de cookies:', e);
    }
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleAcceptEssentialOnly = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSaveCustom = () => {
    savePreferences({
      essential: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      timestamp: new Date().toISOString(),
    });
  };

  if (!isVisible) return null;

  return (
    <div 
      role="dialog"
      aria-label="Gestión de privacidad y cookies"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[100] bg-stone-900/95 text-stone-100 p-5 rounded-md border border-stone-800 shadow-2xl backdrop-blur-md transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
          <h3 className="text-sm font-bold text-white tracking-wide font-display">
            Privacidad & Preferencias
          </h3>
        </div>
        <button
          onClick={handleAcceptEssentialOnly}
          className="text-stone-400 hover:text-white transition-colors p-1"
          title="Cerrar y aceptar solo necesarias"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!showSettings ? (
        <>
          <p className="text-xs text-stone-300 leading-relaxed mb-4">
            Utilizamos cookies para optimizar tu experiencia, personalizar el simulador de piedras y analizar el rendimiento web. Puedes personalizar tus preferencias en cualquier momento.
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Aceptar Todas</span>
              </button>
              
              <button
                onClick={handleAcceptEssentialOnly}
                className="flex-1 py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs rounded-sm transition-colors border border-stone-700"
              >
                Solo Esenciales
              </button>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="w-full py-1.5 text-stone-400 hover:text-amber-400 text-xs font-medium transition-colors flex items-center justify-center gap-1 mt-1"
            >
              <Settings className="w-3 h-3" />
              <span>Personalizar cookies</span>
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-stone-400">
            Selecciona el tipo de cookies que deseas permitir:
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-stone-800/50 border border-stone-800">
              <div>
                <span className="font-semibold text-stone-200 block">Esenciales</span>
                <span className="text-[11px] text-stone-400">Navegación y guardado técnico.</span>
              </div>
              <span className="text-[10px] text-amber-500 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Requeridas
              </span>
            </div>

            <label className="flex items-center justify-between p-2 rounded bg-stone-800/30 border border-stone-800/80 cursor-pointer hover:bg-stone-800/60 transition-colors">
              <div>
                <span className="font-semibold text-stone-200 block">Análisis y Uso</span>
                <span className="text-[11px] text-stone-400">Estadísticas anónimas de visita.</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-stone-800/30 border border-stone-800/80 cursor-pointer hover:bg-stone-800/60 transition-colors">
              <div>
                <span className="font-semibold text-stone-200 block">Personalización</span>
                <span className="text-[11px] text-stone-400">Guardar preferencias del simulador.</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
            <button
              onClick={() => setShowSettings(false)}
              className="py-1.5 px-3 text-stone-400 hover:text-stone-200 text-xs transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleSaveCustom}
              className="py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-sm transition-colors"
            >
              Guardar Selección
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
