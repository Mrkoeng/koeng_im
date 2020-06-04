import http from './interface'



export const login = (data) => {
    return http.get('/api/common/login',data)
}
 
// 注册
export const register = (data) => {
    return http.post('/api/common/register',data)
}

// uploadFile
export const upLoadFile = (data) => {
    return new Promise((resolve,reject)=>{
        let token = uni.getStorageSync('userInfo').token
        uni.uploadFile({
            url: 'http://localhost:3000/api/common/upload', //仅为示例，非真实的接口地址
            filePath: data.filePath,
            name: 'file',
            header:{
                Authorization:`Bearer ${token}`
            },
            success: (uploadFileRes) => {
                let data = JSON.parse(uploadFileRes.data)
                console.log(uploadFileRes);
                if(data.success){
                    resolve(data)
                }
            },
            fail:(err)=>{
                console.log(err);
                if(err.statusCode==401){
                    console.log('没有权限');
                    reject(err)
                    uni.reLaunch({
                        url:'/pages/login/login.vue'
                    })
                }
            }
            
        });
    })
}


// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	login,
    register,
    upLoadFile
}