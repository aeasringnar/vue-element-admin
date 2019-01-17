import request from '@/utils/request'

export function uploadfile(data) {
    return request({
        url: '/website/uploadfile',
        method: 'post',
        data: data
    })
}

// 首页 banner
export function get_banner(pk,page,page_size) {
    return request({
        url: '/website/banner',
        method: 'get',
        params: {
            pk,
            page,
            page_size
        }
    })
}
export function post_banner(data) {
    return request({
      url: '/website/banner',
      method: 'post',
      data: data
    })
}
export function patch_banner(data) {
    return request({
      url: '/website/banner',
      method: 'patch',
      data: data
    })
}
export function delete_banner(data) {
    return request({
      url: '/website/banner',
      method: 'delete',
      data: data
    })
}

// 首页 bannerbottom
export function get_bannerbottom(pk,page,page_size) {
    return request({
        url: '/website/bannerbottom',
        method: 'get',
        params: {
            pk,
            page,
            page_size
        }
    })
}
export function post_bannerbottom(data) {
    return request({
      url: '/website/bannerbottom',
      method: 'post',
      data: data
    })
}
export function patch_bannerbottom(data) {
    return request({
      url: '/website/bannerbottom',
      method: 'patch',
      data: data
    })
}
export function delete_bannerbottom(data) {
    return request({
      url: '/website/bannerbottom',
      method: 'delete',
      data: data
    })
}

// 国内研学 tourdomestic
export function get_tourdomestic(pk,page,page_size) {
    return request({
        url: '/website/tourdomestic',
        method: 'get',
        params: {
            pk,
            page,
            page_size
        }
    })
}
export function post_tourdomestic(data) {
    return request({
      url: '/website/tourdomestic',
      method: 'post',
      data: data
    })
}
export function patch_tourdomestic(data) {
    return request({
      url: '/website/tourdomestic',
      method: 'patch',
      data: data
    })
}
export function delete_tourdomestic(data) {
    return request({
      url: '/website/tourdomestic',
      method: 'delete',
      data: data
    })
}

// 国外游学 tourforeign
export function get_tourforeign(pk,page,page_size) {
    return request({
        url: '/website/tourforeign',
        method: 'get',
        params: {
            pk,
            page,
            page_size
        }
    })
}
export function post_tourforeign(data) {
    return request({
      url: '/website/tourforeign',
      method: 'post',
      data: data
    })
}
export function patch_tourforeign(data) {
    return request({
      url: '/website/tourforeign',
      method: 'patch',
      data: data
    })
}
export function delete_tourforeign(data) {
    return request({
      url: '/website/tourforeign',
      method: 'delete',
      data: data
    })
}
export function logout() {
    return request({
        url: '/website/logout',
        method: 'post'
    })
}

// 动态资讯 dynamic
export function get_dynamic(pk,page,page_size) {
    return request({
        url: '/website/dynamic',
        method: 'get',
        params: {
            pk,
            page,
            page_size
        }
    })
}
export function post_dynamic(data) {
    return request({
      url: '/website/dynamic',
      method: 'post',
      data: data
    })
}
export function patch_dynamic(data) {
    return request({
      url: '/website/dynamic',
      method: 'patch',
      data: data
    })
}
export function delete_dynamic(data) {
    return request({
      url: '/website/dynamic',
      method: 'delete',
      data: data
    })
}