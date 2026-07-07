import React, { useState } from 'react';
import { Camera, Send, History, Check } from 'lucide-react';

export interface HistoryItem {
  type: string;
  label: string;
  pts: number;
  date: string;
}

interface RegisterActivityProps {
  history: HistoryItem[];
  addPoints: (points: number, type: string, label: string) => void;
  showToast: (msg: string) => void;
}

const ACTIVITY_TYPES = [
  { value: 'recojo', label: 'Recojo de residuos (+10 pts)', pts: 10, icon: '🧹' },
  { value: 'reciclaje', label: 'Reciclaje de materiales (+15 pts)', pts: 15, icon: '♻️' },
  { value: 'reporte', label: 'Reporte de contaminación (+5 pts)', pts: 5, icon: '📢' }
];

export const RegisterActivity: React.FC<RegisterActivityProps> = ({ history, addPoints, showToast }) => {
  const [type, setType] = useState<string>('recojo');
  const [desc, setDesc] = useState<string>('');
  const [photoAttached, setPhotoAttached] = useState<boolean>(false);
  const [mockFileName, setMockFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAttachPhoto = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    setMockFileName(`evidencia_${randomId}.jpg`);
    setPhotoAttached(true);
    showToast('✓ Evidencia fotográfica cargada');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) {
      showToast('Por favor, ingresa una descripción para tu actividad.');
      return;
    }
    if (!photoAttached) {
      showToast('Por favor, adjunta una foto como evidencia.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const selectedTypeConfig = ACTIVITY_TYPES.find(a => a.value === type) || ACTIVITY_TYPES[0];
      addPoints(selectedTypeConfig.pts, type, desc.trim().slice(0, 60));
      showToast(`¡Actividad registrada! +${selectedTypeConfig.pts} pts 🌿`);
      
      // Reset form
      setDesc('');
      setPhotoAttached(false);
      setMockFileName('');
      setIsSubmitting(false);
    }, 800);
  };

  const getIconForType = (itemType: string) => {
    switch (itemType) {
      case 'recojo': return '🗑️';
      case 'reciclaje': return '♻️';
      case 'reporte': return '📢';
      case 'checkin': return '📍';
      case 'qr': return '🔳';
      case 'reto': return '🏆';
      default: return '🌿';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-fraunces text-ocean-deep flex items-center gap-2">
          <Camera className="w-5 h-5 text-turtle" />
          Registrar Actividad
        </h2>
        <p className="text-sm text-ink-soft">Registra tus buenas acciones ecológicas con una foto para ganar puntos ambientales.</p>
      </div>

      <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-custom">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink-soft mb-1 uppercase tracking-wider">Tipo de actividad</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 rounded-xl border border-ink/10 bg-paper text-ink font-sans text-sm focus:outline-none focus:border-turtle focus:ring-1 focus:ring-turtle"
            >
              {ACTIVITY_TYPES.map(a => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-soft mb-1 uppercase tracking-wider">Descripción</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Ej: Recogí botellas plásticas en la orilla de Playa Colán, cerca del muelle..."
              className="w-full p-3 rounded-xl border border-ink/10 bg-paper text-ink font-sans text-sm placeholder:text-ink-soft/50 focus:outline-none focus:border-turtle focus:ring-1 focus:ring-turtle resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-soft mb-1 uppercase tracking-wider">Evidencia fotográfica</label>
            <div className="mt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleAttachPhoto}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition-all duration-200 ${
                  photoAttached 
                    ? 'border-turtle bg-emerald-50 text-turtle-dark'
                    : 'border-dashed border-ink/20 hover:border-turtle bg-paper text-ink hover:text-turtle-dark'
                }`}
              >
                <Camera className="w-4 h-4" />
                {photoAttached ? 'Cambiar foto cargada' : '📷 Adjuntar foto de evidencia'}
              </button>

              {photoAttached && (
                <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl text-xs text-turtle-dark">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-lg shadow-inner">
                    🌊
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold block">{mockFileName}</span>
                    <span className="text-[10px] text-ink-soft">Foto cargada con éxito</span>
                  </div>
                  <Check className="w-4 h-4 text-turtle" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-bold bg-turtle hover:bg-turtle-dark text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              'Guardando actividad...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                Registrar Actividad
              </>
            )}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-bold font-fraunces text-ocean-deep flex items-center gap-2">
          <History className="w-4 h-4 text-ocean-mid" />
          Tu Historial Reciente
        </h3>
        
        <div className="bg-white border border-ink/10 rounded-2xl p-4 shadow-custom">
          {history.length === 0 ? (
            <div className="text-center py-6 text-sm text-ink-soft italic">
              Aún no has registrado ninguna actividad ecológica.
            </div>
          ) : (
            <div className="divide-y divide-ink/10">
              {history.slice(0, 8).map((h, i) => (
                <div key={i} className="flex justify-between items-center py-3 first:pt-0 last:pb-0 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-lg" role="img" aria-label="Icon">
                      {getIconForType(h.type)}
                    </span>
                    <div>
                      <span className="font-semibold text-ink block leading-tight">{h.label}</span>
                      <span className="text-[10px] text-ink-soft">{h.date}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-turtle text-right shrink-0">
                    +{h.pts} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
