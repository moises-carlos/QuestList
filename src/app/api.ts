const API_BASE_URL = 'https://api-questlist.onrender.com/api';

export interface ApiUser {
  id: string;
  nome: string;
  xp: number;
  nivel: {
    nome: string;
  };
  hp: number;
  sequenciaAtual: number;
  multiplicadorXp: number;
  penalidadeAtiva: boolean;
}

export interface ApiTask {
  id: string;
  titulo: string;
  descricao: string;
  xpRecompensa: number;
  status: 'ABERTA' | 'CONCLUIDA';
  dataLimite: string;
  conclusao: string | null;
  userId: string;
}

export const api = {
  // Users
  createUser: async (nome: string): Promise<ApiUser> => {
    const res = await fetch(`${API_BASE_URL}/users?nome=${encodeURIComponent(nome)}`, {
      method: 'POST'
    });
    if (!res.ok && res.status !== 409) {
      throw new Error(`Erro ao criar herói: ${res.status}`);
    }
    return res.json();
  },

  getUser: async (id: string): Promise<ApiUser> => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error(`Erro ao buscar herói: ${res.status}`);
    return res.json();
  },

  listUsers: async (): Promise<ApiUser[]> => {
    const res = await fetch(`${API_BASE_URL}/users`);
    if (!res.ok) throw new Error(`Erro ao listar heróis: ${res.status}`);
    return res.json();
  },

  // Tasks
  createTask: async (
    userId: string, 
    titulo: string, 
    descricao: string, 
    xpRecompensa: number, 
    diasParaExpirar: number
  ): Promise<ApiTask> => {
    const params = new URLSearchParams({
      userId,
      titulo,
      descricao: descricao || '...',
      xpRecompensa: String(Math.floor(xpRecompensa)),
      diasParaExpirar: String(Math.floor(diasParaExpirar))
    });

    const res = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Erro ao criar missão: ${res.status}`);
    return res.json();
  },

  getActiveTasks: async (userId: string): Promise<ApiTask[]> => {
    const res = await fetch(`${API_BASE_URL}/tasks/user/${userId}`);
    if (!res.ok) throw new Error(`Erro ao listar missões: ${res.status}`);
    return res.json();
  },

  completeTask: async (taskId: string, userId: string): Promise<string> => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete?userId=${userId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Erro ao concluir missão: ${res.status}`);
    // The API returns a text-plain response "Tarefa completada com sucesso!"
    return res.text();
  }
};
