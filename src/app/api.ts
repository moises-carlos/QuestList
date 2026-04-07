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
    if (!navigator.onLine) {
      const cached = localStorage.getItem(`questlist_user_${id}`);
      if (cached) return JSON.parse(cached);
      throw new Error("Offline e usuário não encontrado em cache");
    }
    const res = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error(`Erro ao buscar herói: ${res.status}`);
    const data = await res.json();
    localStorage.setItem(`questlist_user_${id}`, JSON.stringify(data));
    return data;
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

    if (!navigator.onLine) {
      const task: ApiTask = {
        id: 'local_' + Date.now(),
        titulo,
        descricao,
        xpRecompensa,
        status: 'ABERTA',
        dataLimite: new Date(Date.now() + 86400000 * 5).toISOString(),
        conclusao: null,
        userId
      };
      const cached = JSON.parse(localStorage.getItem(`questlist_tasks_${userId}`) || '[]');
      cached.push(task);
      localStorage.setItem(`questlist_tasks_${userId}`, JSON.stringify(cached));
      return task;
    }

    const res = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Erro ao criar missão: ${res.status}`);
    return res.json();
  },

  getActiveTasks: async (userId: string): Promise<ApiTask[]> => {
    if (!navigator.onLine) {
      const cached = localStorage.getItem(`questlist_tasks_${userId}`);
      return cached ? JSON.parse(cached) : [];
    }
    const res = await fetch(`${API_BASE_URL}/tasks/user/${userId}`);
    if (!res.ok) throw new Error(`Erro ao listar missões: ${res.status}`);
    const data = await res.json();
    localStorage.setItem(`questlist_tasks_${userId}`, JSON.stringify(data));
    return data;
  },

  completeTask: async (taskId: string, userId: string): Promise<string> => {
    if (!navigator.onLine) {
      const cachedTasks = JSON.parse(localStorage.getItem(`questlist_tasks_${userId}`) || '[]');
      const updated = cachedTasks.filter((t: ApiTask) => t.id !== taskId);
      localStorage.setItem(`questlist_tasks_${userId}`, JSON.stringify(updated));
      return "Tarefa completada localmente!";
    }
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete?userId=${userId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Erro ao concluir missão: ${res.status}`);
    // The API returns a text-plain response "Tarefa completada com sucesso!"
    return res.text();
  }
};
