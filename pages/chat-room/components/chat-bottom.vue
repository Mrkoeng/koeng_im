<template>
    <view class="">
        <!-- 录音UI效果 -->
        <view class="record" :class="recording?'':'hidden'">
            <view class="ing" :class="willStop?'hidden':''">
                <view class="icon luyin2"></view>
            </view>
            <view class="cancel" :class="willStop?'':'hidden'">
                <view class="icon chehui"></view>
            </view>
            <view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
        </view>
        <!-- 底部输入栏 -->
        <view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
            <!-- H5下不能录音，输入栏布局改动一下 -->
            <!-- #ifndef H5 -->
            <view class="voice">
                <view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
            </view>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <view class="more" @tap="showMore">
                <view class="icon add"></view>
            </view>
            <!-- #endif -->
            <view class="textbox">
                <view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin"
                    @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
                <view class="text-mode" :class="isVoice?'hidden':''">
                    <view class="box">
                        <textarea auto-height="true" v-model="textMsg" @focus="textareaFocus" />
                    </view>
        		</view>
        	</view>
        	<!-- #ifndef H5 -->
        	<view class="more" @tap="showMore">
        		<view class="icon add"></view>
        	</view>
        	<!-- #endif -->
        	<view class="send" :class="isVoice?'hidden':''" @tap="send('text')">
        		<view class="btn">发送</view>
        	</view>
        </view>
        <view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
        	<!-- <emotion @addEmoji="addEmoji" :class="{hidden:hideEmoji}" ></emotion> -->
        	<view class="more-layer" :class="{hidden:hideMore}">
        		<view class="list">
        			<view class="box" @tap="chooseImage">
        				<view class="icon tupian2"></view>
        			</view>
        		<!-- 	<view class="box" @tap="yuyintonghua">
        				<image style="font-size:16px;width: 32px; height: 32px;" 
        				src="../../static/yuyintonghua.png"></image>
        			</view> -->
        			<view class="box" @tap="chooseFile">
        				<view class="icon icon-wenjian">
        				    
        				</view>
        			</view>
        
        		</view>
        	</view>
        </view>
    </view>
</template>

<script>
    // {发送到服务器的数据
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
    import {upLoadFile} from '../../../api/index.js'
    export default{
        data() {
            return {
                // 抽屉参数
                popupLayerClass: '',
                isVoice: false,
                recording: false,
                //文字消息
                textMsg: '',
                voiceTis: '按住 说话',
                // more参数
                hideMore: true,
                
                //录音相关参数
                // #ifndef H5
                //H5不能录音
                RECORDER: uni.getRecorderManager(),
                // #endif
                VoiceTimer: null,
                recordTis: "手指上滑 取消发送",
                willStop: false,
                initPoint: {
                    identifier: 0,
                    Y: 0,
                    timestamp:0
                },
                recordTimer: null,
                recordLength: 0,
            }
        },
        computed: {
            token() {
                return this.$store.getters.userInfo.token 
            }
        },
        created() {
           
            // #ifndef H5
            //录音开始事件
            this.RECORDER.onStart(e => {
            	this.recordBegin(e);
            });
            //录音结束事件
            this.RECORDER.onStop(e => {
            	this.recordEnd(e);
            });
            // #endif
        },
        methods:{
            send(type,option){
                if(type=='text'){
                    this.$emit('submitMsg',{
                        type:type,
                        message:this.textMsg,
                        attachments:[]
                    })
                    this.textMsg=""
                }else{
                    let attachments = []
                    attachments.push({
                        fileUrl:option.url,
                        recordLength:option.recordLength?option.recordLength:0,
                    })
                    option
                    this.$emit('submitMsg',{
                        type:type,
                        message:'',
                        attachments:attachments
                    })
                }            
            },
            chooseImage(){
            	this.getImage('album');
            },
            chooseFile(){
                // #ifdef  MP-WEIXIN
                wx.chooseMessageFile({
                  count: 1,
                  type: 'file',
                  success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFiles
                    console.log(tempFilePaths,'tempFilePaths');
                  }
                })
                // #endif
            },
            //选照片 or 拍照
            getImage(type){
            	this.hideDrawer();
            	uni.chooseImage({
                    count:1,
            		sourceType:[type],
            		sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            		success: (chooseImageRes)=>{
                        const tempFilePaths = chooseImageRes.tempFilePaths;
                        console.log(upLoadFile);
                        upLoadFile({
                            filePath:tempFilePaths[0]
                        }).then(res=>{
                            this.send('image',{url:res.url})
                        }).catch(err=>{
                            console.log(err);
                        })
            		}
            	});
            },
            showMore() {
                this.isVoice = false;
                this.hideEmoji = true;
                if (this.hideMore) {
                    this.hideMore = false;
                    this.openDrawer();
                } else {
                    this.hideDrawer();
                }
            },
            // 打开抽屉
            openDrawer() {
                this.popupLayerClass = 'showLayer';
            },
            // 隐藏抽屉
            hideDrawer() {
                this.popupLayerClass = '';
                setTimeout(() => {
                    this.hideMore = true;
                    this.hideEmoji = true;
                }, 150);
            },
            textareaFocus() {
                if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
                    this.hideDrawer();
                }
            },
            // 录音开始
            voiceBegin(e) {
                console.log(e);
            	if (e.touches.length > 1) {
            		return;
            	}
            	this.initPoint.Y = e.touches[0].clientY;
            	this.initPoint.identifier = e.touches[0].identifier;
                this.initPoint.timeStamp = e.timeStamp
                console.log('录音开始');
                // 如果为单击则取消录音
                this.VoiceTimer = setTimeout(()=>{
                    this.RECORDER.start({ format: 'ACC' });//录音开始,
                },50)
            	 
            },
            //录音开始UI效果
            recordBegin(e) {
            	this.recording = true;
            	this.voiceTis = '松开 结束';
            	this.recordLength = 0;
            	this.recordTimer = setInterval(() => {
            		this.recordLength++;
            	}, 1000);
            },
            // 录音被打断
            voiceCancel() {
            	this.recording = false;
            	this.voiceTis = '按住 说话';
            	this.recordTis = '手指上滑 取消发送';
            	this.willStop = true; //不发送录音
            	this.RECORDER.stop(); //录音结束
            },
            // 录音中(判断是否触发上滑取消发送)
            voiceIng(e) {
            	if (!this.recording) {
            		return;
            	}
            	let touche = e.touches[0];
            	//上滑一个导航栏的高度触发上滑取消发送
            	if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
            		this.willStop = true;
            		this.recordTis = '松开手指 取消发送';
            	} else {
            		this.willStop = false;
            		this.recordTis = '手指上滑 取消发送';
            	}
            },
            // 结束录音
            voiceEnd(e) {
                console.log(e.timeStamp - this.initPoint.timeStamp);
                if(e.timeStamp - this.initPoint.timeStamp<150){
                    clearTimeout(this.VoiceTimer)
                    console.log('解除timer');
                }
            	// if (!this.recording) {
            	// 	return;
            	// }
                console.log('结束');
                this.recording = false;
                this.voiceTis = '按住 说话';
                this.recordTis = '手指上滑 取消发送';
                this.RECORDER.stop(); //录音结束
            	
            },
            //录音结束(回调文件)
            recordEnd(e) {
            	clearInterval(this.recordTimer);
            	if (!this.willStop) {
            		let msg = {
            			length: 0,
            			url: e.tempFilePath
            		};
            		let min = parseInt(this.recordLength / 60);
            		let sec = this.recordLength % 60;
            		min = min < 10 ? '0' + min : min;
            		sec = sec < 10 ? '0' + sec : sec;
            		msg.length = min + ':' + sec;
                    console.log(msg);
                    upLoadFile({
                        filePath:msg.url
                    }).then(res=>{
                        this.send('voice',{url:res.url,recordLength:msg.length})
                    }).catch(err=>{
                        console.log(err);
                    })
            	} else {
            		console.log('取消发送录音');
            	}
            	this.willStop = false;
            },
            // 切换语音/文字输入
            switchVoice() {
            	this.hideDrawer();
            	this.isVoice = this.isVoice ? false : true;
            },
            discard() {
            	return;
            },
        },
        
    }
</script>

<style lang="scss" scoped>
@font-face {
    font-family:"HMfont-home";
    src:url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');}
	.icon {
		font-family:"HMfont-home" !important;
		font-size:56upx;
		font-style:normal;
		color: #333;
		&.biaoqing:before {
		  content: "\e797";
		}
		&.jianpan:before {
		  content: "\e7b2";
		}
		&.yuyin:before {
		  content: "\e805";
		}
		&.tupian:before {
		  content: "\e639";
		}
		&.chehui:before {
		  content: "\e904";
		}
		&.luyin:before {
		  content: "\e905";
		}
		&.luyin2:before {
		  content: "\e677";
		}
		&.other-voice:before {
		  content: "\e667";
		}
		&.my-voice:before {
		  content: "\e906";
		}
		&.hongbao:before {
		  content: "\e626";
		}
		&.tupian2:before {
		  content: "\e674";
		}
		&.paizhao:before {
		  content: "\e63e";
		}
		&.add:before {
		  content: "\e655";
		}
		&.close:before {
		  content: "\e607";
		}
		&.to:before {
		  content: "\e675";
		}
	}
.hidden{
	display: none !important;
}
.popup-layer{
	&.showLayer{transform: translate3d(0,-42vw,0);}
	transition: all .15s linear;
	width: 96%;
	height: 42vw;
	padding: 20upx 2%;
	background-color: #f3f3f3;
	border-top: solid 1upx #ddd;
	position: fixed;
	z-index: 20;
	top: 100%;
	.emoji-swiper{
		height: 40vw;
		swiper-item{
			display: flex;
			align-content: flex-start;
			flex-wrap: wrap;
			view{
				width: 12vw;
				height: 12vw;
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					width: 8.4vw;
					height: 8.4vw;
				}
			}
		}
	}
	.more-layer{
		width: 100%;
		height: 42vw;
		.list{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			.box{
				width: 18vw;
				height: 18vw;
				border-radius: 20upx;
				background-color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0 3vw 2vw 3vw;
				.icon{
					font-size: 70upx;
				}
			}
		}
	}
}
.input-box{
	width: 98%;
	min-height: 100upx;
	padding: 0 1%;
	background-color: #FFFFFF;
	display: flex;
	position: fixed;
	z-index: 20;
	bottom:-2upx;
	&.showLayer{transform: translate3d(0,-42vw,0);}
	transition: all .15s linear;
	border-bottom: solid 1upx #ddd;
	.voice,.more{
		flex-shrink: 0;
		width: 90upx;
		height: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.send{
		//H5发送按钮左边距
		/* #ifdef H5 */
		margin-left: 20upx;
		/* #endif */
		flex-shrink: 0;
		width: 100upx;
		height: 100upx;
		display: flex;
		align-items: center;
		.btn{
			width: 90upx;
			height: 56upx;
			display: flex;
			justify-content: center;
			align-items: center;
			background:linear-gradient(to right, #36b2fe, #3061fb);
			color: #fff;
			border-radius: 6upx;
			font-size: 24upx;
		}
	}
	.textbox{
		width: 100%;
		min-height: 70upx;
		margin-top: 15upx;
		.voice-mode{
			width: calc(100% - 2upx);
			height: 68upx;
			border-radius: 70upx;
			border:solid 1upx #cdcdcd;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			background-color: #fff;
			color: #555;
			&.recording{
				background-color: #e5e5e5;
			}
		}
		.text-mode{
			width: 100%;
			min-height: 70upx;
			display: flex;
			background-color: #fff;
			border-radius: 40upx;
			.box{
				width: 100%;
				padding-left: 30upx;
				min-height: 70upx;
				display: flex;
				align-items: center;
				textarea{
					width: 100%;
				}
			}
			.em{
				flex-shrink: 0;
				width: 80upx;
				padding-left: 10upx;
				height: 70upx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}
.record{
	width: 40vw;
	height: 40vw;
	position: fixed;
	top: 55%;
	left: 30%;
	background-color: rgba(0,0,0,.6);
	border-radius: 20upx;
	.ing{
		width: 100%;
		height: 30vw;
		display: flex;
		justify-content: center;
		align-items: center;
		// 模拟录音音效动画
		@keyframes volatility {
			0% {background-position: 0% 130%;}
			20% {background-position: 0% 150%;}
			30% {background-position: 0% 155%;}
			40% {background-position: 0% 150%;}
			50% {background-position: 0% 145%;}
			70% {background-position: 0% 150%;}
			80% {background-position: 0% 155%;}
			90% {background-position: 0% 140%;}
			100% {background-position: 0% 135%;}
		}
		.icon{
			background-image:linear-gradient(to bottom,#f09b37,#fff 50%); 
			background-size:100% 200%;
			animation: volatility 1.5s ease-in-out -1.5s infinite alternate;
			-webkit-background-clip:text; 
			-webkit-text-fill-color:transparent; 
			font-size: 150upx;
			color: #f09b37;
		}
	}
	.cancel{
		width: 100%;
		height: 30vw;
		display: flex;
		justify-content: center;
		align-items: center;
		.icon{
			color: #fff;
			font-size: 150upx;
		}
	}
	.tis{
		width: 100%;
		height: 10vw;
		display: flex;
		justify-content: center;
		font-size: 28upx;
		color: #fff;
		&.change{
			color: #f09b37;
		}
	}
}
</style>
