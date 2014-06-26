var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var screen = require('screen');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var windows = {
    mainWindow:null,
    textileHelp:null,
    preferences:null
};

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform != 'darwin')
        app.quit();
});

var display = screen.getPrimaryDisplay();

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {
    // Create the browser window.
    windows.mainWindow = new BrowserWindow({
        width: display.workArea.width,
        height: display.workArea.height,
        "min-width": 768,
        "min-height": 500
    });

    // and load the index.html of the app.
    windows.mainWindow.loadUrl('file://' + __dirname + '/client/index.html');

    // Emitted when the window is closed.
    windows.mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        windows.mainWindow = null;
    });

});

ipc.on('show-textile-help', function(event,arg){
    console.log("show-textile-help");
    if (windows.textileHelp == null) {
        windows.textileHelp = new BrowserWindow({
            width: 800,
            height: 600,
            "min-width": 768,
            "min-height": 500
        });
        windows.textileHelp.loadUrl('file://' + __dirname + '/client/help/textile/TextileReference.html');
        // Emitted when the window is closed.
        windows.mainWindow.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            windows.textileHelp = null;
        });
    }
    windows.textileHelp.focus();

});
