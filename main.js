import Vue from 'vue'
import App from './App'
import store from './store/store.js'  
import initApp from "./module/initApp/index.js";
import chat from "./module/chat/index.js";

Vue.config.productionTip = false


Vue.prototype.$chat = chat;
Vue.prototype.$store = store
Vue.prototype.$initApp = initApp

App.mpType = 'app'

const app = new Vue({
    ...App
    
})
app.$mount()
