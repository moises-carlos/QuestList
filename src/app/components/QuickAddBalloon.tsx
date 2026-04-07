import { useState } from "react";
import { Difficulty, QuestCategory, DIFFICULTY_CONFIG } from "./types";

interface QuickAddBalloonProps {
  onAdd: (quest: { title: string; description: string; difficulty: Difficulty; category: QuestCategory }) => Promise<void>;
  onClose: () => void;
}

export function QuickAddBalloon({ onAdd, onClose }: QuickAddBalloonProps) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Usaremos defaults para a rápida adição de uma "Missão Rápida"
      await onAdd({ 
        title: title.trim(), 
        description: "", 
        difficulty, 
        category: "side" 
      });
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
     <div className="w-full h-full flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md rounded-2xl border border-yellow-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(251,191,36,0.15)] overflow-hidden pointer-events-auto"
          style={{ background: "linear-gradient(150deg, rgba(30,22,10,0.98), rgba(15,11,3,0.98))", backdropFilter: "blur(12px)" }}
        >
          {/* Glowing Top Line */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80" />
          
          <div className="p-5 flex flex-col gap-4">
             
             {/* Header */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <span className="text-xl">⚡</span>
                   <h2 className="text-yellow-400 text-sm font-semibold tracking-wide uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                     Ideia Súbita
                   </h2>
                </div>
                <button onClick={onClose} disabled={isSubmitting} className="text-yellow-700 hover:text-yellow-400 transition-colors">
                   ✕
                </button>
             </div>

             {/* Input Area */}
             <div>
                <input
                  autoFocus
                  disabled={isSubmitting}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === "Enter") handleSubmit();
                     else if (e.key === "Escape") onClose();
                  }}
                  placeholder="Qual o próximo passo da sua jornada?"
                  className="w-full bg-black/40 border border-yellow-900/40 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-900/60 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition-all text-base"
                  style={{ fontFamily: "'EB Garamond', serif" }}
                />
             </div>

             {/* Difficulty Selector */}
             <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-700 text-xs" style={{ fontFamily: "'Cinzel', serif" }}>Risco:</span>
                <div className="flex gap-1.5 flex-1 justify-end">
                   {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).slice(0, 3).map(([key, config]) => (
                      <button
                         key={key}
                         disabled={isSubmitting}
                         onClick={() => setDifficulty(key)}
                         className={`px-3 py-1.5 rounded-lg text-xs transition-all border flex items-center gap-1 ${
                            difficulty === key 
                              ? "bg-yellow-900/40 border-yellow-500/50 text-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.2)]" 
                              : "bg-black/20 border-yellow-900/30 text-yellow-700 hover:border-yellow-700/50"
                         }`}
                         style={{ fontFamily: "'EB Garamond', serif" }}
                      >
                         <span>{config.icon}</span>
                         <span className={difficulty === key ? "opacity-100" : "opacity-0 w-0 -ml-1 transition-all duration-300 overflow-hidden hidden sm:inline"}>{config.label}</span>
                      </button>
                   ))}
                </div>
             </div>

             {/* Submit Area */}
             <button
                onClick={handleSubmit}
                disabled={!title.trim() || isSubmitting}
                className="w-full py-2.5 rounded-xl border transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                style={{
                  background: title.trim() ? "linear-gradient(135deg, #78350f, #d97706)" : "rgba(20,15,5,0.6)",
                  borderColor: title.trim() ? "rgba(251,191,36,0.5)" : "rgba(251,191,36,0.1)",
                  color: "#fef3c7",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "13px"
                }}
             >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">{isSubmitting ? "Enviando Corvos..." : "Registrar Missão"}</span>
             </button>

          </div>
        </div>
     </div>
  );
}
