<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" size="small" @click="new_data">新增</el-button>
        <el-button size="small" @click="centerDialogVisible_patch = true">编辑</el-button>
      </el-col>
      <el-col :span="10"><p/></el-col>
      <el-col :span="4">
        <el-select v-model="my_pagination.search_type" size="small" placeholder="请选择" style="width: 100%" @change="change_one">
          <el-option label="全部分类" value=""/>
          <el-option label="测试分类" value="0"/>
          <el-option label="测试分类" value="1"/>
        </el-select>
      </el-col>
      <el-col :span="6">
        <mysearch @searchData="to_search"/>
      </el-col>
    </el-row>
    <br>
    <el-table
      :data="page_datas"
      border
      stripe
      style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"/>
      <el-table-column prop="title" label="标题" width="180"/>
      <el-table-column prop="slot" label="图片" width="200">
        <template slot-scope="scope">
          <img :src="scope.row.img_url" height="80" width="180" >
        </template>
      </el-table-column>
      <el-table-column prop="h5_url" label="链接"/>
      <el-table-column prop="updated" label="更新时间" width="140"/>
      <el-table-column prop="sort" label="排序" width="80">
        <template slot-scope="scope">
          <!-- :active-value="0"
                        :inactive-value="1" -->
          <el-switch
            v-model="scope.row.sort"
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"/>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-button size="small" @click="edit_data(scope.row)">编辑</el-button>
          </el-row>
          <el-row style="margin-top: 10px;">
            <el-button type="danger" size="small" @click="delete_data_fuc(scope.row)">删除</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <pagination :total="page_tatol" :page.sync="my_pagination.page" :page_size.sync="my_pagination.page_size" @pagination="pag_change"/>
    <tinymce :upload-url="action_url" v-model="tt_html"/>
    <el-button size="small" @click="look_tinymce">查看</el-button>
    <el-button size="small" @click="export_xls">导出</el-button>

    <el-dialog
      :visible.sync="centerDialogVisible"
      title="新增"
      width="50%"
      center>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
          <el-form-item label="标题" prop="title">
            <el-input v-model="ruleForm.title"/>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model.number="ruleForm.sort"/>
          </el-form-item>
          <el-form-item label="区域" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域" style="width: 100%;">
              <el-option label="区域一" value="1"/>
              <el-option label="区域二" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" required>
            <el-switch
              v-model="ruleForm.is_status"
              active-color="#13ce66"
              inactive-color="#ff4949" />
          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-date-picker v-model="ruleForm.date" type="date" placeholder="选择日期" style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="时间" prop="time">
            <el-time-picker v-model="ruleForm.time" type="fixed-time" placeholder="选择时间" style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="0" name="type">类型01</el-checkbox>
              <el-checkbox label="1" name="type">类型02</el-checkbox>
              <el-checkbox label="2" name="type">类型03</el-checkbox>
              <el-checkbox label="3" name="type">类型04</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="图片" prop="img_url">
            <el-upload
              :action="action_url"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              class="avatar-uploader">
              <img v-if="ruleForm.img_url" :src="ruleForm.img_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
          <el-form-item label="内容" prop="desc">
            <el-input v-model="ruleForm.desc" type="textarea"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="centerDialogVisible_two"
      title="确认删除"
      width="30%"
      center>
      <div style="text-align: center;">是否确认删除，删除后不可恢复？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible_two = false">取 消</el-button>
        <el-button type="primary" @click="true_delete">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="centerDialogVisible_patch"
      title="编辑"
      width="50%"
      center>
      <div>
        <el-form ref="ruleForm_patch" :model="ruleForm_patch" :rules="rules_patch" label-width="80px" class="demo-ruleForm">
          <el-form-item label="标题" prop="title">
            <el-input v-model="ruleForm_patch.title"/>
          </el-form-item>
          <el-form-item label="H5链接" prop="h5_url">
            <el-input v-model="ruleForm_patch.h5_url"/>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model.number="ruleForm_patch.sort"/>
          </el-form-item>
          <el-form-item label="图片" required>
            <el-upload
              :action="action_url"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccess_two"
              :before-upload="beforeAvatarUpload"
              class="avatar-uploader">
              <img v-if="ruleForm_patch.img_url" :src="ruleForm_patch.img_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm_patch')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm_patch')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import Vue from 'vue'
import { GetAjax, PostAjax, PatchAjax, DeleteAjax } from '@/api/myapi'
import { exportXls } from '@/api/export'
import datetime from 'date-and-time'
import Pagination from '@/components/Pagination'
import Mysearch from '@/components/SearchField'
import Tinymce from '@/components/Tinymce'
import axios from 'axios'

export default {
  name: 'DemoManage',
  components: { Pagination, Mysearch, Tinymce },
  data() {
    return {
      centerDialogVisible: false,
      centerDialogVisible_two: false,
      centerDialogVisible_patch: false,
      page_datas: [],
      ruleForm: {
        title: '',
        img_url: '',
        region: '',
        type: [],
        is_status: false,
        sort: '',
        date: '',
        time: '',
        desc: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        img_url: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        sort: [
          { required: true, type: 'number', message: '请输入排序序号', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ],
        date: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        time: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      ruleForm_patch: {
        title: '',
        img_url: '',
        banner_type: 0,
        sort: '',
        h5_url: 'null'
      },
      rules_patch: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        sort: [
          { required: true, type: 'number', message: '请输入排序序号', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ],
        h5_url: [
          { required: true, message: '请输入H5链接', trigger: 'blur' }
        ]
      },
      headers: { 'Authorization': 'bearer ' + store.getters.token },
      action_url: process.env.BASE_API + '/uploadfile/',
      tt_html: '',
      delete_data: {},
      page_tatol: 100,
      my_pagination: {
        page: 1,
        page_size: 10,
        search: '',
        search_type: ''
      }
    }
  },
  created: function() {
    this.get_need_data(this.my_pagination)
  },
  methods: {
    get_need_data(params) {
      GetAjax('/company/', params).then(response => {
        const data = response.data
        console.log(data)
        this.page_datas = data
        this.page_tatol = response.count
      }).catch(error => {
        alert(error)
      })
    },
    post_need_data(data) {
      PostAjax('/company/', data).then(response => {
        const data = response.data
        console.log(data)
        this.centerDialogVisible = false
        this.$refs['ruleForm'].resetFields()
        this.ruleForm.img_url = ''
        this.$message({
          showClose: true,
          message: 'success',
          type: 'success'
        })
        this.get_need_data(this.my_pagination)
      }).catch(error => {
        alert(error)
      })
    },
    patch_need_data(data) {
      PatchAjax('/company/' + data.id + '/', data).then(response => {
        const data = response.data
        console.log(data)
        this.centerDialogVisible_patch = false
        this.$message({
          showClose: true,
          message: 'success',
          type: 'success'
        })
        this.get_need_data(this.my_pagination)
      }).catch(error => {
        alert(error)
      })
    },
    delete_need_data(data) {
      DeleteAjax('/company/' + data.id + '/', data).then(response => {
        const data = response.data
        console.log(data)
        this.centerDialogVisible_two = false
        this.$message({
          showClose: true,
          message: 'success',
          type: 'success'
        })
        this.get_need_data(this.my_pagination)
      }).catch(error => {
        alert(error)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName == 'ruleForm') {
            datetime.format(this.ruleForm.date, 'YYYY-MM-DD')
            console.log(datetime.format(this.ruleForm.time, 'HH:mm:ss'))
            console.log(this.ruleForm)
            // this.post_need_data(this.ruleForm)
          } else {
            console.log(this.ruleForm_patch)
            // this.patch_need_data(this.ruleForm_patch)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      console.log(formName)
      this.centerDialogVisible = false
      this.$refs[formName].resetFields()
      this.ruleForm.img_url = ''
      this.centerDialogVisible_patch = false
      this.ruleForm_patch.img_url = ''
    },
    handleAvatarSuccess(res, file) {
      // this.ruleForm.img_url = URL.createObjectURL(file.raw)
      this.ruleForm.img_url = file.response.data[0]
      console.log(file.response.data[0])
    },
    handleAvatarSuccess_two(res, file) {
      // this.ruleForm.img_url = URL.createObjectURL(file.raw)
      this.ruleForm_patch.img_url = file.response.data[0]
      console.log(file.response.data[0])
    },
    beforeAvatarUpload(file) {
      var img_type = ['image/jpeg', 'image/jpg', 'image/png']
      var img_index = img_type.indexOf(file.type)
      var isJPG = false
      if (img_index != -1) {
        isJPG = true
      }
      console.log(isJPG)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('允许的图片类型为 JPG / JPEG / PNG ！')
      }
      if (!isLt2M) {
        this.$message.error('允许的最大图片大小为 2MB！')
      }
      return isJPG && isLt2M
    },
    delete_data_fuc(row) {
      console.log(row)
      this.delete_data = row
      this.centerDialogVisible_two = true
    },
    new_data() {
      this.centerDialogVisible = true
    },
    true_delete() {
      this.delete_need_data(this.delete_data)
    },
    edit_data(row) {
      console.log(row)
      this.ruleForm_patch.title = row.title
      this.ruleForm_patch.h5_url = row.h5_url
      this.ruleForm_patch.sort = row.sort
      this.ruleForm_patch.img_url = row.img_url
      this.ruleForm_patch.id = row.id
      this.centerDialogVisible_patch = true
    },
    pag_change() {
      console.log(this.my_pagination)
      this.get_need_data(this.my_pagination)
    },
    to_search(val) {
      this.my_pagination.page = 1
      this.my_pagination.search = val
      this.get_need_data(this.my_pagination)
    },
    change_one(val) {
      this.get_need_data(this.my_pagination)
    },
    look_tinymce() {
      console.log('查看富文本：', this.tt_html)
    },
    export_xls() {
      const export_url = process.env.BASE_API + '/confdictexport/'
      exportXls({}, export_url, 'test.xlsx')
    }
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
</style>
