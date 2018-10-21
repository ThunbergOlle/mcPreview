const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const socket = require('socket.io').listen(4000).sockets;
const { app, BrowserWindow, Menu, shell } = electron;
const os = require('os');
const desktopCapturer = electron.desktopCapturer;
const ipc = electron.ipcMain;
// When the app is ready

app.on('ready', () => {
    win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL(url.format({
        pathname: path.join(__dirname + '/src/index.html'),
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
            label: 'Import',
            submenu: [
                {
                    label: 'Skin',
                    click: function () {
                        smallwin = new BrowserWindow({ width: 350, height: 300 });
                        smallwin.loadURL(url.format({
                            pathname: path.join(__dirname + '/src/pages/import.html'),
                            protocol: 'file',
                            slashes: true
                        }));
                        smallwin.setMenu(null);
                    }
                },
                {
                    label: 'Block',
                    click: function () {
                        smallwin = new BrowserWindow({ width: 350, height: 300 });
                        smallwin.loadURL(url.format({
                            pathname: path.join(__dirname + '/src/pages/importblock.html'),
                            protocol: 'file',
                            slashes: true
                        }));
                        smallwin.setMenu(null);
                    }
                }
            ]

        },
        {
            label: 'Export',
            submenu: [
                {
                    label: 'As .obj'

                },
                {
                    label: 'As png'
                }
            ]
        },
        {
            label: 'Exit',
            click: function () {
                app.quit();
            }
        }
    ]
},
{
    label: 'Settings',
    submenu: [
        {
            label: 'Background'
        }
    ]
},
{
    label: 'Window',
    submenu: [
        {
            label: 'Reload',
            click: function () {
                win.reload();
            }
        },
        {
            label: 'Debugging',
            click: function () {
                win.webContents.openDevTools();
            }
        },
        {
            label: 'Help',
            click: function () {
                require('electron').shell.openExternal('https://github.com/ThunbergOlle/mcPreview');
            }
        }
    ]
}

];


ipc.on('saveSkin', (event, data) => {
    console.log("SAVESKIN RECIEVED")
    // win.webContents.send('loadSkin');
    win.reload();
});
ipc.on('reloadMainWindow', (event, data) => {
    win.reload();
});


// Manage socket io stuff
socket.on('connection', function (socket) {


    socket.on('blockInput', (file) => {
        console.log(file.name);
        console.log(file.file);
        fs.writeFile('./src/models/block.png', file.file, 'binary', function (err) {
            if (err) throw err;
            socket.broadcast.emit('loadBlock');
        });
    });


    // ARE  YOU  SURE?
    socket.on('are_you_sure_block', () => {
        console.log("He/She is sure!");
        socket.broadcast.emit('loadBlock', {
            success: true
        });
    });



});
