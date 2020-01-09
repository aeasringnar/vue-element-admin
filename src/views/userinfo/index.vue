<template>
  <div class="app-container">
    <el-table
      :data="page_datas"
      border
      stripe
      style="width: 100%">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="realname" label="角色">
        <template slot-scope="scope">
          <template v-if="scope.row.group != null">
            <span>{{ scope.row.group.group_type }}</span>
          </template>
          <template v-else>
            <span>无</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="real_name" label="姓名"/>
      <el-table-column prop="mobile" label="手机"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="bf_logo_time" label="上次登录时间" width="155"/>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="edit_data(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="centerDialog_patch"
      title="修改个人信息"
      width="50%"
      center>
      <div>
        <el-form ref="ruleForm_patch" :model="ruleForm_patch" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username" style="width: 80%;">
          <el-input size="small" v-model="ruleForm_patch.username"/>
        </el-form-item>
        <el-form-item label="密码" style="width: 80%;">
          <!-- <el-input size="small" type="password" v-model="ruleForm_patch.password"/> -->
          <el-input
            size="small"
            :type="pwdType"
            v-model="ruleForm_patch.password"
            auto-complete="on"
            placeholder="请输入密码"/>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="show_icon" />
          </span>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" style="width: 80%;">
          <el-input size="small" v-model="ruleForm_patch.mobile"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" style="width: 80%;">
          <el-input size="small" v-model="ruleForm_patch.email"/>
        </el-form-item>
        <el-form-item label="姓名" prop="real_name" style="width: 80%;">
          <el-input size="small" v-model="ruleForm_patch.real_name"/>
        </el-form-item>
        <el-form-item label="备注" style="width: 80%;">
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

<script>
import store from '@/store'
import Vue from 'vue'
import { GetAjax, PatchAjax } from '@/api/myapi'
import datetime from 'date-and-time'

export default {
  name: "userinfo",
  data () {
    return {
      page_datas: [],
      centerDialog_patch: false,
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
      },
      ruleForm_patch: {},
      pwdType: 'password',
      show_icon: 'eye'
    }
  },
  created: function() {
    this.get_need_data()
  },
  methods: {
    get_need_data(params) {
      GetAjax('/userinfo/',params).then(response => {
        const data = response.data
        console.log(data)
        this.page_datas = [data]
      })
    },
    patch_need_data(data) {
      PatchAjax('/user/' + data.id + '/', data).then(response => {
        const data = response.data
        console.log(data)
        this.centerDialog_patch = false
        // this.$refs['ruleForm_patch'].resetFields()
        this.$message({
          showClose: true,
          message: '修改成功！',
          type: 'success'
        })
        this.get_need_data()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName == 'ruleForm_patch') {
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
      this.centerDialog_patch = false
      this.$refs[formName].resetFields()
    },
    edit_data(row) {
      console.log(row)
      this.ruleForm_patch = JSON.parse(JSON.stringify(row))
      this.ruleForm_patch.group = row.group.id
      if (row.auth) {
        this.ruleForm_patch.auth = row.auth.id
      }
      this.centerDialog_patch = true
    },
    // 是否显示密码按钮
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
        this.show_icon = 'eye_show'
      } else {
        this.pwdType = 'password'
        this.show_icon = 'eye'
      }
    },
  }
}
</script>

<style scoped>
/*.el-upload*/
.avatar-uploader {
  height: 180px;
  width: 250px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 248px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 180px;
  display: block;
  border-radius: 6px;
}
.show-pwd {
  position: absolute;
  right: 15px;
  top: 2px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
</style>