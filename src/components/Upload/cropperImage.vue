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
    <el-dialog title="图片剪裁" :visible="dialogVisible" v-dialogDrag append-to-body center :show-close="false">
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :info="option.info"
            :full="option.full"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :autoCropWidth="width"
            :autoCropHeight="height"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            ></vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finish" :loading="loading">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import { VueCropper } from 'vue-cropper'
import axios from 'axios'
import store from '@/store'
export default {
  name: 'copper',
  components: {
    VueCropper,
  },
  props:{
    value: {
      required: true,
      type: String
    },
    width:{
      type:Number,
      default:400
    },
    height:{
      type:Number,
      default:300
    }
  },
  data() {
    return {
      action_url: process.env.BASE_API + '/uploadfile/',
      headers: {'Authorization': 'bearer ' + store.getters.token},
      dialogVisible: false,
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.5, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: this.width, // 默认生成截图框宽度
        autoCropHeight: this.height, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        // fixedNumber: [7, 5], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      loading: false
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    handleAvatarSuccess(res, file,fileList) {
      // console.log(file)
      // console.log(fileList)
      this.fileinfo = file
      this.option.img = file.response.data[0]
      this.dialogVisible = true
    },
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        var fileName = this.fileinfo.uid + this.fileinfo.name
        this.loading = true
        let formdata = new FormData()
        formdata.set('upload_file', data, fileName)
        // 上传到服务器
        axios.post(this.action_url, formdata, { headers: this.headers}).then(res => {
          // console.log(res.data.data[0])
          this.$emit('input', res.data.data[0]) // 将实际地址返回给父组件 双向绑定
          this.loading = false
        }).catch(res => {
          console.log('error：',res)
        })
      })
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
    }
  }
}
</script>
 
<style scoped>
.cropper {
  width: auto;
  height: 500px;
}
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