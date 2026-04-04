import { useState } from "react";
import { Difficulty, QuestCategory, DIFFICULTY_CONFIG, CATEGORY_CONFIG } from "./types";

interface AddQuestModalProps {
  onAdd: (quest: { title: string; description: string; difficulty: Difficulty; category: QuestCategory }) => void;
  onClose: () => void;
}

export function AddQuestModal({ onAdd, onClose }: AddQuestModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [category, setCategory] = useState<QuestCategory>("side");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), difficulty, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl border border-yellow-600/40 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1c1408, #0f0b03)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top decoration */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-px bg-yellow-500/60 blur-sm" />

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">📜</div>
            <h2
              className="text-yellow-400"
              style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "16px" }}
            >
              Nova Missão
            </h2>
            <p
              className="text-yellow-700/60 mt-1"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "13px", fontStyle: "italic" }}
            >
              Registre sua próxima conquista no livro de missões
            </p>
          </div>

          {/* Title input */}
          <div className="mb-4">
            <label
              className="block text-yellow-500/70 mb-1.5"
              style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.08em" }}
            >
              NOME DA MISSÃO *
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Ex: Conquistar o pico da montanha..."
              className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-yellow-800/30 text-yellow-100 placeholder-yellow-900/50 outline-none focus:border-yellow-600/50 transition-colors"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px" }}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              className="block text-yellow-500/70 mb-1.5"
              style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.08em" }}
            >
              DESCRIÇÃO (OPCIONAL)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes da missão..."
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-yellow-800/30 text-yellow-100/80 placeholder-yellow-900/50 outline-none focus:border-yellow-600/50 transition-colors resize-none"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px", fontStyle: "italic" }}
            />
          </div>

          {/* Difficulty */}
          <div className="mb-4">
            <label
              className="block text-yellow-500/70 mb-2"
              style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.08em" }}
            >
              DIFICULDADE
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border transition-all duration-200
                    ${difficulty === key
                      ? `${config.border} ${config.bg} ${config.textColor}`
                      : "border-yellow-900/20 text-yellow-800/60 hover:border-yellow-700/40 hover:text-yellow-700/80"
                    }`}
                >
                  <span className="text-base">{config.icon}</span>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: "9px" }}>{config.label}</span>
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "10px" }} className="opacity-70">
                    +{config.xp}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label
              className="block text-yellow-500/70 mb-2"
              style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.08em" }}
            >
              CATEGORIA
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {(Object.entries(CATEGORY_CONFIG) as [QuestCategory, typeof CATEGORY_CONFIG[QuestCategory]][]).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all duration-200
                    ${category === key
                      ? "border-yellow-600/50 bg-yellow-900/30 text-yellow-300"
                      : "border-yellow-900/20 text-yellow-800/60 hover:border-yellow-700/40"
                    }`}
                  style={{ fontFamily: "'EB Garamond', serif", fontSize: "12px" }}
                >
                  <span>{config.icon}</span>
                  <span>{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-yellow-900/30 text-yellow-700/60 hover:text-yellow-600 hover:border-yellow-800/50 transition-colors"
              style={{ fontFamily: "'Cinzel', serif", fontSize: "12px" }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="flex-1 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "12px",
                background: title.trim() ? "linear-gradient(135deg, #92400e, #d97706)" : undefined,
                backgroundColor: !title.trim() ? "#1c1408" : undefined,
                color: "#fef3c7",
                border: "1px solid rgba(251,191,36,0.4)",
                boxShadow: title.trim() ? "0 0 16px rgba(217,119,6,0.3)" : undefined,
              }}
            >
              ⚔ Aceitar Missão
            </button>
          </div>
        </div>

        <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-900/50 to-transparent" />
      </div>
    </div>
  );
}
