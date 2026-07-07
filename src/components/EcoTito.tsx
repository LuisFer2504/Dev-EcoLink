import React, { useState } from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';

const TIPS = {
  'Reciclaje': [
    'Separa tus residuos en orgánicos, plásticos y vidrio antes de llevarlos a un punto limpio.',
    'Una botella de plástico puede tardar más de 400 años en degradarse en el mar.',
    'Reutiliza envases de vidrio para guardar alimentos en casa; reduces residuos y ahorras dinero.'
  ],
  'Fauna marina': [
    'Las tortugas marinas pueden confundir las bolsas plásticas con medusas y tragarlas por error.',
    'Paita es zona de paso de aves guaneras como el piquero peruano y el guanay.',
    'Si ves un lobo marino varado en la orilla, no lo toques: avisa a las autoridades locales.'
  ],
  'Contaminación': [
    'Gran parte de la basura marina llega desde tierra a través de ríos y quebradas.',
    'Las colillas de cigarro son uno de los residuos más comunes en las playas peruanas.',
    'Los microplásticos ya se encuentran en el agua y en la arena de muchas playas del país.'
  ],
  'Playas limpias': [
    'Llévate siempre tu basura a casa, incluso si no encuentras un tacho cerca.',
    'Participar en una minga de limpieza en grupo rinde mucho más que hacerlo solo.',
    'Evita fogatas directamente sobre la arena: dañan el ecosistema costero.'
  ]
};

type TipCategory = keyof typeof TIPS;

export const EcoTito: React.FC = () => {
  const [bubbleText, setBubbleText] = useState<string>('¡Hola! Soy EcoTito. Elige un tema a continuación y te daré un consejo valioso para cuidar nuestras hermosas playas de Paita.');
  const [activeCategory, setActiveCategory] = useState<TipCategory | null>(null);
  const [isWiggling, setIsWiggling] = useState<boolean>(false);

  const handleSelectCategory = (category: TipCategory) => {
    setActiveCategory(category);
    setIsWiggling(true);

    const tips = TIPS[category];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    // Simulate thinking delay with wiggle effect
    setTimeout(() => {
      setBubbleText(randomTip);
      setIsWiggling(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-fraunces text-ocean-deep flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-turtle" />
          EcoTito
        </h2>
        <p className="text-sm text-ink-soft">Tu mascota ecológica te enseña y motiva a proteger el ecosistema costero de Paita.</p>
      </div>

      <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-custom flex flex-col items-center">
        
        {/* Animated Custom SVG EcoTito Turtle Mascot */}
        <div className="w-48 h-48 relative flex items-center justify-center mb-4 select-none">
          <svg 
            className={`w-40 h-40 transition-all duration-300 ${
              isWiggling ? 'animate-bounce' : 'animate-pulse'
            }`} 
            viewBox="0 0 200 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Flippers */}
            <ellipse cx="40" cy="80" rx="30" ry="12" transform="rotate(-30 40 80)" fill="#2C6B45" />
            <ellipse cx="160" cy="80" rx="30" ry="12" transform="rotate(30 160 80)" fill="#2C6B45" />
            <ellipse cx="50" cy="140" rx="20" ry="8" transform="rotate(30 50 140)" fill="#2C6B45" />
            <ellipse cx="150" cy="140" rx="20" ry="8" transform="rotate(-30 150 140)" fill="#2C6B45" />
            
            {/* Tail */}
            <polygon points="100,165 92,150 108,150" fill="#2C6B45" />
            
            {/* Shell Outer */}
            <circle cx="100" cy="110" r="50" fill="#2C6B45" stroke="#1E2A24" strokeWidth="4" />
            {/* Shell Pattern */}
            <circle cx="100" cy="110" r="35" fill="#3F8F5F" stroke="#1E2A24" strokeWidth="3" />
            <polygon points="100,75 125,93 115,123 85,123 75,93" fill="#4FAB72" opacity="0.6" />
            <line x1="100" y1="75" x2="100" y2="60" stroke="#1E2A24" strokeWidth="3" />
            <line x1="125" y1="93" x2="143" y2="85" stroke="#1E2A24" strokeWidth="3" />
            <line x1="115" y1="123" x2="135" y2="138" stroke="#1E2A24" strokeWidth="3" />
            <line x1="85" y1="123" x2="65" y2="138" stroke="#1E2A24" strokeWidth="3" />
            <line x1="75" y1="93" x2="57" y2="85" stroke="#1E2A24" strokeWidth="3" />
            
            {/* Head */}
            <circle cx="100" cy="50" r="24" fill="#3F8F5F" stroke="#1E2A24" strokeWidth="4" />
            {/* Head Details */}
            <circle cx="92" cy="46" r="3" fill="#1E2A24" />
            <circle cx="108" cy="46" r="3" fill="#1E2A24" />
            <path d="M 94 56 Q 100 62 106 56" stroke="#1E2A24" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Blushing cheeks */}
            <circle cx="86" cy="52" r="3" fill="#EFA298" opacity="0.8" />
            <circle cx="114" cy="52" r="3" fill="#EFA298" opacity="0.8" />
          </svg>
        </div>

        {/* Dialogue Bubble */}
        <div className="w-full bg-emerald-50 border border-turtle/30 p-5 rounded-2xl text-ink text-sm relative mb-4 font-medium leading-relaxed shadow-sm">
          {/* Bubble Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rotate-45 bg-emerald-50 border-t border-l border-turtle/30" />
          <p className="text-center font-medium">{bubbleText}</p>
        </div>

        {/* Category Buttons */}
        <div className="w-full grid grid-cols-2 gap-2 mt-2">
          {Object.keys(TIPS).map(k => {
            const isSelected = activeCategory === k;
            return (
              <button
                key={k}
                onClick={() => handleSelectCategory(k as TipCategory)}
                className={`py-3 px-3 rounded-xl font-bold text-xs border text-left transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'bg-turtle border-turtle text-white shadow'
                    : 'bg-white border-ink/10 text-ink hover:border-turtle hover:text-turtle-dark'
                }`}
              >
                <span>{k}</span>
                {isSelected && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
