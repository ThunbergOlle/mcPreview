const electron = require('electron');
const fs = require('fs');
const ipc = electron.ipcRenderer;

document.getElementById('fileinput').addEventListener('change', function () {
        var file = this.files[0];
        ipc.send('saveSkin', {
            file: file
        });
        window.close();

}, false);


if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}