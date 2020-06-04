<template>
    <view class="content">
        <!-- logo -->
        <view class="logo">
            <image src="../../static/icons.png"></image>
        </view>
        <!-- input -->
        <view class="uni-form-item uni-column"><input type="tel" class="uni-input" placeholder="请输入用户名" v-model="name"
                value="" /></view>
        <view class="uni-form-item uni-column"><input type="password" class="uni-input" placeholder="请输入密码" v-model="password"
                value="" /></view>
        <!-- button -->
        <button type="primary" @click="btn">{{show?'登录':'注册'}}</button>
        <view class="register">
            <template v-if="show">
                还没有有账号?<text @click="show=false">点击注册</text>
            </template>
            <template v-else>
                <text @click="show=true">已有账号返回登录</text>
            </template>
        </view>
    </view>
</template>

<script>
    import {login} from "../../api/index.js"
    export default {
        data() {
            return {
                show: true,
                name: 'xzq',
                password: '123456'
            };
        },
        onLoad() {

        },
        computed: {},
        methods: {
            // 判断点击登陆状态
            btn() {
                let name = this.name
                let password = this.password
                if (this.show) {
                    this.login(name, password)
                } else {
                    this.register(name, password)
                }
            },
            login(name, password) {
                this.$store.dispatch('loginTo', {
                    name,
                    password
                }).then((res) => {
                    if (res.success) {
                        uni.reLaunch({
                            url: "../home/home",
                            success: async () => {
                                this.$initApp.init();
                            }
                        })
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        });
                    }

                }).catch(err => {
                    console.log(err);
                })
            },
            register(name, password) {
                this.$store.dispatch('toRegister', {
                    name,
                    password
                }).then((res) => {
                    if (res.success) {
                        this.name = ''
                        this.password = ''
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        });
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        }
    };
</script>

<style lang="scss" scoped>
    $color-primary: #25b0f3;

    .content {
        padding: 400rpx 100rpx 0px 100rpx;
    }

    .logo {
        text-align: center;
        image {
            height: 200rpx;
            width: 200rpx;
            margin: 0 0 60rpx;
        }
    }
    .uni-form-item {
        margin-bottom: 40rpx;
        padding: 0;
        border-bottom: 1px solid #e3e3e3;

        .uni-input {
            font-size: 30rpx;
            padding: 7px 0;
        }
    }

    button[type='primary'] {
        background-color: $color-primary;
        border-radius: 0;
        font-size: 34rpx;
        margin-top: 60rpx;
    }

    .bottom {
        margin-top: 200rpx;
        font-size: 12px;
        color: #999;
        letter-spacing: 1px;
        text-align: center;
    }

    .register {
        margin-top: 20rpx;
        font-size: 24rpx;
        display: flex;
        justify-content: flex-end;

        text {
            color: $color-primary;
        }
    }
</style>
