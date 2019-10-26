<template>
  <div style="width: 620px">
    <el-upload
      :action="action_url"
      :headers="headers"
      list-type="picture-card"
      :file-list="fileList"
      :limit="fileLimit"
      :on-exceed="handleExceed"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      multiple>
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
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
      default: 5
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
        var file_list = []
        this.value.forEach((item) => {
          file_list.push({
            name: 'name',
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
      var img_type = ['image/jpeg', 'image/jpg', 'image/png']
      var img_index = img_type.indexOf(file.type)
      var isJPG = false
      if (img_index !== -1) {
        isJPG = true
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('允许的图片类型为 JPG / JPEG / PNG ！')
      }
      if (!isLt2M) {
        this.$message.error('允许的最大图片大小为 10MB！')
      }
      return isJPG && isLt2M
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
