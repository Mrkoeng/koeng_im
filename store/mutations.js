const mutations= {
		currentToUser(state, value){
			state.currentToUser = value;
		},
		SET_FRIENDSLIST(state, value){
			state.friendsList = value;
		},
        SET_USERINFO(state, value){
			state.userInfo = value;
		},
        SET_SOCKETIO(state, value){
        	state.socketIO = value;
        },
        RESET_CURRENTTOUSER(state, value){
            state.currentToUser = {};
        }
	}

export default mutations