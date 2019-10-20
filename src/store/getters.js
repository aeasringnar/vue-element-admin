const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  auth_json: state => state.user.auth_json,
  user_obj: state => state.user.user_obj,
  visitedViews: state => state.tagsView.visitedViews
}
export default getters
