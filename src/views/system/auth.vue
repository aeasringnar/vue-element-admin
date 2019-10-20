
<template>
  <div class="app-container">
    <el-row>
      <el-col :span="10">
        <el-button v-if="$store.getters.user_obj.group.group_type === 'SuperAdmin' || $store.getters.auth_json.auth.auth_create" size="small" type="primary" @click="new_data">新增</el-button>
        <p></p>
      </el-col>
      <el-col :span="8"><p/></el-col>
      <!-- <el-col :span="4">
        <el-select size="small" v-model="my_pagination.search_type" placeholder="请选择" style="width: 100%" @change="my_change">
          <el-option label="全部分类" value=""/>
          <el-option label="测试分类" value="0"/>
          <el-option label="测试分类" value="1"/>
        </el-select>
      </el-col> -->
      <el-col :span="6">
        <mysearch v-model="my_pagination.search" @searchData="to_search"/>
      </el-col>
    </el-row>
    <br>
    <el-table
      :data="page_datas"
      border
      stripe
      style="width: 100%">
      <el-table-column prop="id" label="ID"/>
			<el-table-column prop="auth_type" label="权限名称"/>
			<el-table-column prop="slot" label="权限">
        <template slot-scope="scope">
          <span>{{ get_auth(scope.row.auth_permissions) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-row v-if="$store.getters.user_obj.group.group_type === 'SuperAdmin' || $store.getters.auth_json.auth.auth_update">
            <el-button size="small" @click="edit_data(scope.row)">编辑</el-button>
          </el-row>
          <el-row v-if="$store.getters.user_obj.group.group_type === 'SuperAdmin' || $store.getters.auth_json.auth.auth_destroy" style="margin-top: 10px;">
            <el-button size="small" type="danger" @click="delete_data_fuc(scope.row)">删除</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <pagination :total="my_pagination.count" :page.sync="my_pagination.page" :page_size.sync="my_pagination.page_size" @pagination="pag_change"/>

    <el-dialog
      :visible.sync="centerDialog"
      v-dialogDrag
      title="新增"
      width="50%"
      center>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
          <el-form-item label="权限名称" prop="auth_type">
            <el-input size="small" v-model="ruleForm.auth_type"/>
          </el-form-item>
          <h3>权限配置：</h3>
          <el-form-item label="全选">
            <el-switch
              v-model="is_all"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="all_change"/>
          </el-form-item>
          <el-form-item v-for="(data,index) in ruleForm.auth_permissions" :key="index" :label="data.object_name_cn + ':'">
            <el-row>
              <el-col v-if="data.auth_list != null" :span="6">
                <el-switch
                  v-model="data.auth_list"
                  active-color="#13ce66"
                  inactive-color="#ff4949"/>
                查看
              </el-col>
              <el-col v-if="data.auth_create != null" :span="6">
                <el-switch
                  v-model="data.auth_create"
                  active-color="#13ce66"
                  inactive-color="#ff4949"/>
                新增
              </el-col>
              <el-col v-if="data.auth_update != null" :span="6">
                <el-switch
                  v-model="data.auth_update"
                  active-color="#13ce66"
                  inactive-color="#ff4949"/>
                修改
              </el-col>
              <el-col v-if="data.auth_destroy != null" :span="6">
                <el-switch
                  v-model="data.auth_destroy"
                  active-color="#13ce66"
                  inactive-color="#ff4949"/>
                删除
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm('ruleForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="centerDialog_delete"
      v-dialogDrag
      title="确认删除"
      width="30%"
      center>
      <span>是否确认删除，删除后不可恢复？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="centerDialog_delete = false">取 消</el-button>
        <el-button size="small" type="primary" @click="true_delete">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="centerDialog_patch"
      title="编辑"
      width="50%"
      center>
      <div>
        <el-form ref="ruleForm_patch" :model="ruleForm_patch" :rules="rules_patch" label-width="100px">
          <el-form-item label="权限名称" prop="auth_type">
            <el-input size="small" v-model="ruleForm_patch.auth_type"/>
          </el-form-item>
          <h3>权限配置：</h3>
          <el-form-item v-for="(data,index) in ruleForm_patch.auth_permissions" :key="index" :label="data.object_name_cn + ':'">
            <el-row>
              <el-col v-if="data.auth_list != null" :span="6">
                <el-switch
                  v-model="data.auth_list"
                  active-color="#13ce66"
                  inactive-color="#ff4949"/>
                查看
              </el-col>
              <el-col v-if="data.auth_create != null" :span="6">
                <el-switch
                  v-model="data.auth_create"
                  active-color="#13ce66"
                  inactive-color="#ff4949"/>
                新增
              </el-col>
              <el-col v-if="data.auth_update != null" :span="6">
                <el-switch
                  v-model="data.auth_update"
                  active-color="#13ce66"
                  inactive-color="#ff4949"/>
                修改
              </el-col>
              <el-col v-if="data.auth_destroy != null" :span="6">
                <el-switch
                  v-model="data.auth_destroy"
                  active-color="#13ce66"
                  inactive-color="#ff4949"/>
                删除
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm('ruleForm_patch')">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm_patch')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
.el-table .cell {
  white-space: pre-line;
}
</style>
<script>
import store from '@/store'
import Vue from 'vue'
import { GetAjax, PostAjax, PatchAjax, DeleteAjax } from '@/api/myapi'
import datetime from 'date-and-time'
import Mysearch from '@/components/SearchField/index2.vue'
import Pagination from '@/components/Pagination'
import UploadImage from '@/components/Upload/singleImage.vue'
import UploadFile from '@/components/Upload/singleFile.vue'
// import Tinymce from '@/components/Tinymce/index.vue'

export default {
  name: 'authManage',
  components: { Mysearch, Pagination, UploadImage, UploadFile },
  data() {
    return {
      centerDialog: false,
      centerDialog_delete: false,
      centerDialog_patch: false,
      page_datas: [],
      ruleForm: {
        auth_type: '',
        auth_permissions: [
          {
            object_name: 'user',
            object_name_cn: '用户管理',
            auth_list: false,
            auth_create: false,
            auth_update: false,
            auth_destroy: false
          },
          {
            object_name: 'auth',
            object_name_cn: '权限管理',
            auth_list: false,
            auth_create: false,
            auth_update: false,
            auth_destroy: false
          },
          {
            object_name: 'flowgroup',
            object_name_cn: '审批组管理',
            auth_list: false,
            auth_create: false,
            auth_update: false,
            auth_destroy: false
          },
          {
            object_name: 'approvalflow',
            object_name_cn: '审批管理',
            auth_list: false,
            auth_create: false,
            auth_update: false,
            auth_destroy: false
          },
          {
            object_name: 'flowbody',
            object_name_cn: '审批主体',
            auth_list: false,
            auth_create: false,
            auth_update: false,
            auth_destroy: false
          }
        ]
      },
      is_all: false,
      rules: {
        auth_type: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
      },
      ruleForm_patch: {
        
      },
      rules_patch: {
        
      },
      delete_data: {},
      my_pagination: {
        page: 1,
        page_size: 10,
        count: 0,
        search: '',
        search_type: '',
      }
    }
  },
  created: function() {
    this.get_need_data(this.my_pagination)
  },
  methods: {
    get_need_data(params) {
      GetAjax('/auth/', params).then(response => {
        const data = response.data
        console.log(data)
        this.page_datas = data
        this.my_pagination.count = response.count
      })
    },
    post_need_data(data) {
      PostAjax('/auth/', data).then(response => {
        const data = response.data
        console.log(data)
        this.centerDialog = false
        this.$refs['ruleForm'].resetFields()
        this.$message({
          showClose: true,
          message: '新增成功！',
          type: 'success'
        })
        this.get_need_data(this.my_pagination)
      })
    },
    patch_need_data(data) {
      PatchAjax('/auth/' + data.id + '/', data).then(response => {
        const data = response.data
        console.log(data)
        this.centerDialog_patch = false
        // this.$refs['ruleForm_path'].resetFields()
        this.$message({
          showClose: true,
          message: '修改成功！',
          type: 'success'
        })
        this.get_need_data(this.my_pagination)
      })
    },
    delete_need_data(data) {
      DeleteAjax('/auth/' + data.id + '/', data).then(response => {
        const data = response.data
        console.log(data)
        this.centerDialog_delete = false
        this.$message({
          showClose: true,
          message: '删除成功！',
          type: 'success'
        })
        this.get_need_data(this.my_pagination)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName == 'ruleForm') {
            // datetime.format(this.ruleForm.date, 'YYYY-MM-DD')
            // console.log(datetime.format(this.ruleForm.time, 'hh:mm:ss'))
            console.log(this.ruleForm)
            this.post_need_data(this.ruleForm)
          } else {
            console.log(this.ruleForm_patch)
            this.patch_need_data(this.ruleForm_patch)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // form数据验证
    resetForm(formName) {
      console.log(formName)
      this.centerDialog = false
      this.centerDialog_patch = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    delete_data_fuc(row) {
      console.log(row)
      this.delete_data = row
      this.centerDialog_delete = true
    },
    // 新增按钮
    new_data() {
      this.centerDialog = true
    },
    // 确定删除按钮
    true_delete() {
      this.delete_need_data(this.delete_data)
    },
    // 编辑按钮
    edit_data(row) {
      console.log(row)
      this.ruleForm_patch = JSON.parse(JSON.stringify(row))
      for (var i in this.ruleForm.auth_permissions) {
        var is_have = false
        for (var j in this.ruleForm_patch.auth_permissions) {
          if (this.ruleForm.auth_permissions[i].object_name === this.ruleForm_patch.auth_permissions[j].object_name) {
            is_have = true
            break
          }
        }
        if (!is_have) {
          this.ruleForm_patch.auth_permissions.push(this.ruleForm.auth_permissions[i])
        }
      }
      this.centerDialog_patch = true
    },
    // 搜索层相关
    to_search() {
      this.my_pagination.page = 1
      console.log(this.my_pagination.search)
      this.get_need_data(this.my_pagination)
    },
    pag_change() {
      console.log(this.my_pagination)
      this.get_need_data(this.my_pagination)
    },
    search_change() {
      console.log(this.my_pagination.search)
      this.get_need_data(this.my_pagination)
    },
    my_change(val) {
      this.my_pagination.page = 1
      this.my_pagination.search_type = val
      console.log(this.my_pagination.search_type)
      this.get_need_data(this.my_pagination)
    },
    all_change(val) {
      console.log(val)
      if (val) {
        for (var i in this.ruleForm.auth_permissions) {
          if (this.ruleForm.auth_permissions[i].auth_list != null) {
            this.ruleForm.auth_permissions[i].auth_list = true
          }
          if (this.ruleForm.auth_permissions[i].auth_create != null) {
            this.ruleForm.auth_permissions[i].auth_create = true
          }
          if (this.ruleForm.auth_permissions[i].auth_update != null) {
            this.ruleForm.auth_permissions[i].auth_update = true
          }
          if (this.ruleForm.auth_permissions[i].auth_destroy != null) {
            this.ruleForm.auth_permissions[i].auth_destroy = true
          }
        }
      } else {
        for (var i in this.ruleForm.auth_permissions) {
          if (this.ruleForm.auth_permissions[i].auth_list != null) {
            this.ruleForm.auth_permissions[i].auth_list = false
          }
          if (this.ruleForm.auth_permissions[i].auth_create != null) {
            this.ruleForm.auth_permissions[i].auth_create = false
          }
          if (this.ruleForm.auth_permissions[i].auth_update != null) {
            this.ruleForm.auth_permissions[i].auth_update = false
          }
          if (this.ruleForm.auth_permissions[i].auth_destroy != null) {
            this.ruleForm.auth_permissions[i].auth_destroy = false
          }
        }
      }
    },
    get_auth(auth_permissions) {
      var auth_str = ''
      for (var i in auth_permissions) {
        auth_str += auth_permissions[i].object_name_cn
        if (auth_permissions[i].auth_list || auth_permissions[i].auth_create || auth_permissions[i].auth_update || auth_permissions[i].auth_destroy) {
          if (auth_permissions[i].auth_list) {
            auth_str += '：查看'
          }
          if (auth_permissions[i].auth_create) {
            auth_str += '，新增'
          }
          if (auth_permissions[i].auth_update) {
            auth_str += '，修改'
          }
          if (auth_permissions[i].auth_destroy) {
            auth_str += '，删除'
          }
          auth_str += '；\n'
        } else {
          auth_str += '：无；\n'
        }
      }
      return auth_str
    }
  }
}
</script>

<style scoped>
</style>  
