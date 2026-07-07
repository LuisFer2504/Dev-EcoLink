import React from 'react';
import { Gift, Ticket, Tag } from 'lucide-react';

export interface Reward {
  id: string;
  name: string;
  cost: number;
  icon: string;
}

export interface RedeemedItem {
  name: string;
  code: string;
  date: string;
}

export const REWARDS: Reward[] = [
  {id:'r1', name:'10% dcto. en restaurantes locales', cost:80, icon:'🍽️'},
  {id:'r2', name:'Kit de limpieza de playa', cost:60, icon:'🧤'},
  {id:'r3', name:'Botella reutilizable Eco Link', cost:100, icon:'🧴'},
  {id:'r4', name:'Tour ecológico con descuento', cost:150, icon:'📸'},
  {id:'r5', name:'Entrada a campaña de siembra de manglares', cost:120, icon:'🌱'}
];

interface RewardStoreProps {
  points: number;
  redeemed: RedeemedItem[];
  subtractPoints: (cost: number) => void;
  addRedeemed: (item: RedeemedItem) => void;
  showToast: (msg: string) => void;
}

export const RewardStore: React.FC<RewardStoreProps> = ({ points, redeemed, subtractPoints, addRedeemed, showToast }) => {

  const handleRedeem = (r: Reward) => {
    if (points < r.cost) {
      showToast('Puntos insuficientes para canjear este premio.');
      return;
    }

    subtractPoints(r.cost);
    const uniqueCode = 'ECO-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const today = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    addRedeemed({
      name: r.name,
      code: uniqueCode,
      date: today
    });

    showToast(`¡Premio canjeado! Presenta el código ${uniqueCode} en ventanilla 🎁`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-fraunces text-ocean-deep flex items-center gap-2">
          <Gift className="w-5 h-5 text-gold" />
          Canjear Premios
        </h2>
        <p className="text-sm text-ink-soft">Usa tus puntos ecológicos acumulados para obtener descuentos y productos reales en negocios locales aliados.</p>
      </div>

      {/* Rewards Catalog */}
      <div className="grid gap-3">
        {REWARDS.map(r => {
          const canRedeem = points >= r.cost;
          return (
            <div 
              key={r.id} 
              className={`bg-white border border-ink/10 rounded-2xl p-4 shadow-custom flex items-center gap-4 transition-all duration-200 ${
                !canRedeem ? 'opacity-80' : 'hover:border-gold/30 hover:shadow-md'
              }`}
            >
              <span className="text-3xl bg-paper p-2 rounded-xl" role="img" aria-label={r.name}>
                {r.icon}
              </span>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-ink text-sm sm:text-base truncate leading-snug">{r.name}</h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-ocean-mid mt-0.5">
                  <Tag className="w-3 h-3" />
                  {r.cost} puntos
                </span>
              </div>

              <button
                onClick={() => handleRedeem(r)}
                className={`py-2 px-4 rounded-xl font-bold text-xs shrink-0 transition-all duration-200 ${
                  canRedeem
                    ? 'bg-gold hover:bg-gold/90 text-amber-950 shadow hover:-translate-y-0.5'
                    : 'bg-paper border border-ink/10 text-ink-soft/45 cursor-not-allowed'
                }`}
              >
                Canjear
              </button>
            </div>
          );
        })}
      </div>

      {/* Redeemed coupons list */}
      <div className="space-y-3">
        <h3 className="text-md font-bold font-fraunces text-ocean-deep flex items-center gap-2">
          <Ticket className="w-4 h-4 text-ocean-mid" />
          Cupones Canjeados
        </h3>
        
        <div className="bg-white border border-ink/10 rounded-2xl p-4 shadow-custom">
          {redeemed.length === 0 ? (
            <div className="text-center py-6 text-sm text-ink-soft italic">
              Aún no has canjeado ningún premio.
            </div>
          ) : (
            <div className="divide-y divide-ink/10">
              {redeemed.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-3 first:pt-0 last:pb-0 text-sm">
                  <div>
                    <span className="font-semibold text-ink block leading-tight">{r.name}</span>
                    <span className="text-[10px] text-ink-soft">Canjeado el {r.date}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-xs bg-gold/10 border border-gold/20 text-amber-800 px-2.5 py-1 rounded-lg">
                      {r.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
