import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'
Vue.use(Vuex)
const state = {
    socketIO:null,
    
    // 好友列表
    friendsList: [],

    // 用户信息userinfo 包括头像，名称等信息 包括USERID
    userInfo: {
        // name:'',
        // userId: '',
        // token:''
    },
    // 当前聊天对话用户信息
    currentToUser:{
        // name:'',
        // userId:''，
        // head：
    }
}
const store = new Vuex.Store({
    strict:true,
    state,
    getters,
    mutations,
    actions
})
if (module.hot) {
    // 使 action 和 mutation 成为可热重载模块
    module.hot.accept(['./mutations', './actions','./getters'], () => {
        // 获取更新后的模块
        // 因为 babel 6 的模块编译格式问题，这里需要加上 `.default`
        const newMutations = require('./mutations').default
        const newActions = require('./actions').default
        const newGetters = require('./getters').default
        // 加载新模块
        store.hotUpdate({
            mutations: newMutations,
            actions:newActions,
            getters:newGetters
        })
    })
}
export default store