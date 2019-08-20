<template>
  <div class="app-container">
    <el-row>
      <el-col :span="10">
        <el-button size="small" type="primary" @click="new_data">新增</el-button>
        <el-button size="small" @click="centerDialog_patch = true">编辑</el-button>
      </el-col>
      <el-col :span="4"><p/></el-col>
      <el-col :span="4">
        <el-select size="small" v-model="my_pagination.search_type" placeholder="请选择" style="width: 100%" @change="my_change">
          <el-option label="全部分类" value=""/>
          <el-option label="测试分类" value="0"/>
          <el-option label="测试分类" value="1"/>
        </el-select>
      </el-col>
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
      <el-table-column prop="id" label="ID" width="80"/>
      <el-table-column prop="title" label="标题" width="180"/>
      <el-table-column prop="slot" label="图片" width="200">
        <template slot-scope="scope">
          <img :src="scope.row.img_url" height="80" width="180" >
        </template>
      </el-table-column>
      <el-table-column prop="h5_url" label="链接"/>
      <el-table-column prop="updated" label="更新时间" width="160"/>
      <el-table-column prop="sort" label="排序" width="80">
        <template slot-scope="scope">
          <el-switch size="small"
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
          <el-form-item label="标题" prop="title">
            <el-input size="small" v-model="ruleForm.title"/>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input size="small" v-model.number="ruleForm.sort"/>
          </el-form-item>
          <el-form-item label="区域" prop="region">
            <el-select size="small" v-model="ruleForm.region" placeholder="请选择活动区域" filterable clearable style="width: 100%;">
              <el-option label="区域一" value="1"/>
              <el-option label="区域二" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" required>
            <el-switch size="small"
              v-model="ruleForm.is_status"
              active-color="#13ce66"
              inactive-color="#ff4949" />
          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-date-picker size="small" v-model="ruleForm.date" type="date" placeholder="选择日期" style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="时间" prop="time">
            <el-time-picker size="small" v-model="ruleForm.time" type="fixed-time" placeholder="选择时间" style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-checkbox-group size="small" v-model="ruleForm.type">
              <el-checkbox label="0" name="type">类型01</el-checkbox>
              <el-checkbox label="1" name="type">类型02</el-checkbox>
              <el-checkbox label="2" name="type">类型03</el-checkbox>
              <el-checkbox label="3" name="type">类型04</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="图片" prop="img_url">
            <upload-image v-model="ruleForm.img_url"/>
          </el-form-item>
          <el-form-item label="文件" prop="rule_file">
            <upload-file v-model="ruleForm.rule_file"/>
          </el-form-item>
          <el-form-item label="内容">
            <el-input size="small" v-model="ruleForm.desc" type="textarea"/>
          </el-form-item>
          <el-form-item label="富文本编辑器" prop="rule_h5">
            <!-- <tinymce v-model="ruleForm.rule_h5"/> -->
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
.el-table .cell .el-tooltip {
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
  name: 'DemoManage',
  components: { Mysearch, Pagination, UploadImage, UploadFile },
  data() {
    return {
      centerDialog: false,
      centerDialog_delete: false,
      centerDialog_patch: false,
      page_datas: [],
      ruleForm: {
        title: '',
        img_url: '',
        rule_file: '',
        rule_h5: '',
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
      GetAjax('/user/', params).then(response => {
        const data = response.data
        console.log(data)
        this.page_datas = data
        // this.my_pagination.count = response.tatol
        this.my_pagination.count = 100
      })
    },
    post_need_data(data) {
      PostAjax('/user/', data).then(response => {
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
      PatchAjax('/user/', data).then(response => {
        const data = response.data
        console.log(data)
        this.centerDialog_patch = false
        this.$refs['ruleForm'].resetFields()
        this.$message({
          showClose: true,
          message: '修改成功！',
          type: 'success'
        })
        this.get_need_data(this.my_pagination)
      })
    },
    delete_need_data(data) {
      DeleteAjax('/user/', data).then(response => {
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
      this.ruleForm_patch.title = row.title
      this.ruleForm_patch.h5_url = row.h5_url
      this.ruleForm_patch.sort = row.sort
      this.ruleForm_patch.img_url = row.img_url
      this.ruleForm_patch.id = row.id
      this.centerDialog_patch = true
    },
    // 搜索层相关
    to_search() {
      this.my_pagination.page = 1
      console.log(this.my_pagination.search)
      // this.get_need_data(this.my_pagination)
    },
    pag_change() {
      console.log(this.my_pagination)
      // this.get_need_data(this.my_pagination)
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
