import IO from "../../js_sdk/hyoga-uni-socket_io/uni-socket.io.js"
import config from "../../common/config.js"
import store from '../../store/store.js'


export default {
    socketIO: null,
    getInstance() {
        return this.socketIO
    },
    async init() {
        console.log('init',Object.keys(store.getters.userInfo));
        if (Object.keys(store.getters.userInfo).length > 0) {
            console.log("this is initApp module");
            await this._init()
            let afterReconnecting = false;
            // 重连、报错、一般事件
            this.socketIO.on('error', error => {
                console.log(error, 'error');
            });
            this.socketIO.on('reconnect', attemptNumber => {
                if (!afterReconnecting) {
                    this.socketIO.disconnect();
                    this.init();
                    afterReconnecting = true;
                    console.log('not reconnecting, open automatically time=>', new Date().toLocaleString());
                }
                console.log('reconnect successfully. attemptNumber =>', attemptNumber, 'socket-id => ',
                    this.socketIO.id, 'time=>', new Date().toLocaleString(), );
            });
            this.socketIO.on('reconnecting', attemptNumber => {
                afterReconnecting = true;
                console.log('reconnecting. attemptNumber =>', attemptNumber, 'time=>', new Date().toLocaleString(), );
            });
            this.socketIO.on('disconnect', async reason => {
                afterReconnecting = false;
                console.log('disconnect in client, disconnect reason =>', reason, 'time=>', new Date().toLocaleString(), );
            });
            this.socketIO.on('reconnect_error', error => {
                afterReconnecting = false;
                console.log('reconnect_error. error =>', error, 'time=>', new Date().toLocaleString());
            });
        }else{
            uni.reLaunch({
                url:'/pages/login/login'
            })
        }

    },
    async _init() {
        await this._connection();
        await this._addEventListenerList();
        console.log('init app success. ', 'time=>', new Date().toLocaleString());
    },
    async _connection() {
        console.log('当前socketIO URL', config.socketUrl);
        this.socketIO = IO(config.socketUrl, {
            query: {},
            transports: ['websocket', 'polling'],
            timeout: 5000,
        });
        console.log(store);
    },
    async _addEventListenerList() {
        this._listeningInitSocket();
        this._listeningPrivateChatMsg();
    },
    _listeningPrivateChatMsg() {
        this.socketIO.on("getPrivateMsg",async (data,callback) => {
            console.log(data);
            let currentToUser = store.getters.currentToUser
            // 每条信息都会经历两步   1.先进行本地存储  2.更新首页聊天列表信息
            
            if(currentToUser.userId&&currentToUser.userId==data.from_user){
                // 当前在聊天界面 且 聊天的对象发过来的信息
                store.dispatch("ADD_NEW_PRIVATE_CHAT_MSG",{data:data,isme:false,issend:false})
            }
            // 更新本地存储
            store.dispatch('UPDATE_CHAT_DETAIL', {data:data,isme:false,issend:false})
            // 更新首页信息列表
            store.dispatch("UPDATE_HOME_PAGE_LIST", {data:data,isme:false,issend:false})
        })
    },
    _listeningInitSocket() {
        this.socketIO.on("initSocket", (data, callback) => {
            callback(store.getters.userInfo.userId)
            // 初始化数据
            this.socketIO.emit('initSocketSuccess', store.getters.userInfo.userId, (allMessage, friendList) => {
                console.log(allMessage, friendList);
                store.commit('SET_FRIENDSLIST', friendList)
                // allMessage 为数组 
                allMessage.map(item=>{
                    // 更新本地存储
                    store.dispatch('UPDATE_CHAT_DETAIL', {data:item,isme:false,issend:false})
                    // 更新首页信息列表
                    store.dispatch('UPDATE_HOME_PAGE_LIST', {data:item,isme:false,issend:false})
                })
            })
        })
    },

}
