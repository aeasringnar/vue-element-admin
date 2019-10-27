
<template>
  <div class="app-container">
    <el-row>
      <el-col :span="10">
        <el-button v-if="$store.getters.user_obj.group.group_type === 'SuperAdmin' || $store.getters.auth_json.user.auth_create" size="small" type="primary" @click="new_data">新增</el-button>
        <p></p>
      </el-col>
      <el-col :span="8"><p/></el-col>
      <!-- <el-col :span="4">
        <el-select size="small" v-model="my_pagination.search_type" placeholder="请选择" style="width: 100%" @change="filter_change">
          <el-option label="全部分类" value=""/>
          <el-option label="测试分类" value="0"/>
          <el-option label="测试分类" value="1"/>
        </el-select>
      </el-col> -->
      <el-col :span="6">
        <mysearch v-model="my_pagination.search" @searchData="to_search"/>
      </el-col>
    </el-row>
    <!-- <br> -->
    <el-table
      :data="page_datas"
      height="calc(100vh - 230px)"
      border
      stripe
      style="width: 100%">
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="mobile" label="手机号"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="real_name" label="姓名"/>
      <el-table-column prop="group.group_type" label="角色"/>
      <el-table-column prop="bf_logo_time" label="上次登录时间"/>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-row v-if="$store.getters.user_obj.group.group_type === 'SuperAdmin' || $store.getters.auth_json.user.auth_update">
            <el-button size="small" @click="edit_data(scope.row)">编辑</el-button>
          </el-row>
          <el-row v-if="$store.getters.user_obj.group.group_type === 'SuperAdmin' || $store.getters.auth_json.user.auth_destroy" style="margin-top: 10px;">
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
      width="60%"
      center>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input size="small" v-model="ruleForm.username"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input size="small" type="password" v-model="ruleForm.password"/>
          </el-form-item>
          <el-form-item label="角色" prop="group">
            <el-select size="small" v-model="ruleForm.group" placeholder="请选择角色" filterable clearable style="width: 100%;">
              <el-option label="超级管理员" :value="1"/>
              <el-option label="管理员" :value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="权限" prop="auth">
            <el-select size="small" v-model="ruleForm.auth" placeholder="请选择权限" filterable clearable style="width: 100%;">
              <el-option v-for="item in auth_datas" :key="item.id" :label="item.auth_type" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input size="small" v-model="ruleForm.mobile"/>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input size="small" v-model="ruleForm.email"/>
          </el-form-item>
          <el-form-item label="姓名" prop="real_name">
            <el-input size="small" v-model="ruleForm.real_name"/>
          </el-form-item>
          <el-form-item label="状态" required>
            <el-switch size="small"
              v-model="ruleForm.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input size="small" v-model="ruleForm.content" type="textarea"/>
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
      <div style="text-align: center;">是否确认删除，删除后不可恢复？</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="centerDialog_delete = false">取 消</el-button>
        <el-button size="small" type="danger" @click="true_delete">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="centerDialog_patch"
      v-dialogDrag
      title="编辑"
      width="60%"
      center>
      <div>
        <el-form ref="ruleForm_patch" :model="ruleForm_patch" :rules="rules" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input size="small" v-model="ruleForm_patch.username"/>
          </el-form-item>
          <el-form-item label="密码">
            <el-input size="small" type="password" v-model="ruleForm_patch.password"/>
          </el-form-item>
          <el-form-item label="角色" prop="group">
            <el-select size="small" v-model="ruleForm_patch.group" placeholder="请选择角色" filterable clearable style="width: 100%;">
              <el-option label="超级管理员" :value="1"/>
              <el-option label="管理员" :value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="权限" prop="auth">
            <el-select size="small" v-model="ruleForm_patch.auth" placeholder="请选择权限" filterable clearable style="width: 100%;">
              <el-option v-for="item in auth_datas" :key="item.id" :label="item.auth_type" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input size="small" v-model="ruleForm_patch.mobile"/>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input size="small" v-model="ruleForm_patch.email"/>
          </el-form-item>
          <el-form-item label="姓名" prop="real_name">
            <el-input size="small" v-model="ruleForm_patch.real_name"/>
          </el-form-item>
          <el-form-item label="状态" required>
            <el-switch size="small"
              v-model="ruleForm_patch.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input size="small" v-model="ruleForm_patch.content" type="textarea"/>
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
import UploadImage from '@/components/Upload/singleImage.vue'// 单一图片
import MultiImage from '@/components/Upload/multiImage.vue' // 多张图片 limit 默认为5张
import UploadFile from '@/components/Upload/singleFile.vue' // 单一&多个文件 由limit参数 控制 默认为3个
import cropperImage from '@/components/Upload/cropperImage.vue' // 支持剪裁的图片上传组件
import Tinymce from '@/components/Tinymce/index.vue'

export default {
  name: 'userManage',
  components: { Mysearch, Pagination, UploadImage, MultiImage, UploadFile, cropperImage, Tinymce },
  data() {
    return {
      centerDialog: false,
      centerDialog_delete: false,
      centerDialog_patch: false,
      page_datas: [],
      ruleForm: {
        username: '',
        password: '',
        mobile: '',
        email: '',
        content: '',
        auth: '',
        status: false,
        group: '',
        real_name: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        real_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        group: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        auth: [
          { required: true, message: '请选择权限', trigger: 'change' }
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
      },
      auth_datas: []
    }
  },
  created: function() {
    this.get_need_data(this.my_pagination)
    this.get_auth_data()
  },
  methods: {
    get_need_data(params) {
      GetAjax('/user/', params).then(response => {
        const data = response.data
        console.log('得到列表数据：',data)
        this.page_datas = data
        this.my_pagination.count = response.count
      })
    },
    get_auth_data(params) {
      GetAjax('/auth/', params).then(response => {
        this.auth_datas = response.data
      })
    },
    post_need_data(data) {
      PostAjax('/user/', data).then(response => {
        const data = response.data
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
      PatchAjax('/user/' + data.id + '/', data).then(response => {
        const data = response.data
        this.centerDialog_patch = false
        this.$message({
          showClose: true,
          message: '修改成功！',
          type: 'success'
        })
        this.get_need_data(this.my_pagination)
      })
    },
    delete_need_data(data) {
      DeleteAjax('/user/' + data.id + '/', data).then(response => {
        const data = response.data
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
      this.delete_data = { id: row.id }
      console.log(this.delete_data)
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
      this.ruleForm_patch.group = row.group.id
      if (row.auth) {
        this.ruleForm_patch.auth = row.auth.id
      }
      this.centerDialog_patch = true
    },
    // 搜索层相关
    to_search() {
      this.my_pagination.page = 1
      this.get_need_data(this.my_pagination)
    },
    // 分页相关
    pag_change() {
      this.get_need_data(this.my_pagination)
    },
    // 过滤相关
    filter_change(val) {
      this.my_pagination.page = 1
      this.my_pagination.search_type = val
      this.get_need_data(this.my_pagination)
    }
  }
}
</script>

<style scoped>
</style>  
