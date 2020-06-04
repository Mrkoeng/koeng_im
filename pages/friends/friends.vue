<template>
    <view class="wrapper">
        <view class="h-bg">
             <image src="../../static/image/ca221a8bb96e3db4cf381ed5fd2f0b60.jpg" mode="scaleToFill"></image>
        </view>
        <scroll-view class="list" scroll-y="true" scroll-with-animation upper-threshold="50">
            <view class="especial">
                <view class="especial-list" @tap="addfriends">
                    <view>
                        <image src="/static/image/addfriend.png"  />
                    </view>
                    <view class="u-f-ac marginleft">
                        <view style="font-size:16px;margin:5px 0 0 0;">添加好友</view>
                    </view>
                </view>
            </view>
            <view class="user-list" @tap="toChat(item.user_id,item.user_name,item.user_head)" v-for="(item,index) in friendsList"
                :key="index">
                <view>
                    <image :src="item.user_head" />
                </view>
                <view class="u-f-jc u-column marginleft">
                    <view class="user-list-name">{{item.user_name}}</view>
                    <view class="user-list-tip">点击进行会话</view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                name: ''
            };
        },
        methods: {
            toChat(userId, name, avatar) {
                this.$store.dispatch('toChatWithPerson', {
                    userId: userId,
                    name: name,
                    avatar: avatar
                }).then(res => {
                    uni.navigateTo({
                        url: `/pages/chat-room/chat-room?name=${name}&userId=${userId}`
                    })
                })
            },
            addfriends(){
                uni.navigateTo({
                    url:'/pages/friends-add/friends-add'
                })
            }
        },
        onLoad() {
            this.name = uni.getStorageSync('name');
        },
        computed: {
            friendsList() {
                return this.$store.getters.friendsList
            }
        },
    };
</script>

<style lang="scss" scoped>
    .wrapper {
        .h-bg{
            position: absolute;
            height: 100%;
            width: 100%;
            image{
                width: 100%;
                height: 100%;
                filter: blur(1px);
                opacity: 0.7;
            }
        }
        .list{
            image{
                width: 50px;
                height: 50px;
                border-radius: 10px;
            }
        }
    }
    
    .especial-list{
        border-bottom: 1px solid #f8f8f8;
        padding: 5px 10px 5px 10px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
    }
    .user-list {
        border-bottom: 1px solid #f8f8f8;
        padding: 5px 10px 5px 10px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        &-name{
            font-size: 16px;
            color: #333;
        }
        &-tip{
            font-size: 14px;
            color: #999;
        }
    }
    .marginleft{
        margin-left: 5px;
    }
</style>
