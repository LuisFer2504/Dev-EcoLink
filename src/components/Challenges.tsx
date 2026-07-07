import React from 'react';
import { Trophy, CheckCircle, Flame } from 'lucide-react';
import { HistoryItem } from './RegisterActivity';

export interface Challenge {
  id: string;
  title: string;
  desc: string;
  type: string;
  target: number;
  reward: number;
  icon: string;
}

export const CHALLENGES: Challenge[] = [
  {id:'c1', title:'Recolector novato', desc:'Registra 3 recojos de residuos', type:'recojo', target:3, reward:20, icon:'🧹'},
  {id:'c2', title:'Guardián del mar', desc:'Haz check-in en 3 playas (registros en el historial)', type:'checkin', target:3, reward:30, icon:'🐢'},
  {id:'c3', title:'Explorador QR', desc:'Escanea 3 códigos QR en las playas', type:'qr', target:3, reward:25, icon:'📷'},
  {id:'c4', title:'Reportero ambiental', desc:'Reporta 2 focos de contaminación', type:'reporte', target:2, reward:20, icon:'📢'}
];

interface ChallengesProps {
  history: HistoryItem[];
  claimedChallenges: string[];
  addPoints: (points: number, type: string, label: string) => void;
  claimChallenge: (challengeId: string) => void;
  showToast: (msg: string) => void;
}

export const Challenges: React.FC<ChallengesProps> = ({ history, claimedChallenges, addPoints, claimChallenge, showToast }) => {
  
  const getProgressForChallenge = (ch: Challenge) => {
    // Count how many actions in history match this challenge's action type
    return history.filter(h => h.type === ch.type).length;
  };

  const handleClaim = (ch: Challenge) => {
    claimChallenge(ch.id);
    addPoints(ch.reward, 'reto', `Reto completado: ${ch.title}`);
    showToast(`¡Felicidades! Reto "${ch.title}" reclamado. +${ch.reward} pts 🏆`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-fraunces text-ocean-deep flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold animate-bounce" />
          Retos Ecológicos
        </h2>
        <p className="text-sm text-ink-soft">Completa misiones ecológicas realizando actividades y reclama bonificaciones especiales.</p>
      </div>

      <div className="grid gap-4">
        {CHALLENGES.map(ch => {
          const progress = getProgressForChallenge(ch);
          const pct = Math.min(Math.round((progress / ch.target) * 100), 100);
          const isDone = progress >= ch.target;
          const isClaimed = claimedChallenges.includes(ch.id);

          return (
            <div key={ch.id} className="bg-white border border-ink/10 rounded-2xl p-5 shadow-custom relative overflow-hidden">
              {/* Highlight background for completed-but-unclaimed challenges */}
              {isDone && !isClaimed && (
                <div className="absolute top-0 right-0 bg-gold/10 text-gold text-[10px] font-bold py-1 px-3 rounded-bl-xl flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" /> ¡Listo!
                </div>
              )}

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-paper p-2.5 rounded-xl border border-ink/5" role="img" aria-label={ch.title}>
                    {ch.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-ink leading-tight text-sm sm:text-base">{ch.title}</h3>
                    <p className="text-xs text-ink-soft mt-0.5">{ch.desc}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs bg-emerald-50 text-turtle-dark border border-emerald-100 px-2 py-0.5 rounded-full">
                  +{ch.reward} pts
                </span>
              </div>

              {/* Progress Slider */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-ink-soft font-semibold">
                  <span>Progreso</span>
                  <span>{Math.min(progress, ch.target)} / {ch.target} ({pct}%)</span>
                </div>
                <div className="w-full bg-sand-dark/40 rounded-full h-3 overflow-hidden border border-ink/5">
                  <div 
                    className="bg-gradient-to-r from-turtle to-ocean-light h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                {isClaimed ? (
                  <button
                    disabled
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200 bg-emerald-50 text-turtle flex items-center gap-1.5 cursor-not-allowed"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Reclamado
                  </button>
                ) : isDone ? (
                  <button
                    onClick={() => handleClaim(ch)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gold hover:bg-gold/90 text-amber-950 shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Reclamar Premio
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-ink/10 bg-paper text-ink-soft/60 cursor-not-allowed"
                  >
                    En progreso
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
