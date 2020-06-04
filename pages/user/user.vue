<template>
	<view class="userBox">
        <view class="h-bg">
             <image src="../../static/image/timg.jpg" mode="scaleToFill"></image>
        </view>
		<view class="user-head u-f-ajc">
            <image class="h-pic" :src="userInfo.avatar" mode="aspectFill"></image>
            <text>{{userInfo.name}}</text>
		</view>
        <view class="list">
            <uni-list>
                <block v-for="(item,index) in userList" :key="index">
                    <uni-list-item :show-extra-icon="true" :extra-icon="item.extraIcon" :title="item.title" />
                </block>
            </uni-list>
        </view>
	</view>
</template>
 
<script>
	export default {
		data() {
			return {
                userList:[
                    {
                        title:"个人资料",
                        url:'',
                        extraIcon:{
                            color: '#007aff',
                            size: '22',
                            type: 'gear-filled'
                        }
                    },
                    {
                        title:"我的信息",
                        url:'',
                        extraIcon:{
                            color: '#555500',
                            size: '22',
                            type: 'info'
                        }
                    }
                ],
                
			};
		},
        onLoad() {
            
        },
        computed: {
            userInfo() {
                return this.$store.getters.userInfo 
            }
        },
	}
</script>

<style lang="scss" scoped>
.userBox{
    .h-bg{
        position: absolute;
        height: 100%;
        width: 100%;
        image{
            width: 100%;
            height: 100%;
            filter: blur(1px);
        }
    }
    .user-head{
        flex-direction: column;
        position: relative;
        height: 500rpx;
        
        .h-pic{
            width: 150rpx;
            height: 150rpx;
            border-radius: 100%;
            // overflow: hidden;
        }
        text{
            z-index: 9;
            color: #FFFFFF;
        }
        
    }
    .list{
        margin-top: 50rpx;
        // height:5000rpx
    }
}
</style>
