# vue-electron-ipc
Custom IPC functions for electron and vue.  
This package "hijacks" the default ipc classes from electron and adds its own event emitter wich provides callback functionallity

## Installation
```
npm install @wuild/vue-electron-ipc
```

## Usage

### Renderer
```javascript
const VueIPC = require("@wuild/vue-electron-ipc").renderer;
Vue.use(VueIPC);
````
```vue
<script>
export default {
    created(){
      this.$ipc.send("event_name", "data", function(data){
          console.log("callback data:", data)
      });
    },
    
    events: {
        ipc: {
            // IPC event received from main process
            event_name(data){
                console.log(data)
            }
        }
    }
}
</script>
````
---

### Main

By default the ipc class will send a IPC event to all available windows.  
In order to send to a specific window we need to register the window in the IPC class

```javascript
const ipc = require("@wuild/vue-electron-ipc").main;

let windowObject = new BrowserWindow();

// Register BrowserWindow object in the IPC class
ipc.registerWindow("window_name", windowObject);

// Send string to all available windows
ipc.send("event_name", "data");

// Send object to all available windows
ipc.send("event_name", {
    hello: "world"
});

// Send to specific window by name
ipc.sendTo("window_name", "event_name", "data");

// When an IPC event is called we get access to the data and the callback function
// If you'r not calling the callback function it will disappear within 10 seconds
ipc.on("event_name", function(data, callback){
    console.log("incoming data:", data);
    return callback("hello world");
});

````

#### License
Copyright © 2018, [Wuild](https://github.com/Wuild) Released under the [MIT license](https://opensource.org/licenses/MIT).