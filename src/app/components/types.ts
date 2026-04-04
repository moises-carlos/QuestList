import { ApiTask, ApiUser } from "../api";

export type Difficulty = "trivial" | "easy" | "medium" | "hard" | "legendary";
export type QuestCategory = "daily" | "main" | "side" | "guild" | "personal";

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: QuestCategory;
  xpReward: number;
  completed: boolean;
  completedAt?: number;
  createdAt: number;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  levelName: string;
  currentXP: number;
  totalXPEarned: number;
  questsCompleted: number;
  streak: number;
  hp: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  label: string;
  xp: number;
  color: string;
  border: string;
  glow: string;
  bg: string;
  textColor: string;
  icon: string;
}> = {
  trivial: {
    label: "Trivial",
    xp: 10,
    color: "#9ca3af",
    border: "border-gray-500/40",
    glow: "",
    bg: "bg-gray-500/10",
    textColor: "text-gray-400",
    icon: "○",
  },
  easy: {
    label: "Fácil",
    xp: 25,
    color: "#4ade80",
    border: "border-green-500/40",
    glow: "shadow-green-500/20",
    bg: "bg-green-500/10",
    textColor: "text-green-400",
    icon: "◆",
  },
  medium: {
    label: "Médio",
    xp: 50,
    color: "#60a5fa",
    border: "border-blue-500/40",
    glow: "shadow-blue-500/20",
    bg: "bg-blue-500/10",
    textColor: "text-blue-400",
    icon: "◈",
  },
  hard: {
    label: "Difícil",
    xp: 100,
    color: "#c084fc",
    border: "border-purple-500/40",
    glow: "shadow-purple-500/30",
    bg: "bg-purple-500/10",
    textColor: "text-purple-400",
    icon: "✦",
  },
  legendary: {
    label: "Lendário",
    xp: 250,
    color: "#fbbf24",
    border: "border-yellow-500/50",
    glow: "shadow-yellow-500/30",
    bg: "bg-yellow-500/10",
    textColor: "text-yellow-400",
    icon: "★",
  },
};

export const CATEGORY_CONFIG: Record<QuestCategory, {
  label: string;
  icon: string;
  color: string;
}> = {
  daily: { label: "Diária", icon: "☀", color: "text-orange-400" },
  main: { label: "Principal", icon: "⚔", color: "text-red-400" },
  side: { label: "Secundária", icon: "◉", color: "text-cyan-400" },
  guild: { label: "Guilda", icon: "⚜", color: "text-yellow-400" },
  personal: { label: "Pessoal", icon: "♦", color: "text-pink-400" },
};

export function xpToNextLevel(level: number): number {
  return level * 100 + 50;
}

export function totalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpToNextLevel(i);
  }
  return total;
}

// ----- API MAPPERS -----

/** Derives visual difficulty based on XP */
export function getDifficultyFromXP(xp: number): Difficulty {
  if (xp < 25) return "trivial";
  if (xp < 50) return "easy";
  if (xp < 100) return "medium";
  if (xp < 250) return "hard";
  return "legendary";
}

/** Parses ApiTask into frontend Quest */
export function mapApiTaskToQuest(task: ApiTask): Quest {
  return {
    id: task.id,
    title: task.titulo,
    description: task.descricao,
    xpReward: task.xpRecompensa,
    completed: task.status === "CONCLUIDA",
    createdAt: task.dataLimite ? new Date(task.dataLimite).getTime() : Date.now(),
    difficulty: getDifficultyFromXP(task.xpRecompensa),
    category: "main", // Default category purely for visual sake
  };
}

/** 
 * Map API User to Character.
 * We recalculate the numeric "level" from total XP because the API only provides a string enum ("Recruta", etc.).
 */
export function mapApiUserToCharacter(user: ApiUser): Character {
  let currentXP = user.xp;
  let level = 1;
  
  // Calculate numeric level and current XP for the tier
  while (currentXP >= xpToNextLevel(level)) {
    currentXP -= xpToNextLevel(level);
    level += 1;
  }

  return {
    id: user.id || "",
    name: user.nome,
    class: "warrior", // Mock class since API doesn't support it
    level: level,
    levelName: user.nivel?.nome || "Recruta",
    currentXP: currentXP,
    totalXPEarned: user.xp,
    questsCompleted: 0, // Mock, can be derived by completed quests list if needed
    streak: user.sequenciaAtual || 0,
    hp: user.hp || 100,
  };
}

export const CLASS_OPTIONS = [
  { value: "warrior", label: "Guerreiro", icon: "⚔️" },
  { value: "mage", label: "Mago", icon: "🔮" },
  { value: "rogue", label: "Ladino", icon: "🗡️" },
  { value: "paladin", label: "Paladino", icon: "🛡️" },
  { value: "ranger", label: "Arqueiro", icon: "🏹" },
  { value: "bard", label: "Bardo", icon: "🎵" },
];
