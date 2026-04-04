import { useState, useCallback, useEffect } from "react";
import { Quest, Character, Difficulty, QuestCategory, DIFFICULTY_CONFIG, CLASS_OPTIONS } from "./components/types";
import { CharacterPanel } from "./components/CharacterPanel";
import { QuestBoard } from "./components/QuestBoard";
import { AddQuestModal } from "./components/AddQuestModal";
import { LevelUpModal } from "./components/LevelUpModal";
import { api, ApiUser } from "./api";
import { mapApiTaskToQuest, mapApiUserToCharacter } from "./components/types";

function HeroPrompt({ onSubmit }: { onSubmit: (name: string, heroClass: string) => void }) {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("warrior");
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-[4px]">
      <div 
        className="relative w-full max-w-md p-8 rounded-2xl border border-yellow-600/40 shadow-2xl overflow-hidden" 
        style={{ background: "linear-gradient(160deg, #1c1408, #0f0b03)" }}
      >
        <div className="absolute inset-0 bg-yellow-900/10 pointer-events-none" />
        <div className="relative z-10 text-center mb-6">
          <div className="text-4xl mb-4 select-none" style={{ filter: "drop-shadow(0 0 10px rgba(251,191,36,0.3))" }}>🛡️</div>
          <h2 className="text-yellow-400 text-3xl" style={{ fontFamily: "'Cinzel Decorative', serif" }}>Guilda dos Heróis</h2>
          <p className="text-yellow-700/80 mt-2" style={{ fontFamily: "'EB Garamond', serif", fontSize: "16px", fontStyle: "italic" }}>
            Identifique-se para visualizar suas missões ativas
          </p>
        </div>

        <div className="relative z-10 mb-6">
          <label className="block text-yellow-500/70 mb-2" style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.08em" }}>
            NOME DO HERÓI
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Link..."
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-yellow-800/30 text-yellow-100 placeholder-yellow-900/50 outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition-all text-center"
            style={{ fontFamily: "'EB Garamond', serif", fontSize: "18px" }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim() && !loading) {
                setLoading(true);
                onSubmit(name.trim(), selectedClass);
              }
            }}
          />
        </div>

        <div className="relative z-10 mb-8">
           <label className="block text-center text-yellow-500/70 mb-3" style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.08em" }}>
            CLASSE
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CLASS_OPTIONS.map((cls) => (
               <button
                  key={cls.value}
                  onClick={() => setSelectedClass(cls.value)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg border transition-all duration-200 ${selectedClass === cls.value ? "bg-yellow-900/40 border-yellow-500/60 shadow-[0_0_15px_rgba(251,191,36,0.2)] text-yellow-300" : "bg-black/20 border-yellow-900/40 text-yellow-800/60 hover:border-yellow-700/60 hover:text-yellow-600/80"}`}
               >
                  <span className="text-xl">{cls.icon}</span>
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "13px" }}>{cls.label}</span>
               </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            if (name.trim() && !loading) {
              setLoading(true);
              onSubmit(name.trim(), selectedClass);
            }
          }}
          disabled={!name.trim() || loading}
          className="relative z-10 w-full py-3.5 rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
          style={{
            fontFamily: "'Cinzel', serif",
            background: name.trim() ? "linear-gradient(135deg, #92400e, #d97706)" : "#1c1408",
            color: "#fef3c7",
            border: "1px solid rgba(251,191,36,0.4)",
            boxShadow: name.trim() ? "0 0 20px rgba(217,119,6,0.3)" : undefined
          }}
        >
          {loading ? "Abrindo Portões..." : "Adentrar na Guilda"}
        </button>
      </div>
    </div>
  );
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function App() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState<number | null>(null);
  const [xpPopup, setXpPopup] = useState<{ xp: number; id: string } | null>(null);
  
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(() => localStorage.getItem('questlist_userId'));
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const apiUser = await api.getUser(userId);
      const char = mapApiUserToCharacter(apiUser);
      // Retrieve UI-only persistent data
      char.class = localStorage.getItem(`questlist_${userId}_class`) || "warrior";
      char.questsCompleted = parseInt(localStorage.getItem(`questlist_${userId}_questsCompleted`) || "0", 10);
      setCharacter(char);
      
      const apiTasks = await api.getActiveTasks(userId);
      setQuests(apiTasks.map(mapApiTaskToQuest));
    } catch (err) {
      console.error(err);
      localStorage.removeItem('questlist_userId');
      setLoggedInUserId(null); // User might have been deleted from DB
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (loggedInUserId) {
      fetchUserData(loggedInUserId);
    } else {
      setIsInitializing(false);
    }
  }, [loggedInUserId, fetchUserData]);

  const handleHeroCreation = async (name: string, heroClass: string) => {
    try {
      // Create user avoiding conflicts by hitting POST, or catching 409
      let user: ApiUser;
      try {
        user = await api.createUser(name);
      } catch (err) {
        // If conflict or error, lets try to find him from the list
        const allUsers = await api.listUsers();
        let existingUser = allUsers.find(u => u.nome.toLowerCase() === name.toLowerCase());
        if (existingUser) {
          user = existingUser;
        } else {
          throw err;
        }
      }
      localStorage.setItem(`questlist_${user.id}_class`, heroClass);
      localStorage.setItem('questlist_userId', user.id);
      setLoggedInUserId(user.id);
    } catch (err) {
      console.error("Falha ao criar/entrar", err);
      // Fallback reset
      setIsInitializing(false);
    }
  };

  const handleCompleteQuest = useCallback(async (id: string) => {
    if (!loggedInUserId || !character) return;
    
    const quest = quests.find((q) => q.id === id);
    if (!quest || quest.completed) return;

    const oldLevel = character.level;
    const oldXpTotal = character.totalXPEarned;

    try {
      // Optimistic UI updates
      const xpGain = quest.xpReward;
      setQuests((prev) =>
        prev.map((q) => q.id === id ? { ...q, completed: true, completedAt: Date.now() } : q)
      );

      // Show XP popup
      setXpPopup({ xp: xpGain, id: generateId() });
      setTimeout(() => setXpPopup(null), 2000);

      // API call to complete
      await api.completeTask(id, loggedInUserId);
      
      // Update local questsCompleted
      const newQuestsCount = (character.questsCompleted || 0) + 1;
      localStorage.setItem(`questlist_${loggedInUserId}_questsCompleted`, newQuestsCount.toString());

      // Refresh User Stats from API
      const apiUser = await api.getUser(loggedInUserId);
      const updatedCharacter = mapApiUserToCharacter(apiUser);
      updatedCharacter.class = localStorage.getItem(`questlist_${loggedInUserId}_class`) || "warrior";
      updatedCharacter.questsCompleted = newQuestsCount;
      setCharacter(updatedCharacter);

      if (updatedCharacter.level > oldLevel) {
        setTimeout(() => setLevelUpData(updatedCharacter.level), 300);
      }
    } catch (err) {
      console.error("Falha ao completar missao", err);
      // Could revert optimistic updates here...
    }
  }, [quests, loggedInUserId, character]);

  const handleDeleteQuest = useCallback((id: string) => {
    // API didn't define a delete endpoint yet, so we just remove locally to hide it.
    setQuests((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const handleAddQuest = useCallback(async (data: {
    title: string;
    description: string;
    difficulty: Difficulty;
    category: QuestCategory;
  }) => {
    if (!loggedInUserId) return;
    
    try {
      const xpReward = DIFFICULTY_CONFIG[data.difficulty].xp;
      // Default to 5 days if expiration is required
      const d = 5; 
      
      const apiTask = await api.createTask(
        loggedInUserId,
        data.title,
        data.description,
        xpReward,
        d
      );

      // Append new quest
      const newQuest = mapApiTaskToQuest(apiTask);
      setQuests((prev) => [newQuest, ...prev]);
    } catch (err) {
      console.error("Erro ao criar missão", err);
    }
  }, [loggedInUserId]);

  if (isInitializing) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <p className="text-yellow-600/80" style={{ fontFamily: "'Cinzel', serif" }}>
          Despertando Herói...
        </p>
      </div>
    );
  }

  if (!loggedInUserId || !character) {
    return <HeroPrompt onSubmit={handleHeroCreation} />;
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "linear-gradient(160deg, #080604 0%, #0c0a05 40%, #090709 100%)",
        fontFamily: "'EB Garamond', serif",
      }}
    >
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #fbbf24, transparent)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-3"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)", filter: "blur(60px)" }}
        />
      </div>

      {/* Top decorative border */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent z-10" />

      {/* Main layout */}
      <div className="relative z-[1] flex flex-col lg:flex-row max-w-6xl mx-auto min-h-screen">

        {/* Left sidebar - Character Panel */}
        <div className="w-full lg:w-72 lg:min-h-screen lg:border-r border-yellow-900/20 p-5 lg:p-6 flex-shrink-0">
          {/* Logo */}
          <div className="text-center mb-6">
            <h1
              className="text-yellow-400"
              style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "18px", lineHeight: 1.2 }}
            >
              ⚔ QuestList
            </h1>
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-700/40 to-transparent mt-2" />
          </div>

          <CharacterPanel
            character={character}
            onUpdateName={(name) => setCharacter((c) => c ? { ...c, name } : c)}
            onUpdateClass={(cls) => {
              if (loggedInUserId) localStorage.setItem(`questlist_${loggedInUserId}_class`, cls);
              setCharacter((c) => c ? { ...c, class: cls } : c);
            }}
          />

          {/* Logout Helper */}
          <div className="mt-8 flex flex-col items-center gap-2">
             <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-900/30 to-transparent" />
             <button 
                onClick={() => { localStorage.removeItem('questlist_userId'); setLoggedInUserId(null); }}
                className="w-full mt-4 flex items-center gap-2 justify-center py-2.5 rounded-lg border border-red-900/30 bg-red-950/20 text-red-400/80 hover:bg-red-900/30 hover:text-red-300 hover:border-red-800/50 transition-all duration-200"
                style={{ fontFamily: "'Cinzel', serif", fontSize: "12px", letterSpacing: "0.05em" }}
             >
                <span className="text-sm">🚪</span>
                Abandonar Missão (Sair)
             </button>
             <p
               className="text-yellow-900/50 text-center mt-6"
               style={{ fontFamily: "'EB Garamond', serif", fontSize: "11px", fontStyle: "italic", lineHeight: 1.6 }}
             >
               "A glória aguarda aqueles que ousam tentar."
             </p>
          </div>
        </div>

        {/* Right main content - Quest Board */}
        <div className="flex-1 p-5 lg:p-8 overflow-hidden">
          <QuestBoard
            quests={quests}
            onComplete={handleCompleteQuest}
            onDelete={handleDeleteQuest}
            onAddClick={() => setShowAddModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddQuestModal
          onAdd={handleAddQuest}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {levelUpData !== null && (
        <LevelUpModal
          level={levelUpData}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {/* XP Popup */}
      {xpPopup && (
        <div
          key={xpPopup.id}
          className="fixed bottom-8 right-8 z-[60] pointer-events-none"
          style={{
            animation: "xpFloat 2s ease-out forwards",
          }}
        >
          <div
            className="px-4 py-2 rounded-full border border-yellow-500/60"
            style={{
              background: "linear-gradient(135deg, #1c1408, #0f0b03)",
              boxShadow: "0 0 20px rgba(251,191,36,0.4)",
              fontFamily: "'Cinzel', serif",
              fontSize: "14px",
              color: "#fbbf24",
            }}
          >
            ✨ +{xpPopup.xp} XP
          </div>
        </div>
      )}

      {/* Global styles */}
      <style>{`
        @keyframes xpFloat {
          0% { opacity: 0; transform: translateY(10px) scale(0.8); }
          20% { opacity: 1; transform: translateY(0) scale(1); }
          70% { opacity: 1; transform: translateY(-20px) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(0.9); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(120, 53, 15, 0.4);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(180, 83, 9, 0.5);
        }
      `}</style>
    </div>
  );
}
