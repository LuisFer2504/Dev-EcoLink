import React from 'react';
import { BarChart3, Award } from 'lucide-react';

interface LeaderboardProps {
  points: number;
}

interface LeaderboardUser {
  name: string;
  pts: number;
  isMe?: boolean;
}

const LEADERBOARD_BASE: LeaderboardUser[] = [
  { name: 'Ana', pts: 350 },
  { name: 'Luis', pts: 320 },
  { name: 'María', pts: 300 },
  { name: 'Carlos', pts: 280 },
  { name: 'Lucía', pts: 260 }
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ points }) => {
  // Merge current user with the leaderboard and sort descending
  const list = [...LEADERBOARD_BASE, { name: 'Tú', pts: points, isMe: true }]
    .sort((a, b) => b.pts - a.pts);

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return { bg: 'bg-amber-400 text-amber-950', border: 'border-amber-500' }; // Gold
      case 1:
        return { bg: 'bg-slate-300 text-slate-900', border: 'border-slate-400' }; // Silver
      case 2:
        return { bg: 'bg-amber-600 text-amber-50', border: 'border-amber-700' }; // Bronze
      default:
        return { bg: 'bg-ocean-light/20 text-ocean-deep', border: 'border-ocean-light/10' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-fraunces text-ocean-deep flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-ocean-mid" />
          Ranking Ecológico
        </h2>
        <p className="text-sm text-ink-soft">Mira a los líderes ambientales de Paita y sube puestos registrando más actividades.</p>
      </div>

      <div className="bg-white border border-ink/10 rounded-2xl p-4 shadow-custom">
        <div className="space-y-2">
          {list.map((u, i) => {
            const badgeStyle = getRankBadge(i);
            const isMe = u.isMe;

            return (
              <div
                key={i}
                className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-200 ${
                  isMe
                    ? 'bg-emerald-50/70 border-turtle/30 shadow-sm ring-1 ring-turtle/10'
                    : 'border-transparent bg-transparent hover:bg-paper/50'
                }`}
              >
                {/* Position Badge */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${badgeStyle.bg} ${badgeStyle.border}`}
                >
                  {i + 1}
                </div>

                {/* User Info */}
                <div className="flex-1 flex items-center gap-2">
                  <span className={`text-sm ${isMe ? 'font-black text-turtle-dark' : 'font-semibold text-ink'}`}>
                    {u.name}
                  </span>
                  {isMe && (
                    <span className="text-[10px] bg-turtle/10 text-turtle-dark px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      Tú
                    </span>
                  )}
                  {i < 3 && (
                    <Award className={`w-3.5 h-3.5 shrink-0 ${
                      i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : 'text-amber-700'
                    }`} />
                  )}
                </div>

                {/* Points */}
                <div className="font-mono font-bold text-sm text-ink-soft text-right shrink-0">
                  {u.pts} <span className="text-[10px] font-sans font-normal text-ink-soft/75">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
