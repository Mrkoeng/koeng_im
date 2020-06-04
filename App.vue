<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
            // console.log(this.$store);
            this.$initApp.init()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
    // 主题基础变量颜色
    @import  "./uni.scss";
	/*每个页面公共css */
    @import "./common/common.css";
    // 自定义图标CSS
    @import  "./common/iconfont.css";
    // @import "./common/chatroom.scss";
</style>
