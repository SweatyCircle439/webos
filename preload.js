const { ipcRenderer } = require('electron');
const path = require('path');
window.__dirname = path.join(__dirname, 'os');
window.requestBrowser = (url, x, y, width, height) => 
    ipcRenderer.invoke('requestBrowser', url, x, y, width, height);
window.closeBrowser = (browserid) => 
    ipcRenderer.invoke('closeBrowser', browserid);
window.minimizeBrowser = (browserid) => 
    ipcRenderer.invoke('minimizeBrowser', browserid);
window.maximizeBrowser = (browserid, height) => 
    ipcRenderer.invoke('maximizeBrowser', browserid, height);