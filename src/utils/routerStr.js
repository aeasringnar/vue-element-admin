function creatRouter(obj_list) {
  var str = `[`
  for(let i in obj_list){
    var childPath = ``
    for (let j in obj_list[i].childs) {
      childPath += `
      {
        path: '${obj_list[i].childs[j].object_name}',
        name: '${obj_list[i].childs[j].object_name}',
        component: () => import('@/views/${obj_list[i].dir_name}/${obj_list[i].childs[j].object_name}'),
        meta: { title: '${obj_list[i].childs[j].object_name}', icon: 'form' }
      },`
    }
    str += `
  {
    path: '/${obj_list[i].dir_name}',
    meta: { title: '${obj_list[i].dir_name}', icon: 'form' },
    component: Layout,
    children: [
      ${childPath}
    ]
  },`
  }
  str += `\n]`
  return str
}

module.exports.creatRouter = creatRouter