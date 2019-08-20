<template>
  <div class='app-container'>
    <h1>tinymce 富文本编辑器</h1>
    <editor id='tinymce' v-model='tinymceHtml' :init='init'></editor>
    <div v-html='tinymceHtml'></div>
    <el-row>
        <el-col :span="20"></el-col>
        <el-col :span="4"><el-button type="primary" @click="to_data">确定</el-button></el-col>
    </el-row>
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
  data () {
    return {
      uploadUrl: process.env.BASE_API + '/uploadfile/',
      headers: {'Authorization': 'bearer ' + store.getters.token},
      tinymceHtml: `<h1 style="text-align: center;">Welcome to the &nbsp;demo!</h1>
<p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="//www.tinymce.com/images/glyph-tinymce@2x.png" alt="TinyMCE Logo" width="110" height="97" /></p>
<p>&nbsp;</p>
<ul>
<li>Our <a href="//www.tinymce.com/docs/">documentation</a> is a great resource for learning how to configure TinyMCE.</li>
<li>Have a specific question? Visit the <a href="https://community.tinymce.com/forum/">Community Forum</a>.</li>
<li>We also offer enterprise grade support as part of <a href="https://tinymce.com/pricing">TinyMCE premium subscriptions</a>.</li>
</ul>`,
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
      to_data() {
          console.log(this.tinymceHtml)
          let Base64 = {
            encode(str) {
                return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                    function toSolidBytes(match, p1) {
                        return String.fromCharCode('0x' + p1);
                    }));
            },
            decode(str) {
                return decodeURIComponent(atob(str).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            }
        };

        let encoded = Base64.encode(this.tinymceHtml); 
        let decoded = Base64.decode(encoded); 
        console.log(encoded)
        console.log(decoded)
      },
      handleImgUpload (blobInfo, success, failure) {
        let formdata = new FormData()
        formdata.set('upload_file', blobInfo.blob())
        var new_headers = { headers: this.headers}
        axios.post(uploadUrl, formdata, new_headers).then(res => {
          // console.log(res.data.data)
          success(res.data.data[0])
        }).catch(res => {
          failure('error')
        })
      }
  },
  components: {Editor}
}
</script>