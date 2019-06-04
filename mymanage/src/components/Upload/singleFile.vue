<template>
  <div>
    <el-upload
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="limit"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :action="action_url"
      :headers="headers"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      multiple>
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">最大不超过10MB</div>
    </el-upload>
  </div>
</template>

<script>
/* eslint-disable */
import store from '@/store'

export default {
  name: 'SingleFileUpload',
  props: {
    value: {
      required: true
      // type: [null, String]
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // fileList: [],
      // fileList: this.value == null ? [] : this.value.split('nbjicekejihenniubility'),
      action_url: process.env.BASE_API + '/uploadfile/',
      headers: { 'Authorization': 'bearer ' + store.getters.token }
    }
  },
  computed: {
    fileList: {
      get() {
        console.log(this.value)
        if (this.value == null || this.value === '') {
          console.log([])
          return []
        } else {
          console.log([{
            name: this.value.split('/')[this.value.split('/').length - 1],
            url: this.value
          }])
          return [{
            name: this.value.split('/')[this.value.split('/').length - 1],
            url: this.value
          }]
        }
      },
      set(val) {
        console.log('set',val)
        this.$emit('input', val.url)
      }
    }
  },
  methods: {
    handlePreview(file) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      fileList = []
      this.$emit('input', '')
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleAvatarSuccess(res, file) {
      console.log(file.response.data[0])
      this.fileList = {
        name: file.response.data[0].split('/')[file.response.data[0].split('/').length - 1],
        url: file.response.data[0]
      }
      // this.$emit('input', file.response.data[0])
      // this.img_url = file.response.data[0]
      // this.$emit('update:img_url', file.response.data[0])
    },
    beforeAvatarUpload(file) {
      var img_type = ['image/jpeg', 'image/jpg', 'image/png']
      var img_index = img_type.indexOf(file.type)
      var isJPG = false
      if (img_index !== -1) {
        isJPG = true
      }
      console.log(isJPG)
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('允许的图片类型为 JPG / JPEG / PNG ！')
      }
      if (!isLt2M) {
        this.$message.error('允许的最大图片大小为 10MB！')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>
/*.el-upload*/
</style>
