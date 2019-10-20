import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router from '../../router'

function handleRouters(routers, auth_json) {
  const whiteList = ['/login', '/404', '/', '*', 'dashboard']
  const auth = auth_json
  function handleOneRouter(router) {
    if (!router.children) {
      if (whiteList.indexOf(router.path) === -1) {
        if (auth[router.name]) {
          if (auth[router.name].auth_list) {
            router.hidden = false
          } else {
            router.hidden = true
          }
        } else {
          router.hidden = true
        }
      }
      return 1
    } else {
      var count = 1
      for (var i in router.children) {
        count += handleOneRouter(router.children[i])
        if (router.children[i].children) {
          var len = router.children[i].children.length
          var false_len = 0
          for (let j in router.children[i].children) {
            if (router.children[i].children[j].hidden) {
              false_len++
            }
          }
          if (len === false_len) {
            router.children[i].hidden = true
          } else {
            router.children[i].hidden = false
          }
        }
      }
      return count
    }
  }
  var need_handle_routers = { children: routers }
  handleOneRouter(need_handle_routers)
  return need_handle_routers.children
}

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: '',
    auth_json: {},
    routers: router,
    user_obj: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_OBJ: (state, user_obj) => {
      state.user_obj = user_obj
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_AUTHS: (state, auths) => {
      var auth_obj = {}
      for (let i in auths) {
        auth_obj[auths[i].object_name] = {
          auth_create: auths[i].auth_create,
          auth_list: auths[i].auth_list,
          auth_update: auths[i].auth_update,
          auth_destroy: auths[i].auth_destroy
        }
      }
      state.auth_json = auth_obj
    },
    SET_ROUTE: (state, routers) => {
      state.routers = routers
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
          // alert(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          console.log(data)
          commit('SET_USER_OBJ', data)
          commit('SET_NAME', data.username)
          commit('SET_ROLES', data.group.group_type)
          commit('SET_AVATAR', data.img_url)
          if (data.group.group_type !== 'SuperAdmin') {
            commit('SET_AUTHS', data.auth.auth_permissions)
            console.log('查看auths：', state.auth_json)
            console.log(router.options.routes)
            var my_router = handleRouters(router.options.routes, state.auth_json)
            console.log(my_router)
            router.options.routes = my_router
            commit('SET_ROUTE', router)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        router.push({path: '/login'})
        removeToken()
        resolve()
      })
    }
  }
}

export default user
