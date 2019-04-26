const EventEmitter = require("events");
const {ipcMain, BrowserWindow} = require("electron");
const orgEmitter = ipcMain.emit;

class IPC extends EventEmitter {

    constructor() {
        super();

        this.windows = {};

        ipcMain.emit = function (...args) {
            if (args[2] && args[2]._id) {
                let callback = function (data) {
                    args[1].sender.send(args[2]._id, data);
                };
                this.emit(args[0], args[2].data, callback);
                orgEmitter(...args);
            }
        }.bind(this);
    }

    registerWindow(id, window) {
        if (!this.windows[id])
            this.windows[id] = window;
    }

    removeWindow(id) {
        if (this.windows[id])
            delete this.windows[id];
    }

    send(event, data) {
        BrowserWindow.getAllWindows().forEach(function (win) {
            win.webContents.send(event, data);
        }.bind(this));
    }

    sendTo(id, event, data) {
        if (this.windows[id])
            this.windows[id].webContents.send(event, data);
        else
            throw new Error(`Window "${id}" is not registered`);
    }
}

/**
 * @type {IPC}
 */
module.exports = new IPC();