const {ipcRenderer} = require("electron");
const {isFunction, isObject} = require("lodash");
const uuid = require("uuid");

const orgEmitter = ipcRenderer.emit;

module.exports = {
    install(Vue) {
        Vue.prototype.$ipc = new Vue({
            created() {
                ipcRenderer.emit = function (...args) {
                    this.$emit(args[0], args[2]);
                    orgEmitter(...args);
                }.bind(this);
            },
            methods: {
                send(event, data, callback) {
                    if (isFunction(data)) {
                        callback = data;
                        data = null;
                    }

                    let message = {
                        _id: uuid.v4(),
                        data: data
                    };

                    ipcRenderer.send(event, message);
                    if (callback) {
                        this.$once(message._id, callback);
                        setTimeout(function () {
                            this.$off(message._id, callback);
                        }.bind(this), 10000);
                    }
                },
            }
        });

        Vue.mixin({
            beforeCreate: function () {
                if (isObject(this.$options.events) && this.$options.events.ipc)
                    Object.keys(this.$options.events.ipc).forEach((key) => {
                        let func = this.$options.events.ipc[key].bind(this);
                        this.$ipc.$on(key, func);
                        this.$options.events.ipc[key]._binded = func;
                    });
            },
            beforeDestroy() {
                if (isObject(this.$options.events) && this.$options.events.ipc)
                    Object.keys(this.$options.events.ipc).forEach((key) => {
                        this.$ipc.$off(key, this.$options.events.ipc[key]._binded);
                    });
            }
        });

    }
};