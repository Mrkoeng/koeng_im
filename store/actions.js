import {login,register} from "../api/index.js"
import chat from '../module/chat/index.js'
// 数组置顶
function __toFirst(arr, index) {
    if (index != 0) {
        arr.unshift(arr.splice(index, 1)[0]);
    }
    return arr;
}
const actions = {
    loginTo({commit}, userinfo) {
        return new Promise((resolve, reject) => {
            login(userinfo).then((res) => {
                if (res.success) {
                    uni.setStorageSync('userInfo', res.userInfo);
                    commit('SET_USERINFO', res.userInfo)
                    resolve(res)
                }
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    toRegister({commit}, userinfo) {
        return new Promise((resolve, reject) => {
            register(userinfo).then((res) => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    toChatWithPerson({commit}, data) {
        return new Promise((resolve, reject) => {
            commit('currentToUser', data)
            resolve('success')
        })
    },
    // 添加好友到好友列表
    ADD_FRIEND_TO_LIST({commit,getters}, payload){
        let tempArr = JSON.parse(JSON.stringify(getters.friendsList));
        let {user_head,user_id,user_name} = payload;
        tempArr.push({
            user_head,
            user_id,
            user_name,
            remark:''
        })
        commit('SET_FRIENDSLIST',tempArr)
    },
    // 聊天常用
    ADD_NEW_PRIVATE_CHAT_MSG({commit}, payload) {
        // console.log('ADD_NEW_PRIVATE_CHAT_MSG', payload);
        let result = chat._formatMsg('chatDetail', payload.data, payload.isme)
        // console.log('ADD_NEW_PRIVATE_CHAT_MSG', result);
        uni.$emit('userChat', result)
    },
    UPDATE_CHAT_DETAIL({commit,getters}, payload) {
        if (!payload.hasOwnProperty('data') || !payload.hasOwnProperty('isme') || !payload.hasOwnProperty('issend')) {
            console.log('传入的payload有误');
            return
        }
        // console.log('UPDATE_CHAT_DETAIL', payload);
        // payload {data:msgObj , isme:true/flase ,issend:true/false}  三者必须填
        let userInfo = getters.userInfo
        let currentToUser = getters.currentToUser
        // 接受 OR 发送
        let to = payload.issend ? payload.data.to_user : payload.data.from_user
        let chatDetailArr = uni.getStorageSync(`CHATDETAIL_${userInfo.userId}_${to}`)

        chatDetailArr = chatDetailArr ? chatDetailArr : [];
        chatDetailArr.push(chat._formatMsg('chatDetail', payload.data, payload.isme))
        console.log('UPDATE_CHAT_DETAIL', chat._formatMsg('chatDetail', payload.data, payload.isme));
        uni.setStorage({
            key: `CHATDETAIL_${userInfo.userId}_${to}`,
            data: chatDetailArr,
            success() {
                console.log(chatDetailArr);
                console.log('更新聊天详情成功');
            }
        })
    },
    UPDATE_HOME_PAGE_LIST({commit,getters}, payload) {
        console.log('UPDATE_HOME_PAGE_LIST', payload);
        // 本地homepage的数据格式
        //{
        //     name: "机器人小何",
        //     avatar:"../../static/logo.png",
        //     userId:'robot',
        //     type: 'text',
        //     time: '1586336393111',
        //     message: '这里是一段文字文字有很多内容，内容非常长非常长这里是一段文字文字有很多内容，内容非常长非常长',
        // }
        // console.log(data);
        let data = Object.assign({}, payload.data)
        let userInfo = getters.userInfo
        let currentToUser = getters.currentToUser
        let homePageList = uni.getStorageSync(`HOME_PAGE_LIST_${userInfo.userId}`)
        homePageList = homePageList ? homePageList : []
        // 判断是否已存在该会话，存在：将当前会话置顶；不存在：追加至头部
        let userId = payload.isme ? data.to_user : data.from_user
        let index = homePageList.findIndex((item) => {
            return item.userId == userId
        })
        let obj = chat._formatMsg('homePageList', data);
        console.log(index, obj);
        if (index > -1) {
            // 存在首页消息列表 home_page_list
            console.log('存在消息列表');
            // 存在：将当前会话置顶,修改chatlist中当前会话的data和time显示
            homePageList[index].message = obj.message;
            homePageList[index].type = obj.type;
            homePageList[index].avatar = obj.avatar;
            homePageList[index].name = obj.name;
            homePageList[index].time = obj.time;

            if (data.from_user !== userInfo.userId && currentToUser.userId !== data.from_user) {
                homePageList[index].noreadnum++;
            }
            // 置顶当前会话
            homePageList = __toFirst(homePageList, index);
        } else {
            // 不存在首页消息列表
            // 忽略本人发送
            if (data.from_user !== userInfo.userId) {
                obj.noreadnum = 1;
            }
            homePageList.unshift(obj);
        }
        uni.setStorage({
            key: `HOME_PAGE_LIST_${getters.userInfo.userId}`,
            data: homePageList,
            success() {
                console.log(obj);
                console.log('更新home page成功');
                uni.$emit('homePageChange')
            }
        })
    }
}
export default actions
