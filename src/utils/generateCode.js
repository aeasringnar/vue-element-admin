const path = require('path');
const fs = require('fs');
const vueCode = require('./codeStr');
const router = require('./routerStr');
// console.log(__dirname);  // 当前文件所在的绝对路径。
// console.log(__filename);  // 当前文件的文件名,包括全路径。  __dirname和__filename都是全局对象。


// 写入主体
var obj_list = [
  {
    dir_name:'system',
    dir_name_cn:'系统管理',
    childs: [
      {
        object_name:'group',
        object_name_cn:'用户组管理',
        fields:[
          {prop:'id',label:'ID'},
          {prop:'group_type',label:'角色类型'},
        ]
      },
      {
        object_name:'user',
        object_name_cn:'用户管理',
        fields:[
          {prop:'id',label:'ID'},
          {prop:'username',label:'用户名'}
        ]
      }
    ]
  },
  {
    dir_name:'info',
    dir_name_cn:'信息管理',
    childs: [
      {
        object_name:'company',
        object_name_cn:'公司管理',
        fields:[
          {prop:'id',label:'ID'},
          {prop:'name',label:'公司名称'}
        ]
      },
      {
        object_name:'employ',
        object_name_cn:'员工管理',
        fields:[
          {prop:'id',label:'ID'},
          {prop:'real_name',label:'员工名称'}
        ]
      }
    ]
  }
]


// 写入vue文件的函数
function writeCode(dir_path, data, dir_name) {
  const file_path = dir_path + '/' + data.object_name + '.vue'
  fs.writeFile(file_path, vueCode.creatCode(data, dir_name), (err) => {
    if (err) throw err
    console.log('文件:' + String(file_path) + '已被保存...')
  })
}

// 写入路由文件的函数
function writeRouter(file_path, data) {
  fs.writeFile(file_path, data, (err) => {
    if (err) throw err
    console.log('文件:' + String(file_path) + '已被保存...')
  })
}

// 主体函数
function creatCode(obj_list) {
  for (let i in obj_list) {
    // 创建目录
    const base_path = __dirname + '/my_view'
    const dir_path = base_path + '/' + obj_list[i].dir_name
    const router_path = base_path + '/router.js'
    fs.mkdir(dir_path, { recursive: true }, (err) => {
      if (err) throw err
      for (let j in obj_list[i].childs) {
        writeCode(dir_path, obj_list[i].childs[j], obj_list[i].dir_name)
      }
      writeRouter(router_path, router.creatRouter(obj_list))
    })
  }
}

// 运行主体函数
creatCode(obj_list)
