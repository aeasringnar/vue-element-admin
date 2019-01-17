import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/website/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/website/userinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/website/logout',
    method: 'post'
  })
}
