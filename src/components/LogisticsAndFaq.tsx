import React, { useState } from 'react';
import { Truck, MapPin, Package, ShieldCheck, ChevronDown, ChevronUp, Clock, HelpCircle } from 'lucide-react';

export const LogisticsAndFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Cómo calculo la cantidad exacta de piedra para no quedarme corto?',
      a: 'Usa nuestra calculadora indicando el largo y ancho (o área en m²) de tu zona. Se recomienda un espesor de 4 cm para piedra decorativa (granulometría 3/4" a 1") y sumarle un 10% adicional por irregularidades y asentamiento del terreno. Esto equivale a aprox. 45-50 kg por metro cuadrado.'
    },
    {
      q: '¿Qué preparación de suelo recomiendan antes de instalar la piedra?',
      a: 'Recomendamos retirar 5 a 7 cm de tierra orgánica superficial, nivelar y apisonar ligeramente. Luego, instalar tela geotextil o geomalla antimaleza para impedir el crecimiento de pasto y evitar que la piedra se hunda en el barro con las lluvias de Bogotá.'
    },
    {
      q: '¿Cuáles son las opciones de entrega y descarga en Bogotá y municipios?',
      a: 'Ofrecemos dos modalidades: 1) En bultos sellados de 25 kg o 40 kg transportados en camioneta estacas con descargue a pie de obra. 2) A granel en volqueta sencilla (6 a 8 m³) o doble troque (14 a 16 m³) para obras medianas y grandes.'
    },
    {
      q: '¿Llegan a municipios fuera de Bogotá?',
      a: 'Sí, cubrimos con despacho frecuente toda la Sabana Norte (Chía, Cajicá, Cota, Zipaquirá, Sopó, Tocancipá), Sabana Occidente (Funza, Mosquera, Madrid, Facatativá), La Calera, y despachamos pedidos especiales a toda Colombia.'
    },
    {
      q: '¿Puedo solicitar muestras antes de ordenar un volumen grande?',
      a: 'Por supuesto. Arquitectos, constructoras y diseñadores de jardines pueden solicitar un kit de muestras de cuarzos, mármoles y pizarras directamente a través de nuestro WhatsApp.'
    }
  ];

  return (
    <section id="logistica" className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Logistics Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 mb-2">
            <span>Operaciones & Logística</span>
            <span aria-hidden="true">·</span>
            <span>Despacho Confiable</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-display">
            Despachos en Bogotá y Sabana
          </h2>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Coordinamos la logística desde cantera hasta tu puerta o frente de obra, cuidando la pureza del material y la puntualidad en los tiempos pactados.
          </p>
        </div>

        {/* 3 Logistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-stone-50 rounded-sm border border-stone-200">
            <div className="w-10 h-10 bg-stone-900 text-white flex items-center justify-center rounded-sm mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 font-display">
              Bultos Sellados de 25kg & 40kg
            </h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              Empaque resistente de alta densidad para traslados limpios en apartamentos, terrazas, sótanos o zonas residenciales de difícil acceso para volquetas.
            </p>
            <div className="mt-4 pt-4 border-t border-stone-200/60 text-xs font-mono text-stone-700">
              Ideal: 1 a 150 bultos
            </div>
          </div>

          <div className="p-6 bg-stone-50 rounded-sm border border-stone-200">
            <div className="w-10 h-10 bg-stone-900 text-white flex items-center justify-center rounded-sm mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 font-display">
              Volqueta a Granel (m³ & Ton)
            </h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              Viajes directos desde cantera en volquetas sencillas de 6 a 8 m³ para urbanismos, frentes viales, parqueaderos y parques institucionales.
            </p>
            <div className="mt-4 pt-4 border-t border-stone-200/60 text-xs font-mono text-stone-700">
              Ideal: Proyectos mayores a 6 m³
            </div>
          </div>

          <div className="p-6 bg-stone-50 rounded-sm border border-stone-200">
            <div className="w-10 h-10 bg-stone-900 text-white flex items-center justify-center rounded-sm mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 font-display">
              Tiempos de Entrega Ágiles
            </h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              Entregas habituales entre 24 y 48 horas en Bogotá Norte, Occidente y municipios aledaños tras la confirmación de pedido.
            </p>
            <div className="mt-4 pt-4 border-t border-stone-200/60 text-xs font-mono text-stone-700">
              Lunes a Sábado en Obra
            </div>
          </div>
        </div>

        {/* Technical FAQ Accordion */}
        <div className="max-w-3xl mx-auto pt-8 border-t border-stone-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-stone-900 font-display">
              Preguntas Frecuentes sobre Instalación y Piedras
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Respuestas a las dudas más comunes de paisajistas y constructores.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="border border-stone-200 rounded-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left bg-stone-50 hover:bg-stone-100 flex items-center justify-between gap-4 transition-colors"
                  >
                    <span className="text-sm font-semibold text-stone-900 font-display">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-stone-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-600 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
