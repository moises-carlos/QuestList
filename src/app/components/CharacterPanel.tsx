import { useState } from "react";
import { Character, xpToNextLevel, CLASS_OPTIONS } from "./types";

interface CharacterPanelProps {
  character: Character;
  onUpdateName: (name: string) => void;
  onUpdateClass: (cls: string) => void;
}

const CLASS_ICONS: Record<string, string> = {
  warrior: "⚔️",
  mage: "🔮",
  rogue: "🗡️",
  paladin: "🛡️",
  ranger: "🏹",
  bard: "🎵",
};

const LEVEL_TITLES: Record<number, string> = {
  1: "Iniciante",
  2: "Aprendiz",
  3: "Aventureiro",
  4: "Veterano",
  5: "Especialista",
  6: "Mestre",
  7: "Arquimestre",
  8: "Lenda",
  9: "Mito",
  10: "Imortal",
};

function getLevelTitle(level: number): string {
  if (level >= 10) return "Imortal";
  return LEVEL_TITLES[level] || "Aventureiro";
}

function getAvatarGradient(charClass: string): string {
  const gradients: Record<string, string> = {
    warrior: "from-red-900 via-red-800 to-orange-900",
    mage: "from-indigo-900 via-purple-900 to-blue-900",
    rogue: "from-gray-900 via-slate-800 to-gray-900",
    paladin: "from-yellow-900 via-amber-800 to-yellow-900",
    ranger: "from-green-900 via-emerald-800 to-teal-900",
    bard: "from-pink-900 via-purple-800 to-indigo-900",
  };
  return gradients[charClass] || gradients.warrior;
}

export function CharacterPanel({ character, onUpdateName, onUpdateClass }: CharacterPanelProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(character.name);
  const [showClassSelect, setShowClassSelect] = useState(false);

  const xpNeeded = xpToNextLevel(character.level);
  const xpPercent = Math.min((character.currentXP / xpNeeded) * 100, 100);

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
    }
    setEditingName(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Avatar Card */}
      <div className="relative overflow-hidden rounded-xl border border-yellow-600/30 bg-gradient-to-b from-[#1a1408] to-[#0f0c04]">
        {/* Decorative top border */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />

        {/* Avatar area */}
        <div className={`relative flex items-center justify-center bg-gradient-to-b ${getAvatarGradient(character.class)} mx-4 mt-4 mb-3 rounded-lg h-32 overflow-hidden`}>
          {/* Background particles */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-yellow-400"
                style={{
                  width: `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                  left: `${10 + i * 11}%`,
                  top: `${20 + (i % 4) * 20}%`,
                  opacity: 0.4 + (i % 3) * 0.2,
                }}
              />
            ))}
          </div>
          <div className="text-6xl select-none z-10" style={{ filter: "drop-shadow(0 0 12px rgba(251,191,36,0.4))" }}>
            {CLASS_ICONS[character.class] || "⚔️"}
          </div>
          {/* Level badge */}
          <div className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 border border-yellow-500/50 text-yellow-400" style={{ fontFamily: "'Cinzel', serif", fontSize: "11px" }}>
            {character.level}
          </div>
        </div>

        {/* Name */}
        <div className="px-4 pb-1 text-center">
          {editingName ? (
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              className="w-full text-center bg-transparent border-b border-yellow-500/50 text-yellow-100 outline-none pb-0.5"
              style={{ fontFamily: "'Cinzel', serif", fontSize: "15px" }}
            />
          ) : (
            <button
              onClick={() => { setEditingName(true); setNameInput(character.name); }}
              className="text-yellow-100 hover:text-yellow-300 transition-colors cursor-pointer"
              style={{ fontFamily: "'Cinzel', serif", fontSize: "15px" }}
            >
              {character.name}
            </button>
          )}
          <p className="text-yellow-600/80 mt-0.5" style={{ fontFamily: "'EB Garamond', serif", fontSize: "12px", fontStyle: "italic" }}>
            {getLevelTitle(character.level)}
          </p>
        </div>

        {/* Class selector */}
        <div className="px-4 pb-3 relative">
          <button
            onClick={() => setShowClassSelect(!showClassSelect)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-yellow-700/30 bg-yellow-900/20 hover:bg-yellow-900/30 transition-colors"
          >
            <span className="text-yellow-400/80" style={{ fontFamily: "'EB Garamond', serif", fontSize: "13px" }}>
              {CLASS_OPTIONS.find(c => c.value === character.class)?.icon} {CLASS_OPTIONS.find(c => c.value === character.class)?.label || "Guerreiro"}
            </span>
            <span className="text-yellow-600/60 text-xs">▼</span>
          </button>
          {showClassSelect && (
            <div className="absolute left-4 right-4 top-full mt-1 rounded-lg border border-yellow-700/40 bg-[#1a1408] shadow-xl z-20 overflow-hidden">
              {CLASS_OPTIONS.map((cls) => (
                <button
                  key={cls.value}
                  onClick={() => { onUpdateClass(cls.value); setShowClassSelect(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-yellow-900/30 transition-colors text-left ${character.class === cls.value ? "bg-yellow-900/40 text-yellow-300" : "text-yellow-500/80"}`}
                  style={{ fontFamily: "'EB Garamond', serif", fontSize: "13px" }}
                >
                  <span>{cls.icon}</span>
                  <span>{cls.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
      </div>

      {/* XP Bar */}
      <div className="rounded-xl border border-yellow-600/20 bg-gradient-to-b from-[#1a1408] to-[#0f0c04] p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-yellow-500/70" style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.08em" }}>
            EXPERIÊNCIA
          </span>
          <span className="text-yellow-400" style={{ fontFamily: "'Cinzel', serif", fontSize: "11px" }}>
            {character.currentXP} / {xpNeeded} XP
          </span>
        </div>
        <div className="relative h-3 rounded-full bg-black/60 border border-yellow-900/40 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${xpPercent}%`,
              background: "linear-gradient(90deg, #92400e, #d97706, #fbbf24)",
              boxShadow: "0 0 8px rgba(251,191,36,0.5)",
            }}
          />
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-full" />
        </div>
        <p className="text-yellow-700/60 mt-1.5 text-right" style={{ fontFamily: "'EB Garamond', serif", fontSize: "11px" }}>
          {xpNeeded - character.currentXP} XP para o próximo nível
        </p>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-yellow-600/20 bg-gradient-to-b from-[#1a1408] to-[#0f0c04] p-4">
        <h3 className="text-yellow-500/70 mb-3" style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.1em" }}>
          ATRIBUTOS
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Nível", value: character.level, icon: "⭐" },
            { label: "Missões", value: character.questsCompleted, icon: "📜" },
            { label: "XP Total", value: character.totalXPEarned, icon: "✨" },
            { label: "Sequência", value: `${character.streak}d`, icon: "🔥" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/30 border border-yellow-900/30"
            >
              <span className="text-lg mb-0.5">{stat.icon}</span>
              <span className="text-yellow-300" style={{ fontFamily: "'Cinzel', serif", fontSize: "13px" }}>
                {stat.value}
              </span>
              <span className="text-yellow-700/60" style={{ fontFamily: "'EB Garamond', serif", fontSize: "10px" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
