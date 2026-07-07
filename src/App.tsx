import { useState, useEffect } from 'react';
import { 
  Home, MapPin, Camera, QrCode, Trophy, BarChart3, Gift, MessageSquare, BookOpen, 
  Menu, X, Sparkles, User, ArrowRight, ArrowLeft
} from 'lucide-react';

// Subcomponents
import { BeachMap, BEACHES } from './components/BeachMap';
import { RegisterActivity, HistoryItem } from './components/RegisterActivity';
import { QRScanner } from './components/QRScanner';
import { Challenges } from './components/Challenges';
import { Leaderboard } from './components/Leaderboard';
import { RewardStore, RedeemedItem } from './components/RewardStore';
import { EcoTito } from './components/EcoTito';
import { EcoInfo } from './components/EcoInfo';

const STORAGE_KEY = 'ecolink_state_v1';

interface AppState {
  points: number;
  history: HistoryItem[];
  redeemed: RedeemedItem[];
  checkins: Record<string, string>;
  claimedChallenges: string[];
}

const defaultState: AppState = {
  points: 250,
  history: [
    { type: 'recojo', label: 'Recogí bolsas plásticas en Playa Colán', pts: 10, date: '06 Jul' },
    { type: 'checkin', label: 'Check-in en Playa Colán', pts: 10, date: '06 Jul' },
    { type: 'qr', label: 'Código QR escaneado en Playa La Islilla', pts: 10, date: '05 Jul' }
  ],
  redeemed: [],
  checkins: { 'colan': new Date().toDateString() },
  claimedChallenges: []
};

const getInitialState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultState;
  } catch (e) {
    return defaultState;
  }
};

function App() {
  const [state, setState] = useState<AppState>(getInitialState);
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  const [toastTimeout, setToastTimeout] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state', e);
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    if (toastTimeout) clearTimeout(toastTimeout);
    const tm = window.setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2800);
    setToastTimeout(tm);
  };

  const addPoints = (n: number, type: string, label: string) => {
    const today = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
    setState(prev => {
      const checkinsUpdate = { ...prev.checkins };
      // Auto-register checkin in state mapping if it's a checkin activity
      if (type === 'checkin') {
        const beach = BEACHES.find(b => label.includes(b.name));
        if (beach) {
          checkinsUpdate[beach.id] = new Date().toDateString();
        }
      }
      return {
        ...prev,
        points: prev.points + n,
        history: [{ type, label, pts: n, date: today }, ...prev.history],
        checkins: checkinsUpdate
      };
    });
  };

  const subtractPoints = (n: number) => {
    setState(prev => ({
      ...prev,
      points: Math.max(0, prev.points - n)
    }));
  };

  const addRedeemed = (item: RedeemedItem) => {
    setState(prev => ({
      ...prev,
      redeemed: [item, ...prev.redeemed]
    }));
  };

  const claimChallenge = (id: string) => {
    setState(prev => ({
      ...prev,
      claimedChallenges: [...prev.claimedChallenges, id]
    }));
  };

  // Level computation
  const levelFor = (points: number) => {
    if (points < 100) return { name: 'Bronce', emoji: '🥉', min: 0, max: 100 };
    if (points < 300) return { name: 'Plata', emoji: '🥈', min: 100, max: 300 };
    if (points < 600) return { name: 'Oro', emoji: '🥇', min: 300, max: 600 };
    return { name: 'Platino', emoji: '💎', min: 600, max: 1000 };
  };

  const currentLevel = levelFor(state.points);
  
  // Calculate percentage progress to next level
  const levelRange = currentLevel.max - currentLevel.min;
  const progressInLevel = state.points - currentLevel.min;
  const levelPct = Math.min(Math.round((progressInLevel / levelRange) * 100), 100);

  const TABS = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'mapa', label: 'Mapa', icon: MapPin },
    { id: 'registrar', label: 'Registrar', icon: Camera },
    { id: 'qr', label: 'Escanear QR', icon: QrCode },
    { id: 'retos', label: 'Retos', icon: Trophy },
    { id: 'ranking', label: 'Ranking', icon: BarChart3 },
    { id: 'premios', label: 'Canjear', icon: Gift },
    { id: 'tito', label: 'EcoTito', icon: MessageSquare },
    { id: 'info', label: 'Información', icon: BookOpen }
  ];

  const navigateTo = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-sand text-ink flex flex-col font-figtree">
      
      {/* Mobile Top Navbar */}
      <header className="bg-gradient-to-r from-ocean-deep to-ocean-mid text-white px-4 py-4 sticky top-0 z-40 shadow-md flex justify-between items-center md:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-label="wave">🌊</span>
          <div>
            <h1 className="font-fraunces font-extrabold tracking-wider leading-none text-base">ECO LINK</h1>
            <span className="font-fraunces italic text-gold font-black text-sm">Paita</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Points badge */}
          <div className="bg-white/10 border border-white/20 rounded-full px-3 py-1 flex items-center gap-1.5 font-mono text-xs font-bold text-gold">
            <span>🌿</span>
            <span>{state.points}</span>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-ink/70 backdrop-blur-sm z-30 md:hidden animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-paper border-b border-ink/10 p-5 shadow-2xl space-y-3" onClick={e => e.stopPropagation()}>
            <div className="grid grid-cols-3 gap-2">
              {TABS.map(t => {
                const Icon = t.icon;
                const isSelected = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => navigateTo(t.id)}
                    className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 border text-center transition-all ${
                      isSelected 
                        ? 'bg-turtle border-turtle text-white font-bold shadow-md'
                        : 'bg-white border-ink/5 text-ink hover:border-turtle'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] truncate w-full font-bold">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Nav Bar (Desktop Only) */}
      <nav className="hidden md:flex bg-paper border-b border-ink/10 sticky top-0 z-40 shadow-sm px-6 py-2.5 justify-center">
        <div className="max-w-6xl w-full flex justify-between items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigateTo('inicio')}>
            <span className="text-2xl" role="img" aria-label="wave">🌊</span>
            <div>
              <h1 className="font-fraunces font-black tracking-wider leading-none text-md text-ocean-deep">ECO LINK</h1>
              <span className="font-fraunces italic text-gold font-extrabold text-xs">Paita</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {TABS.map(t => {
              const Icon = t.icon;
              const isSelected = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => navigateTo(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-xs transition-all whitespace-nowrap ${
                    isSelected 
                      ? 'bg-turtle text-white shadow-sm'
                      : 'text-ink-soft hover:text-turtle border border-transparent hover:border-turtle/25 hover:bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Quick Stats chip for desktop */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white border border-ink/10 rounded-full py-1 px-4 flex items-center gap-2 shadow-sm font-mono text-xs font-bold text-ocean-deep">
              <span>🌿</span>
              <span>{state.points} <span className="font-sans font-medium text-[10px] text-ink-soft">pts</span></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Left/Main Column */}
        <section className="flex-1 space-y-6">
          
          {/* Welcome Banner Illustration Section (Matches hand drawing) */}
          <div className="relative bg-white border border-ink/10 rounded-3xl p-6 md:p-8 shadow-custom overflow-hidden flex flex-col md:flex-row items-center gap-6 justify-between">
            {/* Custom SVG Ocean and Beach drawing in background (drawn to match sketch exactly) */}
            <div className="absolute right-0 bottom-0 top-0 w-full md:w-3/5 pointer-events-none opacity-20 md:opacity-100 overflow-hidden rounded-r-3xl">
              <svg className="w-full h-full object-cover min-h-[160px]" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Sea (Water gradient) */}
                <path d="M120,200 L400,200 L400,100 Q330,120 260,110 T120,200 Z" fill="url(#seaGrad)" />
                {/* Sand shoreline */}
                <path d="M0,200 L140,200 Q260,115 400,102 L400,90 Q300,105 200,90 T0,200 Z" fill="#E6D6B0" />
                <path d="M0,200 L120,200 Q220,130 400,115 L400,100 Q260,115 120,200 Z" fill="#F3E9D6" />
                
                {/* Sun */}
                <circle cx="340" cy="40" r="18" fill="#D9A441" />
                {/* Sun rays */}
                <line x1="340" y1="15" x2="340" y2="5" stroke="#D9A441" strokeWidth="2.5" />
                <line x1="340" y1="65" x2="340" y2="75" stroke="#D9A441" strokeWidth="2.5" />
                <line x1="315" y1="40" x2="305" y2="40" stroke="#D9A441" strokeWidth="2.5" />
                <line x1="365" y1="40" x2="375" y2="40" stroke="#D9A441" strokeWidth="2.5" />
                <line x1="322" y1="22" x2="315" y2="15" stroke="#D9A441" strokeWidth="2.5" />
                <line x1="358" y1="58" x2="365" y2="65" stroke="#D9A441" strokeWidth="2.5" />
                <line x1="322" y1="58" x2="315" y2="65" stroke="#D9A441" strokeWidth="2.5" />
                <line x1="358" y1="22" x2="365" y2="15" stroke="#D9A441" strokeWidth="2.5" />

                {/* Palm Tree */}
                <path d="M35,200 Q42,140 30,100" stroke="#B5652E" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* Palm Leaves */}
                <path d="M30,100 Q5,85 -10,100" stroke="#3F8F5F" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M30,100 Q15,70 5,60" stroke="#3F8F5F" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M30,100 Q40,65 55,70" stroke="#3F8F5F" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M30,100 Q65,95 80,115" stroke="#3F8F5F" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M30,100 Q50,115 60,135" stroke="#3F8F5F" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M30,100 Q20,115 10,130" stroke="#3F8F5F" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Grass at base */}
                <path d="M20,200 L25,190 L32,200 L40,188 L46,200" stroke="#2C6B45" strokeWidth="2" fill="none" />

                {/* Little swimming turtle */}
                <g transform="translate(240, 150) scale(0.65)">
                  <ellipse cx="20" cy="15" rx="14" ry="10" fill="#3F8F5F" stroke="#1E2A24" strokeWidth="2" />
                  <circle cx="35" cy="15" r="5" fill="#3F8F5F" stroke="#1E2A24" strokeWidth="2" />
                  <path d="M 12 5 Q 5 2 3 8" stroke="#1E2A24" strokeWidth="2" fill="none" />
                  <path d="M 12 25 Q 5 28 3 22" stroke="#1E2A24" strokeWidth="2" fill="none" />
                </g>
                
                {/* Swimming fish */}
                <g transform="translate(190, 165) scale(0.55)">
                  <path d="M10,10 C25,2 35,18 10,10 Z" fill="#4FA8C9" stroke="#136C86" strokeWidth="1.5" />
                  <polygon points="10,10 2,5 5,10 2,15" fill="#4FA8C9" stroke="#136C86" strokeWidth="1.5" />
                </g>

                <defs>
                  <linearGradient id="seaGrad" x1="260" y1="110" x2="400" y2="200" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#4FA8C9" />
                    <stop offset="100%" stopColor="#0B4B63" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Left Title Content */}
            <div className="z-10 text-center md:text-left space-y-3 max-w-sm">
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider leading-none text-ocean-deep font-fraunces">
                  ECO LINK
                </h1>
                <h2 className="text-3xl md:text-4xl font-black italic text-gold font-fraunces flex items-center justify-center md:justify-start gap-1">
                  PAITA <span className="text-2xl not-italic">🌊</span>
                </h2>
              </div>
              <p className="text-sm font-semibold text-ink leading-relaxed">
                Protege la vida marina, cuida el planeta y mejora el futuro.
              </p>
              
              {activeTab !== 'inicio' && (
                <button
                  onClick={() => navigateTo('inicio')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-turtle hover:text-turtle-dark bg-turtle/5 border border-turtle/20 px-3 py-1.5 rounded-full hover:bg-turtle/10 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver al inicio
                </button>
              )}
            </div>
          </div>

          {/* DYNAMIC CONTENTS */}
          <div className="animate-fadeIn">
            {activeTab === 'inicio' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-fraunces text-ocean-deep flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    Explora Eco Link
                  </h3>
                  <p className="text-xs text-ink-soft">Toca una de las secciones para realizar una acción ambiental o consultar información.</p>
                </div>

                {/* 8 Quick Action Cards Grid (Directly matches hand drawing) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Beach Map */}
                  <button onClick={() => navigateTo('mapa')} className="bg-white border border-ink/10 hover:border-turtle rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-custom group">
                    <span className="text-2xl p-2 bg-[#E3F2FD] rounded-xl inline-block" role="img" aria-label="map">📍</span>
                    <h4 className="font-bold text-sm text-ink mt-3 uppercase tracking-wide group-hover:text-turtle-dark">Mapa de Playas</h4>
                    <p className="text-xs text-ink-soft mt-1 leading-snug">Explora las playas de Paita y conoce su estado de limpieza.</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-turtle mt-3">
                      Ver mapa <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>

                  {/* Card 2: Register Action */}
                  <button onClick={() => navigateTo('registrar')} className="bg-white border border-ink/10 hover:border-turtle rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-custom group">
                    <span className="text-2xl p-2 bg-[#EAF6EE] rounded-xl inline-block" role="img" aria-label="camera">📸</span>
                    <h4 className="font-bold text-sm text-ink mt-3 uppercase tracking-wide group-hover:text-turtle-dark">Registrar Actividad</h4>
                    <p className="text-xs text-ink-soft mt-1 leading-snug">Sube evidencia de tus acciones ecológicas y gana puntos.</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-turtle mt-3">
                      Registrar <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>

                  {/* Card 3: Scan QR */}
                  <button onClick={() => navigateTo('qr')} className="bg-white border border-ink/10 hover:border-turtle rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-custom group">
                    <span className="text-2xl p-2 bg-[#FFF3E0] rounded-xl inline-block" role="img" aria-label="qr">🔳</span>
                    <h4 className="font-bold text-sm text-ink mt-3 uppercase tracking-wide group-hover:text-turtle-dark">Escanear QR</h4>
                    <p className="text-xs text-ink-soft mt-1 leading-snug">Escanea los códigos QR en las playas para validar tu actividad.</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-turtle mt-3">
                      Escanear <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>

                  {/* Card 4: Challenges */}
                  <button onClick={() => navigateTo('retos')} className="bg-white border border-ink/10 hover:border-turtle rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-custom group">
                    <span className="text-2xl p-2 bg-[#FFFDE7] rounded-xl inline-block" role="img" aria-label="trophy">🏆</span>
                    <h4 className="font-bold text-sm text-ink mt-3 uppercase tracking-wide group-hover:text-turtle-dark">Retos Ecológicos</h4>
                    <p className="text-xs text-ink-soft mt-1 leading-snug">Participa en retos divertidos y ayuda a cuidar las playas.</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-turtle mt-3">
                      Ver retos <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>

                  {/* Card 5: Ranking */}
                  <button onClick={() => navigateTo('ranking')} className="bg-white border border-ink/10 hover:border-turtle rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-custom group">
                    <span className="text-2xl p-2 bg-[#F3E5F5] rounded-xl inline-block" role="img" aria-label="bar chart">📊</span>
                    <h4 className="font-bold text-sm text-ink mt-3 uppercase tracking-wide group-hover:text-turtle-dark">Ranking Ecológico</h4>
                    <p className="text-xs text-ink-soft mt-1 leading-snug">Mira a los usuarios más comprometidos con el ambiente.</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-turtle mt-3">
                      Ver ranking <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>

                  {/* Card 6: Rewards Shop */}
                  <button onClick={() => navigateTo('premios')} className="bg-white border border-ink/10 hover:border-turtle rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-custom group">
                    <span className="text-2xl p-2 bg-[#FFE0B2] rounded-xl inline-block" role="img" aria-label="gift">🎁</span>
                    <h4 className="font-bold text-sm text-ink mt-3 uppercase tracking-wide group-hover:text-turtle-dark">Canjear Premios</h4>
                    <p className="text-xs text-ink-soft mt-1 leading-snug">Usa tus puntos para obtener descuentos y premios ecológicos.</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-turtle mt-3">
                      Ver premios <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>

                  {/* Card 7: EcoTito Mascot */}
                  <button onClick={() => navigateTo('tito')} className="bg-white border border-ink/10 hover:border-turtle rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-custom group">
                    <span className="text-2xl p-2 bg-[#E8F5E9] rounded-xl inline-block" role="img" aria-label="turtle">🐢</span>
                    <h4 className="font-bold text-sm text-ink mt-3 uppercase tracking-wide group-hover:text-turtle-dark">Eco Tito</h4>
                    <p className="text-xs text-ink-soft mt-1 leading-snug">Tu mascota ecológica que te enseña y te motiva a cuidar el planeta.</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-turtle mt-3">
                      Hablar con EcoTito <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>

                  {/* Card 8: Beach Info */}
                  <button onClick={() => navigateTo('info')} className="bg-white border border-ink/10 hover:border-turtle rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-custom group">
                    <span className="text-2xl p-2 bg-[#E0F7FA] rounded-xl inline-block" role="img" aria-label="info">ℹ️</span>
                    <h4 className="font-bold text-sm text-ink mt-3 uppercase tracking-wide group-hover:text-turtle-dark">Información de Playas</h4>
                    <p className="text-xs text-ink-soft mt-1 leading-snug">Conoce consejos, noticias y datos importantes sobre nuestras playas.</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-turtle mt-3">
                      Ver información <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB PANELS */}
            {activeTab === 'mapa' && (
              <BeachMap checkins={state.checkins} addPoints={addPoints} showToast={showToast} />
            )}
            
            {activeTab === 'registrar' && (
              <RegisterActivity history={state.history} addPoints={addPoints} showToast={showToast} />
            )}
            
            {activeTab === 'qr' && (
              <QRScanner addPoints={addPoints} showToast={showToast} />
            )}
            
            {activeTab === 'retos' && (
              <Challenges 
                history={state.history} 
                claimedChallenges={state.claimedChallenges} 
                addPoints={addPoints} 
                claimChallenge={claimChallenge} 
                showToast={showToast} 
              />
            )}
            
            {activeTab === 'ranking' && (
              <Leaderboard points={state.points} />
            )}
            
            {activeTab === 'premios' && (
              <RewardStore 
                points={state.points} 
                redeemed={state.redeemed} 
                subtractPoints={subtractPoints} 
                addRedeemed={addRedeemed} 
                showToast={showToast} 
              />
            )}
            
            {activeTab === 'tito' && (
              <EcoTito />
            )}
            
            {activeTab === 'info' && (
              <EcoInfo />
            )}
          </div>
        </section>

        {/* Right/Sidebar Column (Matches the sidebar block in hand drawing) */}
        <aside className="w-full md:w-80 shrink-0 space-y-6">
          
          {/* User Profile Card */}
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-custom space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-turtle/10 border border-turtle/25 text-turtle-dark rounded-full flex items-center justify-center shadow-inner">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-ink leading-tight">Hola, Usuario 👋</h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-turtle mt-0.5">
                  Nivel {currentLevel.name} {currentLevel.emoji}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-ink/5 space-y-2">
              <div className="flex justify-between text-xs font-bold text-ink-soft">
                <span>Puntos Ecológicos</span>
                <span className="font-mono text-ocean-deep">{state.points} pts</span>
              </div>

              {/* Progress to next level */}
              <div className="space-y-1">
                <div className="w-full bg-sand rounded-full h-2 overflow-hidden border border-ink/5">
                  <div 
                    className="bg-gold h-full rounded-full transition-all duration-300"
                    style={{ width: `${levelPct}%` }}
                  />
                </div>
                {currentLevel.max !== Infinity ? (
                  <span className="text-[10px] text-ink-soft block text-right font-medium">
                    Faltan {currentLevel.max - state.points} pts para el siguiente nivel
                  </span>
                ) : (
                  <span className="text-[10px] text-turtle-dark block text-right font-bold">
                    ¡Nivel Máximo Alcanzado! 🏆
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Guide Card: How to earn points */}
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-custom space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-ink-soft font-fraunces border-b border-ink/5 pb-2">
              ¿Cómo ganar puntos?
            </h3>
            
            <div className="space-y-3">
              <div className="flex gap-3 text-xs">
                <span className="text-xl bg-paper p-1.5 rounded-lg h-9 w-9 flex items-center justify-center shrink-0">🗑️</span>
                <div>
                  <span className="font-bold text-ink block leading-snug">Recoger residuos</span>
                  <span className="text-[10px] font-semibold text-turtle-dark">+10 pts por registro</span>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-xl bg-paper p-1.5 rounded-lg h-9 w-9 flex items-center justify-center shrink-0">🏆</span>
                <div>
                  <span className="font-bold text-ink block leading-snug">Participar en retos</span>
                  <span className="text-[10px] font-semibold text-turtle-dark">+20 / +30 pts por reto</span>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-xl bg-paper p-1.5 rounded-lg h-9 w-9 flex items-center justify-center shrink-0">🌱</span>
                <div>
                  <span className="font-bold text-ink block leading-snug">Asistir a campañas</span>
                  <span className="text-[10px] font-semibold text-turtle-dark">+30 pts por campaña</span>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-xl bg-paper p-1.5 rounded-lg h-9 w-9 flex items-center justify-center shrink-0">🔳</span>
                <div>
                  <span className="font-bold text-ink block leading-snug">Escanear código QR</span>
                  <span className="text-[10px] font-semibold text-turtle-dark">+10 pts por playa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard snippet (Top 3 users) */}
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-custom space-y-3">
            <div className="flex justify-between items-center border-b border-ink/5 pb-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-ink-soft font-fraunces">
                Ranking Líderes
              </h3>
              <button 
                onClick={() => navigateTo('ranking')}
                className="text-[10px] font-bold text-turtle hover:underline"
              >
                Ver todo
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-1.5 hover:bg-paper rounded-lg transition-colors">
                <span className="font-bold text-amber-500">1. Ana</span>
                <span className="font-mono font-bold text-ink-soft">350 pts</span>
              </div>
              <div className="flex items-center justify-between p-1.5 hover:bg-paper rounded-lg transition-colors">
                <span className="font-bold text-slate-400">2. Luis</span>
                <span className="font-mono font-bold text-ink-soft">320 pts</span>
              </div>
              <div className="flex items-center justify-between p-1.5 hover:bg-paper rounded-lg transition-colors">
                <span className="font-bold text-amber-700">3. María</span>
                <span className="font-mono font-bold text-ink-soft">300 pts</span>
              </div>
            </div>
          </div>

          {/* Featured Rewards snippet */}
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-custom space-y-3">
            <div className="flex justify-between items-center border-b border-ink/5 pb-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-ink-soft font-fraunces">
                Premios Destacados
              </h3>
              <button 
                onClick={() => navigateTo('premios')}
                className="text-[10px] font-bold text-turtle hover:underline"
              >
                Tienda
              </button>
            </div>

            <div className="space-y-3.5 pt-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-lg">🍽️</span>
                <span className="font-medium text-ink flex-1 truncate">10% dcto. en restaurantes</span>
                <span className="font-bold text-ocean-mid shrink-0">80 pts</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-lg">🧤</span>
                <span className="font-medium text-ink flex-1 truncate">Kit de limpieza de playa</span>
                <span className="font-bold text-ocean-mid shrink-0">60 pts</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-lg">🧴</span>
                <span className="font-medium text-ink flex-1 truncate">Botella de agua Eco Link</span>
                <span className="font-bold text-ocean-mid shrink-0">100 pts</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer (Matches hand drawing) */}
      <footer className="bg-gradient-to-r from-ocean-deep to-ocean-mid border-t border-white/5 py-4 px-4 text-white text-center shadow-inner mt-6 shrink-0 relative overflow-hidden">
        {/* Animated small wave shape decoration in footer */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/10 opacity-40 select-none pointer-events-none" />
        <p className="text-xs font-semibold font-fraunces flex items-center justify-center gap-1 tracking-wider leading-none">
          🐚 Juntos por playas más limpias y un planeta mejor 💚
        </p>
      </footer>

      {/* Floating Toast notification */}
      <div 
        className={`fixed left-1/2 -translate-x-1/2 bottom-8 bg-ink border border-white/10 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-2xl transition-all duration-300 z-50 text-center max-w-[85%] ${
          toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {toast.msg}
      </div>
    </div>
  );
}

export default App;
