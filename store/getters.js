const getters={
    socketIO:state=>state.socketIO,
    userInfo: state=>state.userInfo,
    friendsList: state=>state.friendsList,
    currentToUser:state=>state.currentToUser,
    token: state=>state.token,
    newmsg: state=>state.newmsg,
}

export default getters