interface ElectronAPI {
  closeQuickAdd: () => Promise<void>;
  showNotification: (title: string, body: string) => Promise<void>;
  onPowerResume: (callback: () => void) => () => void;
  onRefreshQuests: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
