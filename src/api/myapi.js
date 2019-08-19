import request from '@/utils/request'

// 上传文件
export function uploadfile(data) {
  return request({
    url: '/website/uploadfile',
    method: 'post',
    data: data
  })
}

// 第二版本的异步请求
// get 请求数据
export function GetAjax(url, params) {
  return request({
    url: url,
    method: 'get',
    params: params
  })
}
// post 提交数据
export function PostAjax(url, data) {
  return request({
    url: url,
    method: 'post',
    data: data
  })
}
// patch 修改数据
export function PatchAjax(url, data) {
  return request({
    url: url,
    method: 'patch',
    data: data
  })
}
// put 修改数据
export function PutAjax(url, data) {
  return request({
    url: url,
    method: 'put',
    data: data
  })
}
// delete 删除数据
export function DeleteAjax(url, data) {
  return request({
    url: url,
    method: 'delete',
    data: data
  })
}
