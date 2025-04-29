const { app, BrowserWindow, WebContentsView, ipcMain } = require('electron');
const path = require('path');
/** @type {BrowserWindow} */
let win;
const browsers = [];

ipcMain.handle('requestBrowser', async (event, url, x, y, width, height) => {
    const view1 = new WebContentsView(
        {
            offscreen: true,
            webPreferences: {
                webviewTag: true,
                sandbox: false,
                contextIsolation: false,
                preload: path.join(__dirname, 'preload.js'),
                backgroundColor: '#00000000',
                sandbox: false,
            }
        }
    );
    win.contentView.addChildView(view1);
    view1.webContents.loadURL(url);
    view1.setBounds({ x: x, y: y, width: width, height: height });
    browsers.push(view1);
    return browsers.length - 1;
});

ipcMain.handle('closeBrowser', async (event, index) => {
    browsers[index]
        .webContents.destroy();
    browsers[index] = "clsd";
});

ipcMain.handle('minimizeBrowser', async (event, index) => {
    const bounds = browsers[index].getBounds();
    browsers[index]
        .setBounds({ x: bounds.x, y: bounds.y, width: bounds.width, height: 0});
    return bounds.height;
});
ipcMain.handle('maximizeBrowser', async (event, index, height) => {
    const bounds = browsers[index].getBounds();
    browsers[index]
        .setBounds({ x: bounds.x, y: bounds.y, width: bounds.width, height: height});
    return index;
});
async function open() {
    const createWindow = () => {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            fullscreen: true,
            webPreferences: {
                webviewTag: true,
                sandbox: false,
                contextIsolation: false,
                transparent: true,
                preload: path.join(__dirname, 'preload.js'),
                backgroundColor: '#00000000'
            }
        });
      
        win.loadFile('os.html');
        win.setMenuBarVisibility(false);
        win.maximize();
        win.show();
        win.setAlwaysOnTop(false, 'normal');
        win.on("close", e => {
            e.preventDefault();
        });
    }
    app.whenReady().then(() => {
        createWindow()
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        });
        setInterval(() => {try{win.setFullScreen(true); win.setFullScreenable(true)}catch {}}, 1000);
    });
}

open();
require('./host');