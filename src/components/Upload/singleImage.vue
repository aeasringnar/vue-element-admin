<template>
  <div>
    <el-upload
      :action="action_url"
      :headers="headers"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      class="avatar-uploader">
      <img v-if="imageUrl.length > 1" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"/>
    </el-upload>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'SingleImageUpload',
  props: {
    value: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      action_url: process.env.BASE_API + '/uploadfile/',
      headers: { 'Authorization': 'bearer ' + store.getters.token }
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(file.response.data[0])
      this.$emit('input', file.response.data[0])
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
