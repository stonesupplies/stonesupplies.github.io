import React, { useState } from 'react';
import { QuoteItem } from '../types';
import { X, Trash2, Plus, Minus, Send, Copy, Check, MessageSquare, Truck, ArrowRight } from 'lucide-react';

interface QuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearQuote: () => void;
}

export const QuoteDrawer: React.FC<QuoteDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearQuote
}) => {
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Bogotá - Usaquén / Suba / Chapinero');
  const [projectType, setProjectType] = useState<string>('Residencial / Jardín Privado');
  const [notes, setNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Presentation labels
  const presentationLabels: Record<string, string> = {
    bulto_30kg: 'Bultos de 30 kg',
    bulto_40kg: 'Bultos de 40 kg',
    m3_granel: 'Metros Cúbicos (m³)',
    tonelada: 'Toneladas (t)'
  };

  // Subtotal calculation
  const subtotalCOP = items.reduce((acc, item) => {
    let unitMultiplier = 1;
    if (item.presentation === 'bulto_40kg') unitMultiplier = 1.55;
    if (item.presentation === 'm3_granel') unitMultiplier = 55;
    if (item.presentation === 'tonelada') unitMultiplier = 38;
    return acc + (item.quantity * item.product.estimatedPriceCOP * unitMultiplier);
  }, 0);

  // Total weight estimate
  const totalWeightEstimateKg = items.reduce((acc, item) => {
    if (item.presentation === 'bulto_30kg') return acc + (item.quantity * 25);
    if (item.presentation === 'bulto_40kg') return acc + (item.quantity * 40);
    if (item.presentation === 'm3_granel') return acc + (item.quantity * item.product.densityKgPerM3);
    if (item.presentation === 'tonelada') return acc + (item.quantity * 1000);
    return acc;
  }, 0);

  // Build WhatsApp text
  const buildWhatsAppMessage = () => {
    let msg = `*SOLICITUD DE COTIZACIÓN - STONE SUPPLIES*\n`;
    msg += `----------------------------------------\n`;
    if (clientName) msg += `*Cliente:* ${clientName}\n`;
    if (clientPhone) msg += `*Teléfono:* ${clientPhone}\n`;
    msg += `*Ubicación de Entrega:* ${deliveryLocation}\n`;
    msg += `*Tipo de Proyecto:* ${projectType}\n`;
    if (notes) msg += `*Observaciones / Acceso:* ${notes}\n`;
    msg += `----------------------------------------\n`;
    msg += `*MATERIALES SOLICITADOS:*\n`;

    items.forEach((item, idx) => {
      msg += `\n${idx + 1}. *${item.product.name}*\n`;
      msg += `   • Cantidad: ${item.quantity} ${presentationLabels[item.presentation]}\n`;
      if (item.calculatedArea && item.calculatedDepth) {
        msg += `   • Espacio: ${item.calculatedArea} m² con espesor de ${item.calculatedDepth} cm\n`;
      }
      msg += `   • Granulometría: ${item.product.granulometry}\n`;
    });

    msg += `\n----------------------------------------\n`;
    msg += `*Peso Total Estimado:* ~${(totalWeightEstimateKg / 1000).toFixed(2)} Toneladas (${totalWeightEstimateKg.toLocaleString()} kg)\n`;
    msg += `*Subtotal Materiales (Ref):* $${subtotalCOP.toLocaleString('es-CO')} COP\n`;
    msg += `_Solicito confirmación de disponibilidad, flete a destino y tiempos de entrega._`;

    return msg;
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(buildWhatsAppMessage());
    // Stone Supplies official WhatsApp channel
    const whatsappUrl = `https://wa.me/573178626912?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-lg bg-stone-900 text-stone-100 h-full flex flex-col justify-between shadow-2xl border-l border-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-stone-400 font-mono">Resumen de Obra</div>
            <h2 className="text-xl font-bold text-white font-display mt-0.5">
              Mi Cotización ({items.length} {items.length === 1 ? 'ítem' : 'ítems'})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full transition-colors"
            aria-label="Cerrar cotizador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {items.length === 0 ? (
            <div className="text-center py-16 text-stone-400 space-y-3">
              <MessageSquare className="w-10 h-10 mx-auto text-stone-600" />
              <p className="text-sm font-medium text-stone-300">Aún no has agregado materiales a tu cotización.</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explora el catálogo o usa la calculadora para dimensionar tu proyecto en metros cuadrados.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-stone-800 text-stone-200 text-xs font-semibold rounded-sm hover:bg-stone-700"
              >
                Volver al Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-wider">
                  <span>Materiales Seleccionados</span>
                  <button
                    onClick={onClearQuote}
                    className="text-[11px] text-stone-500 hover:text-rose-400 transition-colors"
                  >
                    Vaciar todo
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${idx}`}
                    className="p-3.5 bg-stone-800/70 rounded-sm border border-stone-700/60 flex items-start gap-3"
                  >
                    <div className="w-14 h-14 rounded-xs overflow-hidden shrink-0 border border-stone-700 bg-stone-900">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white leading-tight truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-stone-500 hover:text-rose-400 transition-colors shrink-0"
                          title="Eliminar de la cotización"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {presentationLabels[item.presentation]}
                      </div>

                      {item.calculatedArea && item.calculatedDepth && (
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          Para {item.calculatedArea} m² ({item.calculatedDepth} cm espesor)
                        </div>
                      )}

                      {/* Stepper */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-700/40">
                        <div className="flex items-center gap-2 bg-stone-900 px-2 py-0.5 rounded-xs border border-stone-700">
                          <button
                            onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                            className="text-stone-400 hover:text-white p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-white px-1 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="text-stone-400 hover:text-white p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-mono text-stone-300 font-medium">
                          Ref: ${(item.quantity * item.product.estimatedPriceCOP).toLocaleString('es-CO')}
                        </span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Details Form */}
              <div className="space-y-3 pt-4 border-t border-stone-800">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Datos de Entrega en Obra (Opcional)
                </div>

                <div>
                  <label htmlFor="client-name" className="block text-[11px] text-stone-400 mb-1">Nombre o Empresa</label>
                  <input
                    id="client-name"
                    type="text"
                    placeholder="Ej. Arq. Carolina Gómez / Jardines Andinos"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-sm px-3 py-1.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="client-phone" className="block text-[11px] text-stone-400 mb-1">Teléfono Móvil</label>
                    <input
                      id="client-phone"
                      type="tel"
                      placeholder="Ej. 310 123 4567"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-sm px-3 py-1.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="delivery-dest" className="block text-[11px] text-stone-400 mb-1">Municipio / Zona</label>
                    <select
                      id="delivery-dest"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-sm px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white"
                    >
                      <option value="Bogotá - Norte (Usaquén / Suba)">Bogotá Norte (Usaquén, Suba)</option>
                      <option value="Bogotá - Centro / Chapinero">Bogotá Centro / Chapinero</option>
                      <option value="Bogotá - Occidente (Engativá / Fontibón)">Bogotá Occidente</option>
                      <option value="Bogotá - Sur">Bogotá Sur</option>
                      <option value="Chía / Cajicá / Cota">Chía / Cajicá / Cota</option>
                      <option value="Sopó / Tocancipá / Guasca">Sopó / Tocancipá</option>
                      <option value="La Calera">La Calera</option>
                      <option value="Otras Zonas de Colombia">Otras Zonas de Colombia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="client-notes" className="block text-[11px] text-stone-400 mb-1">Notas de Descargue o Acceso</label>
                  <input
                    id="client-notes"
                    type="text"
                    placeholder="Ej. Entrada estrecha, requiere camión pequeño o cargueros"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-sm px-3 py-1.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
              </div>

              {/* Aggregates Summary */}
              <div className="p-3.5 bg-stone-950 rounded-sm border border-stone-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-stone-400">
                  <span>Peso Estimado Total:</span>
                  <span className="text-white">~{(totalWeightEstimateKg / 1000).toFixed(2)} Toneladas</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal Ref. Materiales:</span>
                  <span className="text-emerald-400 font-bold">${subtotalCOP.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-800">
                  *El flete exacto se cotiza de acuerdo con el kilometraje y tipo de descargue.
                </div>
              </div>
            </>
          )}

        </div>

        {/* Drawer Footer Actions */}
        {items.length > 0 && (
          <div className="p-6 border-t border-stone-800 bg-stone-900/90 space-y-3">
            <button
              onClick={handleSendWhatsApp}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-sm text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>Enviar Cotización a WhatsApp</span>
            </button>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-sm text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">¡Texto Copiado al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Desglose para Correo</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
