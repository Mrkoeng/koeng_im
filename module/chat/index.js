import store from '../../store/store.js'
import IO from '../initApp/index.js'
export default {
    sendPrivateMessage(val) {
        let socketIO = IO.getInstance();
        let msg = this._formatMsg('send', val)
        socketIO.emit('sendPrivateMsg', msg, res => {
            if (res.success) {
                console.log(res.message);
                // 更新本地存储
                store.dispatch('UPDATE_CHAT_DETAIL',{data:res.data,isme:true,issend:true})
                // 更新到聊天页面
                store.dispatch('ADD_NEW_PRIVATE_CHAT_MSG',{data:res.data,isme:true,issend:true})
                // 更新首页信息列表
                store.dispatch('UPDATE_HOME_PAGE_LIST', {data:res.data,isme:true})
            }
        })
    },
    _formatMsg(type, data, isme = false) {
        // console.log(data);
        // 数据库保存的信息
        // 数据格式都先转SEND格式  然后在转  HOMEPAGELIST 或者其他
        // {
        //     from_user:22256, 自己的id
        //     to_user:1234654, 对方id
        //     message:'123456',
        //     type:'text','image,video,voice,file',
        //     attachments:[]数组    {  
        //                              fileUrl:'',
        //                              recordLength：'6'  若是录音则有录音时长
        //                              fileName：‘文件名称’   若是文件则有文件名称
        //                              fileSize：‘325644’   若是文件则有文件大小 /bit
        //                           }
        // }

        // type信息转化的类型 chatDetail聊天显示的， send用于发送给客户端保存和发送给对方的（必填）
        // 是否是自己发送的  默认false
        let result = {}
        let currentToUser = store.getters.currentToUser //当前聊天对象
        let userInfo = store.getters.userInfo
        // console.log(data);
        switch (type) {
            case 'homePageList':
                result = {
                    name: data.user_name,
                    avatar:data.user_head,
                    userId: data.from_user,
                    type: data.type,
                    time: data.time,
                    message: data.message
                }
                // 本人发送的信息
                if (data.from_user == userInfo.userId) {
                	result.userId = currentToUser.userId;
                	result.avatar = currentToUser.avatar;
                	result.name = currentToUser.name;
                }
                break;
            case 'chatDetail':
                result = {
                    classify:'user',
                    body:{
                        type: data.type,
                        message: data.message,
                        attachments: data.attachments,
                        isme:isme,
                        time:data.time
                    }
                }
                break;
            case 'send':
                result = {
                    from_user: userInfo.userId,
                    to_user: currentToUser.userId,
                    type: data.type,
                    message: data.message,
                    attachments: data.attachments?data.attachments:[],
                    user_head:userInfo.avatar,
                    user_name:userInfo.name,
                }
                break;
        }
        return result
    }
}
