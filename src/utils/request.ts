import axios, { AxiosError } from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

// 创建axios实例
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000
})

// 设置请求拦截器
instance.interceptors.request.use(
    (request) => {
        let token = localStorage.getItem('token')
        if (token) {
            request.headers.Authorization = `Bearer ${token}`
        }
        return request
    },
    (error) => {
        return Promise.reject(new Error(error.message || '请求失败'))
    }
)

// 设置响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 解构响应数据
        const { code, data, message } = response.data
        if (code === 200) {
            return data
        } else {
            ElMessage.error(message || '请求失败')
            return Promise.reject(new Error(message || '请求失败'))
        }
    },
    (error: AxiosError) => {
        if(error.response){
            const status = error.response.status
            switch(status){
                case 400:
                    // 请求参数错误
                    ElMessage.error(error.message || '请求参数错误')
                    break
                case 401:
                    // token过期或无效
                    localStorage.removeItem('token')
                    ElMessage.error('token过期或无效，请重新登录')
                    router.push({ path: '/login' })
                    break
                case 403:
                    // 无权限访问
                    ElMessage.error('无权限访问')
                    break
                case 404:
                    // 请求资源不存在   
                    ElMessage.error('请求资源不存在')
                    break
                default:
                    ElMessage.error(error.message || '请求失败：' + status)
                    break
            }
        }
        return Promise.reject(error)
    }
)

export default instance