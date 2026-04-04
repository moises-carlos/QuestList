import { useState } from "react";
import { Quest, DIFFICULTY_CONFIG, CATEGORY_CONFIG } from "./types";

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuestCard({ quest, onComplete, onDelete }: QuestCardProps) {
  const [confirming, setConfirming] = useState(false);
  const diff = DIFFICULTY_CONFIG[quest.difficulty];
  const cat = CATEGORY_CONFIG[quest.category];

  return (
    <div
      className={`relative group rounded-xl border transition-all duration-300 overflow-hidden
        ${quest.completed
          ? "border-gray-700/30 bg-black/20 opacity-50"
          : `${diff.border} bg-gradient-to-r from-[#12100a] to-[#0d0b06] shadow-lg ${diff.glow} hover:shadow-xl hover:scale-[1.01]`
        }`}
    >
      {/* Left accent bar */}
      {!quest.completed && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl"
          style={{ backgroundColor: diff.color, boxShadow: `0 0 8px ${diff.color}60` }}
        />
      )}

      <div className="flex items-start gap-3 p-4 pl-5">
        {/* Complete button */}
        <button
          onClick={() => onComplete(quest.id)}
          disabled={quest.completed}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5
            ${quest.completed
              ? "border-gray-600 bg-gray-700/30 cursor-default"
              : "border-yellow-600/50 hover:border-yellow-400 hover:bg-yellow-400/10 cursor-pointer"
            }`}
        >
          {quest.completed && (
            <span className="text-yellow-600 text-xs">✓</span>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              className={`${quest.completed ? "line-through text-gray-500" : "text-yellow-100"}`}
              style={{ fontFamily: "'Cinzel', serif", fontSize: "13px" }}
            >
              {quest.title}
            </h4>
            {/* XP badge */}
            {!quest.completed && (
              <span
                className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs border ${diff.bg} ${diff.border} ${diff.textColor}`}
                style={{ fontFamily: "'Cinzel', serif", fontSize: "10px", whiteSpace: "nowrap" }}
              >
                +{diff.xp} XP
              </span>
            )}
          </div>

          {quest.description && (
            <p
              className={`mb-2 ${quest.completed ? "text-gray-600" : "text-yellow-200/50"}`}
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "13px", fontStyle: "italic" }}
            >
              {quest.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category */}
            <span
              className={`text-xs ${cat.color} opacity-70`}
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "12px" }}
            >
              {cat.icon} {cat.label}
            </span>
            <span className="text-yellow-900/50 text-xs">·</span>
            {/* Difficulty */}
            <span
              className={`text-xs ${diff.textColor} opacity-80`}
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "12px" }}
            >
              {diff.icon} {diff.label}
            </span>
          </div>
        </div>

        {/* Delete button */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {confirming ? (
            <div className="flex gap-1">
              <button
                onClick={() => onDelete(quest.id)}
                className="px-2 py-1 rounded text-red-400 hover:bg-red-900/30 text-xs transition-colors"
                style={{ fontFamily: "'Cinzel', serif", fontSize: "10px" }}
              >
                Sim
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="px-2 py-1 rounded text-gray-400 hover:bg-gray-800/30 text-xs transition-colors"
                style={{ fontFamily: "'Cinzel', serif", fontSize: "10px" }}
              >
                Não
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="p-1 rounded text-red-800 hover:text-red-500 hover:bg-red-900/20 transition-colors"
              title="Abandonar missão"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Legendary shimmer effect */}
      {quest.difficulty === "legendary" && !quest.completed && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(251,191,36,0.03) 50%, transparent 60%)",
            animation: "shimmer 3s infinite",
          }}
        />
      )}
    </div>
  );
}
