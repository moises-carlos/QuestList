import { useEffect, useState } from "react";

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500);
    }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      style={{ perspective: "800px" }}
    >
      {/* Background flash */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle at center, rgba(251,191,36,0.15) 0%, transparent 70%)",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Main card */}
      <div
        className="relative flex flex-col items-center justify-center text-center px-12 py-8 rounded-2xl border border-yellow-500/60"
        style={{
          background: "linear-gradient(160deg, #1c1408ee, #0f0b03ee)",
          boxShadow: "0 0 60px rgba(251,191,36,0.3), 0 0 120px rgba(251,191,36,0.1)",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.7) translateY(40px)",
          opacity: visible ? 1 : 0,
          transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div className="h-0.5 absolute top-0 left-8 right-8 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        {/* Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-400"
            style={{
              width: "4px",
              height: "4px",
              left: `${15 + i * 14}%`,
              top: i % 2 === 0 ? "10%" : "85%",
              opacity: visible ? 0.8 : 0,
              transition: `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s`,
              transform: visible ? `translateY(${i % 2 === 0 ? "-8px" : "8px"})` : "translateY(0)",
              boxShadow: "0 0 6px rgba(251,191,36,0.8)",
            }}
          />
        ))}

        <div
          className="text-6xl mb-3"
          style={{
            filter: "drop-shadow(0 0 20px rgba(251,191,36,0.8))",
            animation: visible ? "bounce 0.5s ease-in-out" : undefined,
          }}
        >
          ⭐
        </div>

        <p
          className="text-yellow-500/80 mb-1 tracking-widest"
          style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.2em" }}
        >
          SUBIU DE NÍVEL
        </p>
        <h2
          className="text-yellow-300 mb-2"
          style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "32px" }}
        >
          NÍVEL {level}
        </h2>
        <p
          className="text-yellow-600/70"
          style={{ fontFamily: "'EB Garamond', serif", fontSize: "15px", fontStyle: "italic" }}
        >
          Sua jornada continua, aventureiro!
        </p>

        <div className="h-0.5 absolute bottom-0 left-8 right-8 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
      </div>
    </div>
  );
}
