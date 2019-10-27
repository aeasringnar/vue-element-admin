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
    <el-dialog title="图片剪裁" :visible="dialogVisible_cropper" v-dialogDrag append-to-body center :show-close="false">
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
        <!-- <el-button @click="dialogVisible_cropper = false">取 消</el-button> -->
        <el-button type="primary" @click="finish" :loading="loading">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import store from '@/store'
import { VueCropper } from 'vue-cropper'

export default {
  name: 'MulImage',
  components: {
    VueCropper,
  },
  props: {
    value: {
      required: true,
      type: Array
    },
    limit: {
      type: Number,
      default: 5
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
      dialogImageUrl: '',
      dialogVisible: false,
      dialogVisible_cropper: false,
      action_url: process.env.BASE_API + '/uploadfile/',
      headers: { 'Authorization': 'bearer ' + store.getters.token },
      // fileList: [],
      fileLimit: this.limit,
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
      loading: false,
      urlList: []
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
      this.$emit('multiFinish', this.handle_file_list(fileList))
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
    handleAvatarSuccess(res, file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
      this.urlList = fileList
      // this.$emit('multiFinish', this.handle_file_list(fileList))
      this.fileinfo = file
      this.option.img = file.response.data[0]
      this.dialogVisible_cropper = true
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
    },
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        var fileName = this.fileinfo.uid + this.fileinfo.name
        this.loading = true
        let formdata = new FormData()
        formdata.set('upload_file', data, fileName)
        // 上传到服务器
        axios.post(this.action_url, formdata, { headers: this.headers}).then(res => {
          console.log(res.data.data[0])
          // this.$emit('input', res.data.data[0]) // 将实际地址返回给父组件 双向绑定
          console.log(this.urlList)
          for (var i in this.urlList) {
            console.log(this.urlList[i])
            if (this.urlList[i].uid == this.fileinfo.uid) {
              console.log('查看原本值：', this.urlList[i])
              this.urlList[i].response.data[0] = res.data.data[0]
              this.urlList[i].url = res.data.data[0]
            }
          }
          this.$emit('multiFinish', this.handle_file_list(this.urlList))
          this.loading = false
          this.dialogVisible_cropper = false
        }).catch(res => {
          console.log('error：',res)
        })
      })
    },
  }
}
</script>

<style scoped>
.cropper {
  width: auto;
  height: 500px;
}
</style>
