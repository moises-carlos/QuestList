import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  closeQuickAdd: () => ipcRenderer.invoke('close-quick-add'),
  showNotification: (title: string, body: string) => ipcRenderer.invoke('show-notification', title, body),
  onPowerResume: (callback: () => void) => {
    const fn = () => callback();
    ipcRenderer.on('power-resume', fn);
    return () => ipcRenderer.removeListener('power-resume', fn);
  },
  onRefreshQuests: (callback: () => void) => {
    const fn = () => callback();
    ipcRenderer.on('refresh-quests', fn);
    return () => ipcRenderer.removeListener('refresh-quests', fn);
  }
});
