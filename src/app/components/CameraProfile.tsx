import { useState, useRef, useEffect } from 'react';

interface CameraProfileProps {
  onPhotoTaken: (dataUrl: string) => void;
  onClose: () => void;
}

export function CameraProfile({ onPhotoTaken, onClose }: CameraProfileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => {
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(err => {
         setError('Não foi possível acessar a câmera. Verifique as permissões.');
         console.error(err);
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleTakePic = () => {
     if (videoRef.current) {
         const canvas = document.createElement('canvas');
         canvas.width = videoRef.current.videoWidth;
         canvas.height = videoRef.current.videoHeight;
         const ctx = canvas.getContext('2d');
         if (ctx) {
             ctx.drawImage(videoRef.current, 0, 0);
             const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
             onPhotoTaken(dataUrl);
         }
     }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-[4px]" onClick={onClose}>
      <div className="relative w-full max-w-sm p-4 rounded-xl border border-yellow-600/40 bg-black/90 shadow-[0_0_20px_rgba(251,191,36,0.1)]" onClick={e => e.stopPropagation()}>
         <h3 className="text-yellow-500 mb-4 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Retrato do Herói</h3>
         {error ? (
            <p className="text-red-400/80 text-center text-sm py-4">{error}</p>
         ) : (
            <div className="rounded-lg overflow-hidden border border-yellow-700/50 mb-4 bg-black object-cover relative" style={{ aspectRatio: '1/1' }}>
               <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>
         )}
         <div className="flex gap-2 justify-center">
            <button onClick={onClose} className="flex-1 py-2 border border-yellow-900/40 text-yellow-500/80 rounded-lg hover:bg-yellow-900/20 transition-colors" style={{ fontFamily: "'Cinzel', serif", fontSize: '12px' }}>Voltar</button>
            {!error && (
               <button onClick={handleTakePic} className="flex-1 py-2 bg-gradient-to-r from-yellow-700 to-yellow-600 text-yellow-100 rounded-lg border border-yellow-500/40 hover:from-yellow-600 hover:to-yellow-500 transition-colors" style={{ fontFamily: "'Cinzel', serif", fontSize: '12px' }}>Capturar</button>
            )}
         </div>
      </div>
    </div>
  );
}
