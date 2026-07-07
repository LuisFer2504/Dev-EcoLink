import React, { useState } from 'react';
import { MapPin, Check } from 'lucide-react';

export interface Beach {
  id: string;
  name: string;
  x: number; // percentage left
  y: number; // percentage top
  status: 'Limpia' | 'Regular' | 'Necesita atención';
  tone: 'good' | 'mid' | 'bad';
  desc: string;
}

export const BEACHES: Beach[] = [
  {id:'colan', name:'Playa Colán', x:28, y:30, status:'Limpia', tone:'good', desc:'Playa balneario histórica, arena fina y aguas tranquilas. Zona con vigilancia ambiental activa.'},
  {id:'yacila', name:'Playa Yacila', x:58, y:22, status:'Regular', tone:'mid', desc:'Caleta de pescadores artesanales. Presenta restos de redes y plástico cerca del muelle.'},
  {id:'islilla', name:'Playa La Islilla', x:78, y:40, status:'Limpia', tone:'good', desc:'Cercana a la Reserva Nacional Illescas, hogar de aves guaneras y lobos marinos.'},
  {id:'cangrejos', name:'Playa Cangrejos', x:40, y:55, status:'Necesita atención', tone:'bad', desc:'Alta afluencia de visitantes los fines de semana; acumula residuos plásticos con frecuencia.'},
  {id:'esmeralda', name:'Playa Esmeralda', x:63, y:66, status:'Regular', tone:'mid', desc:'Playa urbana de Paita, ideal para caminatas al atardecer. En proceso de recuperación ecológica.'}
];

interface BeachMapProps {
  checkins: Record<string, string>;
  addPoints: (points: number, type: string, label: string) => void;
  showToast: (msg: string) => void;
}

export const BeachMap: React.FC<BeachMapProps> = ({ checkins, addPoints, showToast }) => {
  const [selectedBeachId, setSelectedBeachId] = useState<string>(BEACHES[0].id);

  const selectedBeach = BEACHES.find(b => b.id === selectedBeachId) || BEACHES[0];
  const today = new Date().toDateString();
  const alreadyCheckedIn = checkins[selectedBeach.id] === today;

  const handleCheckIn = () => {
    if (alreadyCheckedIn) return;
    addPoints(10, 'checkin', `Check-in en ${selectedBeach.name}`);
    showToast(`¡Check-in registrado en ${selectedBeach.name}! +10 pts 🐢`);
  };

  const getStatusColor = (tone: string) => {
    switch (tone) {
      case 'good': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'mid': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'bad': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPinColor = (tone: string, isSelected: boolean) => {
    const scale = isSelected ? 'scale-125' : 'hover:scale-115';
    switch (tone) {
      case 'good': return `text-emerald-500 ${scale}`;
      case 'mid': return `text-amber-500 ${scale}`;
      case 'bad': return `text-rose-500 ${scale}`;
      default: return `text-ocean-light ${scale}`;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold font-fraunces text-ocean-deep flex items-center gap-2">
          <MapPin className="w-5 h-5 text-coral" />
          Mapa de Playas
        </h2>
        <p className="text-sm text-ink-soft">Toca un marcador en el mapa para ver la información de la playa y hacer check-in.</p>
      </div>

      {/* Styled Coast Map */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/3.5] rounded-2xl overflow-hidden border border-ink/10 shadow-custom bg-gradient-to-b from-[#CDEBF5] via-[#A5DCEF] to-[#136C86]">
        {/* Sand shoreline */}
        <div className="absolute left-0 right-0 bottom-0 h-[25%] bg-sand-dark rounded-t-[60%_100%] border-t border-sand shadow-inner pointer-events-none" />
        
        {/* Decorative waves */}
        <div className="absolute bottom-[22%] left-1/4 w-12 h-2 border-b-2 border-white/30 rounded-full animate-pulse" />
        <div className="absolute bottom-[24%] right-1/4 w-16 h-2 border-b-2 border-white/30 rounded-full animate-pulse delay-75" />

        {/* Map pins */}
        {BEACHES.map(b => {
          const isSelected = b.id === selectedBeachId;
          return (
            <button
              key={b.id}
              className={`absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-full cursor-pointer focus:outline-none drop-shadow-lg z-10 ${getPinColor(b.tone, isSelected)}`}
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
              onClick={() => setSelectedBeachId(b.id)}
            >
              <div className="relative group">
                <MapPin className={`w-8 h-8 ${isSelected ? 'fill-current' : ''}`} />
                {/* Floating mini label on map */}
                <span className="absolute left-1/2 -translate-x-1/2 -top-6 bg-ink text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-sans font-medium">
                  {b.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Beach details card */}
      <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-custom transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-ink font-fraunces">{selectedBeach.name}</h3>
            <span className={`inline-block border px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${getStatusColor(selectedBeach.tone)}`}>
              {selectedBeach.status}
            </span>
          </div>
          <span className="text-3xl" role="img" aria-label="Beach icon">🏖️</span>
        </div>
        
        <p className="text-sm text-ink-soft my-4 leading-relaxed">{selectedBeach.desc}</p>
        
        <button
          onClick={handleCheckIn}
          disabled={alreadyCheckedIn}
          className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 text-sm ${
            alreadyCheckedIn 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed'
              : 'bg-turtle hover:bg-turtle-dark text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {alreadyCheckedIn ? (
            <>
              <Check className="w-4 h-4" />
              Ya hiciste check-in hoy
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Hacer check-in (+10 pts)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
