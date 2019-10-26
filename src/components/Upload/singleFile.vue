<template>
  <div>
    <el-upload
      :action="action_url"
      :headers="headers"
      :file-list="fileList"
      :limit="fileLimit"
      :on-exceed="handleExceed"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      multiple>
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">文件最大不超过64MB</div>
    </el-upload>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'MultiImage',
  props: {
    value: {
      required: true,
      type: Array
    },
    limit: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      action_url: process.env.BASE_API + '/uploadfile/',
      headers: { 'Authorization': 'bearer ' + store.getters.token },
      // fileList: [],
      fileLimit: this.limit
    }
  },
  computed: {
    fileList:{
      get: function() {
        console.log('查看：', this.value)
        var file_list = []
        this.value.forEach((item) => {
          var file_spit = item.split('/')
          file_list.push({
            name: file_spit[file_spit.length - 1],
            url: item
          })
        })
        return file_list
      },
      set: function (newValue) {
        // console.log('查看newvalue：', newValue)
        return newValue
      }
    }
  },
  methods: {
    // 需要输入以及输出都是一个图片url列表
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.fileList = fileList
      this.$emit('input', this.handle_file_list(fileList))
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handle_file_list(file_list) {
      var list = []
      file_list.forEach((item) => {
        if (item.response) {
          list.push(item.response.data[0])
        } else {
          list.push(item.url)
        }
      })
      return list
    },
    handleAvatarSuccess(res, file,fileList) {
      // console.log(file)
      // console.log(fileList)
      this.fileList = fileList
      this.$emit('input', this.handle_file_list(fileList))
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 64
      if (!isLt2M) {
        this.$message.error('允许的最大文件大小为 64MB！')
      }
      return isLt2M
    },
    handleExceed(files, fileList) {
      // this.$message.warning(`当前限制选择 ${this.fileLimit}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      this.$message.warning(`当前限制选择 ${this.fileLimit}个文件，本次选择了 ${files.length} 个文件，请合理上传。`)
    }
  }
}
</script>

<style scoped>
/*.el-upload*/
</style>
