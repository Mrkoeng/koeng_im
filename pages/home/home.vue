<template>
    <view class="homeBox">
        <view class="h-bg">
             <image src="../../static/image/timg2.jpg" mode="scaleToFill"></image>
        </view>
        <scroll-view class="msg-list" scroll-y="true" scroll-with-animation upper-threshold="50">
            <block v-for="(item,index) in homePageList" :key="index">
                <view class="u-f-ac m-list" @tap="toChat(item.name,item.userId,item.avatar,index)">
                    <view class="u-f-ac m-list-avatar">
                        <image :src="item.avatar" mode="scaleToFill"></image>
                        <uni-badge class="uni-badge-tips" :text="item.noreadnum" type="error" size="small"></uni-badge>
                    </view>
                    <view class="u-f u-column m-list-content">
                        <view class="u-f u-f-jsb">
                            <text class="name">{{item.name}}</text>
                            <text class="time">{{item.time|toLocalTime}}</text>
                        </view>
                        <view class="m-list-text">
                            <template v-if="item.type=='text'">
                                {{item.message}}
                            </template>
                            <template v-if="item.type=='image'">
                                [图片]
                            </template>
                        </view>
                    </view>
                </view>
            </block>
        </scroll-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                homePageList: [
                    // {
                    //     name: "机器人小何",
                    //     avatar:"../../static/logo.png",
                    //     userId:'robot',
                    //     type: 'text',
                    //     time: '1586336393111',
                    //     noreadnum:5,//未查看的数量
                    //     message: '这里是一段文字文字有很多内容，内容非常长非常长这里是一段文字文字有很多内容，内容非常长非常长',
                    // },
                ]
            };
        },
        onLoad() {
            uni.$on('homePageChange',(data)=>{
                this.getHomePageList()
            })
        },
        onShow() {
            this.getHomePageList()
        },
        methods: {
            toChat(name,user_id,avatar,index) {
                console.log(user_id);
                this.clearRed(index)
                this.$store.dispatch('toChatWithPerson', {
                        userId: user_id,
                        name:name,
                        avatar:avatar
                    })
                    .then(res => {
                        uni.navigateTo({
                            url: `/pages/chat-room/chat-room?name=${name}&userId=${user_id}`
                        })
                    })
            },
            getHomePageList(){
                let arr = uni.getStorageSync(`HOME_PAGE_LIST_${this.$store.getters.userInfo.userId}`)
                arr = arr?arr:[];
                this.homePageList = arr
            },
            clearRed(index){
                try{
                    let arr = uni.getStorageSync(`HOME_PAGE_LIST_${this.$store.getters.userInfo.userId}`)
                    if(!arr) return
                    arr[index].noreadnum = 0
                    uni.setStorageSync(`HOME_PAGE_LIST_${this.$store.getters.userInfo.userId}`,arr)
                }catch(e){
                    //TODO handle the exception
                    console.log(e);
                }
            }
        },

        filters: {
            toLocalTime: function(value) {
                return new Date(value).toLocaleTimeString();
            }
        },
    }
</script>

<style lang="scss" scoped>
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
    .homeBox {
        background-color: $uni-bg-color;
        .m-list {
            padding: 20rpx;
            align-items: stretch;
            .m-list-avatar {
                position: relative;
                &>image {
                    width: 100rpx;
                    height: 100rpx;
                    border-radius: 10%;
                }
                .uni-badge-tips{
                    position: absolute;
                    right: -10px;
                    top: -10px;
                }
            }
            .m-list-content {
                margin-left: 20rpx;
                flex-grow: 1;
                overflow: hidden;
                justify-content: space-between;
                .name {
                    font-size: $uni-font-size-base;
                    color: $uni-text-color
                }
                .time {
                    font-size: $uni-font-size-sm;
                    color: $uni-text-color-grey;
                }
                .m-list-text {
                    width: 100%;
                    font-size: 30rpx;
                    word-break: keep-all;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    color: $uni-text-color-grey;
                    border-bottom: 1px solid #a8a8a8;
                }
            }
        }
    }
</style>
