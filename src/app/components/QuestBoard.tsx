import { useState, useMemo } from "react";
import { Quest, QuestCategory, Difficulty, CATEGORY_CONFIG, DIFFICULTY_CONFIG } from "./types";
import { QuestCard } from "./QuestCard";

interface QuestBoardProps {
  quests: Quest[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

type FilterCategory = QuestCategory | "all";
type FilterStatus = "active" | "completed" | "all";

export function QuestBoard({ quests, onComplete, onDelete, onAddClick }: QuestBoardProps) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("active");
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return quests.filter((q) => {
      if (filterCategory !== "all" && q.category !== filterCategory) return false;
      if (filterStatus === "active" && q.completed) return false;
      if (filterStatus === "completed" && !q.completed) return false;
      if (filterDifficulty !== "all" && q.difficulty !== filterDifficulty) return false;
      if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [quests, filterCategory, filterStatus, filterDifficulty, search]);

  const activeCount = quests.filter((q) => !q.completed).length;
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1
              className="text-yellow-300"
              style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "22px", lineHeight: 1.3 }}
            >
              Quadro de Missões
            </h1>
            <p
              className="text-yellow-700/60 mt-0.5"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px", fontStyle: "italic" }}
            >
              {activeCount} missão{activeCount !== 1 ? "s" : ""} ativa{activeCount !== 1 ? "s" : ""} · {completedCount} concluída{completedCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Add Quest Button */}
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-yellow-600/50 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "12px",
              color: "#fef3c7",
              background: "linear-gradient(135deg, #78350f, #b45309)",
              boxShadow: "0 0 16px rgba(217,119,6,0.25)",
            }}
          >
            <span className="text-base">⚔</span>
            <span>Nova Missão</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-700/50 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar missão..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/30 border border-yellow-900/30 text-yellow-100/80 placeholder-yellow-900/50 outline-none focus:border-yellow-700/50 transition-colors"
            style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px" }}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {/* Status */}
          {(["active", "completed", "all"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-full border text-xs transition-all duration-200 ${
                filterStatus === s
                  ? "border-yellow-600/50 bg-yellow-900/30 text-yellow-300"
                  : "border-yellow-900/20 text-yellow-800/50 hover:border-yellow-800/40 hover:text-yellow-700/70"
              }`}
              style={{ fontFamily: "'Cinzel', serif", fontSize: "10px" }}
            >
              {s === "active" ? "Ativas" : s === "completed" ? "Concluídas" : "Todas"}
            </button>
          ))}

          <span className="text-yellow-900/30">|</span>

          {/* Categories */}
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1 rounded-full border text-xs transition-all duration-200 ${
              filterCategory === "all"
                ? "border-yellow-600/50 bg-yellow-900/30 text-yellow-300"
                : "border-yellow-900/20 text-yellow-800/50 hover:border-yellow-800/40"
            }`}
            style={{ fontFamily: "'EB Garamond', serif", fontSize: "11px" }}
          >
            ⊞ Todas
          </button>
          {(Object.entries(CATEGORY_CONFIG) as [QuestCategory, typeof CATEGORY_CONFIG[QuestCategory]][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilterCategory(key)}
              className={`px-3 py-1 rounded-full border text-xs transition-all duration-200 ${
                filterCategory === key
                  ? `border-yellow-600/50 bg-yellow-900/30 ${config.color}`
                  : "border-yellow-900/20 text-yellow-800/50 hover:border-yellow-800/40"
              }`}
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "11px" }}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-yellow-900/0 via-yellow-700/30 to-yellow-900/0 mb-5" />

      {/* Quest list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4 opacity-30">📜</div>
            <p
              className="text-yellow-700/50"
              style={{ fontFamily: "'Cinzel', serif", fontSize: "13px" }}
            >
              {filterStatus === "completed" ? "Nenhuma missão concluída ainda." : "Nenhuma missão encontrada."}
            </p>
            {filterStatus === "active" && quests.length === 0 && (
              <p
                className="text-yellow-800/40 mt-2"
                style={{ fontFamily: "'EB Garamond', serif", fontSize: "13px", fontStyle: "italic" }}
              >
                Aceite sua primeira missão, aventureiro!
              </p>
            )}
          </div>
        ) : (
          filtered.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
