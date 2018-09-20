const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const socket = require('socket.io').listen(4000).sockets;
const {app, BrowserWindow, Menu} = electron;
// When the app is ready

app.on('ready', () => {
    win = new BrowserWindow({width: 800, height: 600});
    win.loadURL(url.format({
        pathname: path.join(__dirname+'/src/index.html'),
        protocal: 'file',
        slashes: true
        
    }));
    const mainMenu = Menu.buildFromTemplate(mainMenutemplate);
    Menu.setApplicationMenu(mainMenu);
});



const mainMenutemplate = [{
    label: 'File',
    submenu: [
        {
            label:'Import',
            click: function () {
                smallwin = new BrowserWindow({width: 350, height: 300});
                smallwin.loadURL(url.format({
                    pathname: path.join(__dirname+'/src/pages/import.html'),
                    protocol: 'file',
                    slashes: true
                }));
                smallwin.setMenu(null);
            }
        },
        {
            label: 'Exit',
            click: function () {
                app.quit();
            }
        }
    ]
}];




// Manage socket io stuff
socket.on('connection', function(socket) {
    socket.on('skinInput', (file) => {
        console.log(file.name);
        console.log(file.file);
        fs.writeFile('./src/steve.png', file.file, 'binary', function(err) {
            if(err) throw err;
            socket.emit('skinInputSuccess',{
                success: true
            });
        });
    });
});