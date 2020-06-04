<template>
    <view class="chatroomBox">
        <view class="chat-top" @touchstart="hideDrawer">
            <view class="h-bg">
                 <image src="../../static/image/timg2.jpg" mode="scaleToFill"></image>
            </view>
            <scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop"
                :scroll-into-view="scrollToView" @scrolltoupper="loadHistory" upper-threshold="50">
                <!-- 布局 -->
                <view v-for="(item, key) in msgList" :key="key"  :id="item.id">
                    <!-- 用户发出的消息 -->
                    <block v-if="item.classify=='user'">
                        <view class="my" :class="{'other':!item.body.isme}">
                            <view class="chat-list-content">
                                <!-- 文字消息 -->
                                <view v-if="item.body.type=='text'" class="bubble">
                                    <rich-text :nodes="item.body.message"></rich-text>
                                </view>
                                <!-- 图片消息 -->
                                <view v-if="item.body.type=='image'" class="bubble img" @tap="showPic(item.body.attachments[0].fileUrl)">
                                    <image :src="item.body.attachments[0].fileUrl" :style="{'width': 100+'px','height': 150+'px'}"></image>
                                </view>
                                <!-- 语言消息 -->
                                <view v-if="item.body.type=='voice'" class="bubble voice" @tap="playVoice(item.body.attachments[0].fileUrl,key)"
                                    :class="key==playMsgindex?'play':''">
                                    <view class="length">{{item.body.attachments[0].recordLength}}</view>
                                    <view class="iconfont icon-saying my-voice"></view>
                                </view>
                                <!-- 视频消息 -->
                                <!-- <view v-if="item.body.type=='video'" class="bubble file" @tap="downloadFile(item.msg)">
                                    <image :src="item.body.content.src" :style="{'width': 100+'px','height': 150+'px'}"></image>
                                </view> -->
                            </view>
                            <!-- 头像 -->
                            <view class="chat-list-head">
                                <image :src="item.body.avatar"></image>
                            </view>
                        </view>
                    </block>
                </view>
            </scroll-view>
        </view>
        <!-- 底部输入栏 -->
        <view class="chat-bottom">
            <chat-bottom @submitMsg="submitMsg"></chat-bottom>
        </view>

    </view>
</template>

<script>
    import {UUID} from '../../utils/index.js'
    import chatBottom from './components/chat-bottom'
    // {
    //     classify: "user"
    //     body: {
    //         attachments: []
    //         from_user: "xzq"
    //         message: "神奇小伙"
    //         time: "2020-5-28 16:59:08"
    //         to_user: "xiaoli"
    //         type: "text"
    //     }
    // }
    export default {
        components: {
            chatBottom
        },
        data() {
            return {
                msgList: [],
                // 语音相关
                playMsgindex:null,
                AUDIO: uni.createInnerAudioContext(),
                //消息列表
                isHistoryLoading: false,
                scrollAnimation: false,
                scrollTop: 0,
                scrollToView: '',
                myuid: 0,

            };
        },
        computed: {
            currentToUser() {
                return this.$store.getters.currentToUser
            },
            userInfo(){
                return this.$store.getters.userInfo
            }
        },
        onLoad(option) {
            if (!this.$store.getters.currentToUser.userId) {
            	uni.showToast({ title: '该用户不存在',icon:"none" });
            	return uni.navigateBack({ delta: 1 });
            }
            // {name：名字，userId 对话人的userId：} 设置导航条对话的名字
            uni.setNavigationBarTitle({title:option.name,})
        },
        onUnload(){
            this.$store.commit('RESET_CURRENTTOUSER')
        },
        onReady() {
            // 获取聊天信息 并 监听
            this.init();
            //语音自然播放结束
            this.AUDIO.onEnded(res => {
            	this.playMsgindex = null;
            });
        },
        methods: {
            init(){
                // 获取聊天详情
                let userInfo = this.userInfo
                let currentToUser = this.currentToUser
                try{
                    let tempArr = uni.getStorageSync(`CHATDETAIL_${userInfo.userId}_${currentToUser.userId}`)
                    tempArr = tempArr?tempArr:[];
                    if(tempArr.length>0){
                        tempArr.forEach(item=>{
                            item.id ='msg'+ UUID(10)
                            item.body.isme?item.body.avatar = userInfo.avatar :item.body.avatar = currentToUser.avatar
                        })
                        this.msgList = Array.prototype.concat.call(this.msgList,tempArr)
                        this.$nextTick(()=>{
                            this.scrollAnimation = false
                            console.log(this.msgList[this.msgList.length-1].id);
                            this.scrollToView = this.msgList[this.msgList.length-1].id
                        })
                    }
                    // console.log('当前聊天详情',this.msgList);
                }catch(e){
                    console.log(e)
                    //TODO handle the exception
                }
                
                // 监听聊天信息
                uni.$on('userChat', (res) => {
                    console.log(res);
                    this.scrollAnimation = true
                    res.id ='msg'+UUID(10)
                    res.body.isme?res.body.avatar = userInfo.avatar :res.body.avatar = currentToUser.avatar
                    this.msgList.push(res)
                    // 滚动到最新的消息
                    this.$nextTick(()=>{
                        this.scrollToView = res.id
                    })
                });
                
            },
            submitMsg(res) {
                this.$chat.sendPrivateMessage(res)
            },
            playVoice(url, key) {
                this.playMsgindex = key
                this.AUDIO.src = url;
                this.$nextTick(function() {
                    this.AUDIO.play();
                });
            },
            hideDrawer() {
                console.log(1);
            },
            // 预览图片
            showPic(picUrl) {
            	uni.previewImage({
            		indicator: 'none',
            		current: 1,
            		urls: [picUrl]
            	});
            },
            // 查看历史记录
            loadHistory(){
                console.log('查看历史记录');
            }
        },
        
    };
</script>

<style scoped lang="scss">
    .chatroomBox{
        display:flex;
        flex-direction:column ;
        height: 100%;
        .chat-top{
            flex-grow:1;
            overflow:hidden;
            .msg-list{
                height:100%
            }
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
        }
        .chat-bottom {
            width: 100%;
            min-height: 100rpx;
            background: #f1f1f1;
        }
    }
    .my {
        padding: 20rpx 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;

        .chat-list-content {
            margin-right: 10rpx;
            max-width: 70%;
            min-height: 50rpx;
        }

        .bubble {
            background-color: #f06c7a;
            color: #fff;
            border-radius: 10rpx;
            padding: 15rpx 20rpx;
            display: flex;
            align-items: center;
            font-size: 32rpx;
            word-break: break-word;

            &.img {
                background-color: transparent;
                padding: 0;
                overflow: hidden;

                image {
                    flex: 1;
                    max-width: 350rpx;
                    max-height: 350rpx;
                }
            }

        }

        .voice {
            .my-voice {
                transform: rotate(180deg);
                font-size: 42rpx;
                display: flex;
                align-items: center;
                color: #fff;
            }

            .my-voice:after {
                content: " ";
                width: 100%;
                height: 100%;
                border-radius: 100%;
                position: absolute;
                box-sizing: border-box;
            }

            .length {
                font-size: 28rpx;
                margin-right: 20rpx;
                word-break: keep-all;
            }

        }

        .play {
            @keyframes my-play {
                0% {
                    transform: translateX(-80%);
                }

                100% {
                    transform: translateX(0%);
                }
            }

            .my-voice:after {
                border-right: solid 10rpx rgba(240, 108, 122, .5);
                animation: my-play 1s linear infinite;
            }

        }

        .chat-list-head {
            flex-shrink: 0;
            width: 80rpx;
            height: 80rpx;

            image {
                width: 80rpx;
                height: 80rpx;
                border-radius: 10rpx;
            }
        }
    }

    .other {
        flex-direction: row-reverse;

        .chat-list-content {
            margin-right: 0;
            margin-left: 10rpx;
        }

        .bubble {
            background-color: #fff;
            color: #333;
        }

        .voice {
            flex-direction: row-reverse;
            .my-voice {
                transform: rotate(0deg);
                color: #333;
            }
        }

        .play {
            .my-voice:after {
                border-right: solid 10rpx rgba(255, 255, 255, .5);
            }

        }
    }




  
</style>
