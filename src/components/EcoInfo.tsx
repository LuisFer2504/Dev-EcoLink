import React from 'react';
import { BookOpen, AlertCircle } from 'lucide-react';

interface InfoCard {
  title: string;
  icon: string;
  text: string;
  colorClass: string;
}

const INFO_CARDS: InfoCard[] = [
  {
    title: 'Manglares de Paita',
    icon: '🌱',
    text: 'Los manglares filtran el agua, protegen la costa de la erosión y son el criadero natural de peces, conchas y cangrejos. Su conservación beneficia directamente a los pescadores artesanales locales.',
    colorClass: 'bg-emerald-50 border-emerald-100 text-emerald-950'
  },
  {
    title: 'Tortugas Marinas',
    icon: '🐢',
    text: 'En el litoral de Piura conviven múltiples especies de tortuga marina, como la verde y la laúd. Todas están protegidas por la legislación peruana; su captura y recolección de huevos están prohibidas.',
    colorClass: 'bg-teal-50 border-teal-100 text-teal-950'
  },
  {
    title: 'Aves Guaneras',
    icon: '🦅',
    text: 'Piqueros peruanos, guanayes y pelícanos anidan de forma masiva en las islas y puntas del norte peruano. Históricamente, el guano recolectado de estas aves fue el recurso económico más valioso del país.',
    colorClass: 'bg-amber-50 border-amber-100 text-amber-950'
  },
  {
    title: 'Plásticos de un solo uso',
    icon: '🥤',
    text: 'Bolsas, sorbetes y botellas plásticas representan más del 80% de los residuos marinos en nuestras costas. Reemplazarlos por recipientes reutilizables previene que las especies marinas los ingieran por accidente.',
    colorClass: 'bg-rose-50 border-rose-100 text-rose-950'
  }
];

export const EcoInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-fraunces text-ocean-deep flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-ocean-mid" />
          Aprende con Eco Link
        </h2>
        <p className="text-sm text-ink-soft">Conoce más sobre la maravillosa flora y fauna que habitan en la costa y manglares de nuestra provincia.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {INFO_CARDS.map((info, idx) => (
          <div 
            key={idx} 
            className={`border rounded-2xl p-5 shadow-custom flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${info.colorClass}`}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl bg-white/70 p-2.5 rounded-xl shadow-inner" role="img" aria-label={info.title}>
                  {info.icon}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight font-fraunces">
                  {info.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-sans">
                {info.text}
              </p>
            </div>
            
            <div className="mt-4 flex items-center gap-1.5 text-[10px] uppercase font-bold opacity-60">
              <AlertCircle className="w-3.5 h-3.5" />
              Conservación Activa
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
