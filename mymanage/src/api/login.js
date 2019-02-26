import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/shopbase/adminlogin',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/shopbase/adminuserinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/website/logout',
    method: 'post'
  })
}
