<template>
	<view>
		<uni-search-bar @confirm="search" @input="input" @cancel="cancel" placeholder="用户ID"/>
        <view class="u-f-ajc result" v-show="showResult">
            <template v-if="userList.length>0">
                <view class="user-box">
                    <view class="user-list" v-for="(item,index) in userList"
                        :key="index">
                        <view>
                            <image :src="item.user_head" />
                        </view>
                        <view class="list-content">
                            <view class="user-list-name">{{item.user_name}}</view>
                            <button class="btnClass" size="mini" :disabled="item.isFriend" @click.stop="addFriend()">{{item.isFriend?'已添加':'添加好友'}}</button>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else>
                <view>用户不存在</view>
            </template>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchVal:'',
                userList:[],
                showResult:false,
			};
		},
        methods: {
            search(res) {
                this.showResult = false;
                this.$initApp.getInstance().emit('findUser',res.value, (userList) => {
                    this.showResult = true;
                    if(userList.length>0) this.userList = userList
                    console.log(userList);
                })
            },
            input(res) {
                // 当输入值改变的时候触发
            	this.searchVal = res.value
            },
            cancel(res) {
                uni.navigateBack({
                    delta:1
                })
            },
            addFriend(){
                let user_id = this.searchVal
                this.$initApp.getInstance().emit('addFriends',user_id, (res) => {
                    if(res.success){
                        let tempObj =  this.userList[0]
                        this.$store.dispatch('ADD_FRIEND_TO_LIST',tempObj)
                        tempObj.isFriend=true
                    }
                })
            }
        },
	}
</script>

<style lang="scss">
.result{
    min-height: 300rpx;
    &>view{
        color: #999;
        font-size: 15px;
    }
}
.user-box{
    align-self: flex-start;
    flex: 1;
}
.user-list {
        border-bottom: 1px solid #f8f8f8;
        padding: 5px 10px 5px 10px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        image{
            width: 50px;
            height: 50px;
            border-radius: 10px;
        }
        .list-content{
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-items: center;
            margin-left: 10px;
            .btnClass{
                margin: 0;
            }
        }
        &-name{
            font-size: 16px;
            color: #333;
        }
    }
</style>
