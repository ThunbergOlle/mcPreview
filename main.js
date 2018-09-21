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
            label: 'Model type',
            submenu: [
                {
                    label: 'Skin'
                },
                {
                    label: 'Block',
                    click: function(){
                        are_you_sure = new BrowserWindow({width: 230, height: 120, frame: false});
                        are_you_sure.loadURL(url.format({
                            pathname: path.join(__dirname+'/src/pages/are_you_sure/block.html'),
                            protocol: 'file',
                            slashes: true
                        }));
                        are_you_sure.setMenu(null);
                    }
                },
                {
                    label: 'Coming soon!'
                }
            ]

        },
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
            label: 'Help',
            click: function(){
                require('electron').shell.openExternal('https://github.com/ThunbergOlle/mcPreview');
            }
        },
        {
            label: 'Debugging',
            click: function(){
                win.webContents.openDevTools();
            }
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
        label: 'Window',
        submenu: [
            {
                label: 'Reload',
                click: function(){
                    win.reload();
                }
            },
        ]
    }

];

// Manage socket io stuff
socket.on('connection', function(socket) {


    socket.on('skinInput', (file) => {
        console.log(file.name);
        console.log(file.file);
        fs.writeFile('./src/models/steve.png', file.file, 'binary', function(err) {
            if(err) throw err;
            socket.emit('skinInputSuccess',{
                success: true
            });
            win.reload();
        });
    });




    // ARE  YOU  SURE?
    socket.on('are_you_sure_block', () => {
        console.log("He/She is sure!");
        socket.emit('loadBlock', {
            success: true
        });
    });



});
