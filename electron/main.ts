import { app, BrowserWindow, ipcMain, globalShortcut, Menu, Tray, Notification, powerMonitor, nativeImage } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import windowStateKeeper from 'electron-window-state';

let mainWindow: BrowserWindow | null = null;
let quickAddWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;

function createMainWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 768
  });

  const iconPath = path.join(__dirname, '../public/vite.svg');
  const appIcon = fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : nativeImage.createEmpty();

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: appIcon
  });

  mainWindowState.manage(mainWindow);

  const url = isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../dist/index.html')}`;
  mainWindow.loadURL(url);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createQuickAddWindow() {
  if (quickAddWindow) {
    quickAddWindow.focus();
    return;
  }

  quickAddWindow = new BrowserWindow({
    width: 380,
    height: 250,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const url = isDev ? 'http://localhost:5173/?quickadd=true' : `file://${path.join(__dirname, '../dist/index.html')}?quickadd=true`;
  quickAddWindow.loadURL(url);

  quickAddWindow.on('closed', () => {
    quickAddWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();

  // Application Menu
  const template = [
    {
      label: 'QuestList',
      submenu: [
        { role: 'about', label: 'Sobre' },
        { type: 'separator' },
        { role: 'quit', label: 'Sair' }
      ]
    },
    {
      label: 'Tarefas',
      submenu: [
        {
          label: 'Adição Rápida',
          accelerator: 'CmdOrCtrl+Shift+Q',
          click: () => {
            createQuickAddWindow();
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template as any));

  // Tray Integration
  const iconPath = path.join(__dirname, '../public/vite.svg');
  const trayIcon = fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : nativeImage.createEmpty();
  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir QuestList', click: () => {
        if (mainWindow) {
            mainWindow.show();
        } else {
            createMainWindow();
        }
    } },
    { label: 'Ideia Súbita (Adição Rápida)', accelerator: 'CmdOrCtrl+Shift+Q', click: () => {
        createQuickAddWindow();
    } },
    { type: 'separator' },
    { label: 'Sair', click: () => app.quit() }
  ]);
  tray.setToolTip('QuestList');
  tray.setContextMenu(contextMenu);

  // Global Shortcuts
  globalShortcut.register('CmdOrCtrl+Shift+Q', () => {
    createQuickAddWindow();
  });

  // Hardware / System Events (Power Monitoring)
  powerMonitor.on('suspend', () => {
    console.log('Sistema entrou em suspensão.');
  });
  powerMonitor.on('resume', () => {
    console.log('Sistema retornou da suspensão.');
    if (mainWindow) {
      mainWindow.webContents.send('power-resume');
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Mantém a aplicação rodando em segundo plano (na bandeja)
  // O aplicativo só será completamente fechado se o usuário
  // escolher "Sair" diretamente no menu do Tray.
});

app.on('will-quit', () => {
  // Always unregister shortcuts when quitting
  globalShortcut.unregisterAll();
});

// IPC Communications
ipcMain.handle('close-quick-add', () => {
  if (quickAddWindow) {
    quickAddWindow.close();
  }
  if (mainWindow) {
    mainWindow.webContents.send('refresh-quests');
  }
});

ipcMain.handle('show-notification', (event, title, body) => {
  new Notification({ title, body }).show();
});
