function creatCode(obj, dir_name) {
  var fields = obj.fields
  var table_str = ``
  if (fields) {
      for(let i in fields){
          table_str += `<el-table-column prop="${fields[i].prop}" label="${fields[i].label}"/>\n\t\t\t\t`
      }
  } else {
      table_str = `<el-table-column prop="id" label="ID" width="80"/>
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
      </el-table-column>`
  }
  const str = `
<template>
  <div class="app-container">
    <el-row>
      <el-col :span="10">
        <el-button v-if="$store.getters.user_obj.group.group_type === 'SuperAdmin' || $store.getters.auth_json.${dir_name}_${obj.object_name}.auth_create" size="small" type="primary" @click="new_data">新增</el-button>
        <p></p>
      </el-col>
      <el-col :span="4"><p/></el-col>
      <el-col :span="4">
        <el-select size="small" v-model="my_pagination.search_type" placeholder="请选择" style="width: 100%" @change="filter_change">
          <el-option label="全部分类" value=""/>
          <el-option v-for="data in select_type" :key="data.key" :label="data.name" :value="data.key"/>
        </el-select>
      </el-col>
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
      ${table_str}
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-row v-if="$store.getters.user_obj.group.group_type === 'SuperAdmin' || $store.getters.auth_json.${dir_name}_${obj.object_name}.auth_update">
            <el-button size="small" @click="edit_data(scope.row)">编辑</el-button>
          </el-row>
          <el-row v-if="$store.getters.user_obj.group.group_type === 'SuperAdmin' || $store.getters.auth_json.${dir_name}_${obj.object_name}.auth_destroy" style="margin-top: 10px;">
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
            <el-date-picker size="small" v-model="ruleForm.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="时间" prop="time">
            <el-time-picker size="small" v-model="ruleForm.time" type="fixed-time" value-format="HH:mm:ss" placeholder="选择时间" style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="日期区间">
            <el-date-picker size="small" v-model="ruleForm.date_time" type="daterange" value-format="yyyy-MM-dd" 
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" 
            style="width: 100%;"/>
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
            <tinymce v-model="ruleForm.rule_h5"/>
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
import Tinymce from '@/components/Tinymce/index.vue'

export default {
  name: '${obj.object_name}Manage',
  components: { Mysearch, Pagination, UploadImage, MultiImage, UploadFile, Tinymce },
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
        date_time:'',
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
        rule_h5: [
          { required: true, message: '请输入富文本', trigger: 'change' }
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
      },
      select_type: [
        {
          key: '0',
          name:'分类一'
        },
        {
          key: '1',
          name:'分类二'
        }
      ]
    }
  },
  created: function() {
    // this.$route.params 路由跳转携带的参数 $router.go(-1) 返回上一级
    // this.$router.push({ name: 'name1', params: { good_id: 1 }}) 通过name指定跳转，并携带参数
    this.get_need_data(this.my_pagination)
  },
  methods: {
    get_need_data(params) {
      GetAjax('/${obj.object_name}/', params).then(response => {
        const data = response.data
        console.log('得到列表数据：',data)
        this.page_datas = data
        this.my_pagination.count = response.count
        // this.my_pagination.count = 100
      })
    },
    post_need_data(data) {
      PostAjax('/${obj.object_name}/', data).then(response => {
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
      PatchAjax('/${obj.object_name}/' + data.id + '/', data).then(response => {
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
      DeleteAjax('/${obj.object_name}/' + data.id + '/', data).then(response => {
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
            var data = JSON.parse(JSON.stringify(this.ruleForm))
            console.log(data)
            // this.post_need_data(data)
          } else {
            var data = JSON.parse(JSON.stringify(this.ruleForm))
            console.log(data)
            // this.patch_need_data(data)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重新初始化Form
    resetForm(formName) {
      this.centerDialog = false
      this.centerDialog_patch = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    delete_data_fuc(row) {
      this.delete_data = {id: row.id}
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
`
  return str
}

module.exports.creatCode = creatCode