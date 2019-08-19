<template>
  <div>
    <el-upload
      :action="action_url"
      :headers="headers"
      :limit="limit"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :on-success="handleAvatarSuccess"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      class="upload-demo"
      multiple
      drag
      list-type="picture">
      <i class="el-icon-upload"/>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5张</div>
    </el-upload>
  </div>
</template>

<script>
// /* eslint-disable */
import store from '@/store'

export default {
  name: 'SingleFileUpload',
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
        if (this.value == null || this.value === '' || this.value === {}) {
          return []
        } else {
          /* var tmp_name = ''
          var tmp_fileList = []
          for (var i = 0; i < this.value.length; i++) {
            tmp_name = this.value[i].split('/')[this.value[i].split('/') - 1 ]
            tmp_fileList.push({
              name: tmp_name,
              url: this.value[i]
            })
          } */
          console.log('get', this.value_to_fileList(this.value))
          return this.value_to_fileList(this.value)
        }
      },
      set(val) {
        console.log('set', val)
        /* var tmp_value = []
        for (var i = 0; i < val.length; i++) {
          tmp_value.push(val[i].url)
        } */
        this.$emit('input', this.fileList_to_value(val))
      }
    }
  },
  methods: {
    fileList_to_value(fileList) {
      var tmp_value = []
      for (var i = 0; i < fileList.length; i++) {
        tmp_value.push(fileList[i].url)
      }
      return tmp_value
    },
    value_to_fileList(value) {
      var tmp_name = ''
      var tmp_fileList = []
      for (var i = 0; i < value.length; i++) {
        tmp_name = value[i].split('/')[value[i].split('/') - 1 ]
        tmp_fileList.push({
          name: tmp_name,
          url: value[i]
        })
      }
      return tmp_fileList
    },
    handlePreview(file) {
      console.log('handlePreview', file)
    },
    handleRemove(file, fileList) {
      console.log('handleRemove', file, fileList)
      var rm_oss_file_name = ''
      if (file.hasOwnProperty('response')) {
        rm_oss_file_name = file.response.data[0]
      } else {
        rm_oss_file_name = file.url
      }
      var index = 0
      for (var i = 0; i < this.fileList; i++) {
        if (this.fileList[i].url === rm_oss_file_name) {
          index = i
          break
        }
      }
      this.fileList.splice(index, 1)
      this.$emit('input', this.fileList_to_value(this.fileList))
    },
    beforeRemove(file, fileList) {
      console.log('beforeRemove', file, fileList)
      // return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleAvatarSuccess(res, file) {
      console.log(res)
      console.log(file.response.data[0])
      this.fileList.push({
        name: file.response.data[0].split('/')[file.response.data[0].split('/').length - 1],
        url: file.response.data[0]
      })
      this.$emit('input', this.fileList_to_value(this.fileList))
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
      // 长宽比限制
      /* var _this = this
      return new Promise(function(resolve, reject) {
        var reader = new FileReader()
        reader.onload = function(event) {
          var image = new Image()
          image.onload = function() {
            var width = this.width
            var height = this.height
            // if (width/height != 1){
            //   _this.$message.error("图片宽高比例必须为1！");
            //   reject();
            // }
            resolve(isJPG && isLt2M)
          }
          image.src = event.target.result
        }
        reader.readAsDataURL(file)
      }) */
    }
  }
}
</script>

<style scoped>
/*.el-upload*/
</style>
