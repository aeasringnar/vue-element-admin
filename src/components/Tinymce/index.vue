<template>
  <div>
    <h2>富文本编辑器</h2>
    <editor id='tinymce' v-model='tinymceHtml' :init='init' @input="to_input"></editor>
    <div v-html='tinymceHtml'></div>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import axios from 'axios'
import store from '@/store'
export default {
  name: 'tinymce',
  props: {
    value: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      uploadUrl: process.env.BASE_API + '/uploadfile/',
      headers: {'Authorization': 'bearer ' + store.getters.token},
      tinymceHtml: this.value,
      init: {
        language_url: '/static/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/lightgray',
        height: 300,
        plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
        toolbar:
          'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
        branding: false,
        paste_word_valid_elements: '*[*]',        // word需要它
        paste_data_images: true,                  // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: false,     // 插入word文档需要该属性
        images_upload_handler:(blobInfo, success, failure) => {
          this.handleImgUpload(blobInfo, success, failure)
        }
      }
    }
  },
  mounted () {
    tinymce.init({})
  },
  methods: {
    to_input() {
      this.$emit('input', Buffer.from(this.tinymceHtml).toString('base64')) // 转化为base64返回
      // console.log(Buffer.from(this.content, 'base64').toString()) base64转成String
    },
    handleImgUpload (blobInfo, success, failure) {
      let formdata = new FormData()
      formdata.set('upload_file', blobInfo.blob())
      axios.post(this.uploadUrl, formdata, { headers: this.headers}).then(res => {
        success(res.data.data[0])
      }).catch(res => {
        failure('error')
      })
    }
  },
  components: {Editor}
}
</script>