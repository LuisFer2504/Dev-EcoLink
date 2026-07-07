import React, { useState } from 'react';
import { QrCode, RefreshCw, CheckCircle2 } from 'lucide-react';
import { BEACHES } from './BeachMap';

interface QRScannerProps {
  addPoints: (points: number, type: string, label: string) => void;
  showToast: (msg: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ addPoints, showToast }) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{ beachName: string; code: string; date: string } | null>(null);

  const handleScan = () => {
    setScanning(true);
    setScanResult(null);

    // Simulate scanner latency
    setTimeout(() => {
      const randomBeach = BEACHES[Math.floor(Math.random() * BEACHES.length)];
      const scanCode = 'QR-' + Math.random().toString(36).substring(2, 7).toUpperCase();
      const today = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      
      addPoints(10, 'qr', `Código QR escaneado en ${randomBeach.name}`);
      setScanResult({
        beachName: randomBeach.name,
        code: scanCode,
        date: today
      });
      setScanning(false);
      showToast(`¡Código QR verificado en ${randomBeach.name}! +10 pts 🔳`);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-fraunces text-ocean-deep flex items-center gap-2">
          <QrCode className="w-5 h-5 text-coral" />
          Escanear Código QR
        </h2>
        <p className="text-sm text-ink-soft">Escanea los códigos QR físicos ubicados en los paneles informativos de cada playa para validar tu presencia.</p>
      </div>

      <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-custom flex flex-col items-center">
        {/* Mock Viewfinder Frame */}
        <div className="relative w-64 h-64 rounded-3xl overflow-hidden border-4 border-ocean-deep bg-[#ececec] flex items-center justify-center shadow-inner mb-6">
          {/* Border focus corners */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-turtle rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-turtle rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-turtle rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-turtle rounded-br-lg" />

          {/* Grid pattern background when not scanning */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

          {scanning ? (
            <>
              {/* Laser Line */}
              <div className="absolute left-6 right-6 h-1 bg-coral shadow-[0_0_8px_#D9695A] rounded-full animate-scan" />
              
              {/* Spinning/pulsing scanner graphic */}
              <QrCode className="w-24 h-24 text-ocean-deep/10 animate-pulse" />
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-ink-soft/40">
              <QrCode className="w-28 h-28 stroke-[1.2]" />
              <span className="text-xs font-semibold">Cámara inactiva</span>
            </div>
          )}
        </div>

        <button
          onClick={handleScan}
          disabled={scanning}
          className={`px-8 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 ${
            scanning
              ? 'bg-ink-soft text-white cursor-not-allowed opacity-85'
              : 'bg-ocean-deep hover:bg-ocean-mid text-white'
          }`}
        >
          {scanning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Escaneando código...
            </>
          ) : (
            <>
              <QrCode className="w-4 h-4" />
              Iniciar Escáner
            </>
          )}
        </button>
      </div>

      {scanResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-custom animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-2.5 rounded-full text-turtle-dark shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-1.5">
              <h3 className="font-bold text-emerald-900 leading-tight">¡Código QR Verificado!</h3>
              <p className="text-xs text-emerald-800">
                Se ha confirmado tu visita y acción ecológica en la playa.
              </p>
              
              <div className="pt-3 border-t border-emerald-200/60 grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-emerald-700/80 block uppercase tracking-wider font-semibold">Ubicación</span>
                  <span className="font-bold text-emerald-900">{scanResult.beachName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700/80 block uppercase tracking-wider font-semibold">Código Registro</span>
                  <span className="font-mono font-bold text-emerald-900">{scanResult.code}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-emerald-700/80 block uppercase tracking-wider font-semibold">Fecha y Hora</span>
                  <span className="font-medium text-emerald-900">{scanResult.date}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs font-bold text-emerald-900">
                <span>Puntos Recompensados:</span>
                <span className="font-mono text-sm font-black">+10 Pts</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
