import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 30 * 1000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    console.log('response拦截器开始拦截')
    console.log(response.data)
    console.log('response拦截器结束拦截(会拦截所有response)')
    const res = response.data

    if (response.status === 201) {
      Message({ showClose: true, message: '创建成功', type: 'success' })
    } else if (response.status === 204) {
      Message({ showClose: true, message: '删除成功', type: 'success' })
    } else if (response.status === 401) {
      return Promise.reject('请登陆')
    } else if (response.status === 403) {
      MessageBox({ showClose: true, message: '您没有权限', type: 'error' })
    } else if (response.status === 404) {
      MessageBox({ showClose: true, message: '资源不存在', type: 'error' })
    } else if (response.status >= 300 && response.status < 400) {
      MessageBox({ showClose: true, message: '服务器已迁移', type: 'error' })
    } else if (response.status >= 400 && response.status < 500) {
      MessageBox({ showClose: true, message: '请求错误', type: 'error' })
    } else if (response.status >= 500 && response.status < 600) {
      MessageBox({ showClose: true, message: '服务器错误', type: 'error' })
    } else if (response.status === 200) {
      if (res.errorCode !== 0) {
        // MessageBox({ showClose: true, message: res.message, type: 'error' })
        Message({
          showClose: true,
          message: res.message,
          type: 'error'
        });
      } else {
        return response.data
      }
    } else {
      // MessageBox({ showClose: true, message: '访问错误', type: 'error' })
      Message({
        showClose: true,
        message: '访问错误',
        type: 'error'
      });
    }
  },
  error => {
    console.log('error：' + error) // for debug
    // localStorage.removeItem('Website-Manage-Token')
    // return Promise.reject(error)
    alert(error)
  }
)

export default service
