import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/adminlogin/',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return request({
    url: '/userinfo/',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout/',
    method: 'post'
  })
}
