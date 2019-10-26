<!-- 裁剪图片 -->
<template>
  <div class="wrapper">
    <div class="model" v-show="model" @click="model = false">
      <div class="model-show">
        <img :src="modelSrc" alt="" crossorigin="anonymous">
      </div>
    </div>
    <div class="content">
      <div class="show-info">
        <h2>自动生成截图框 固定比例 w : h => {{fixedNumber[0]}} : {{fixedNumber[1]}} <span v-if="size">图片尺寸：{{size}}</span></h2>
        <div class="test">
          <vueCropper ref="cropper2" :img="img"  :checkCrossOrigin="false" :outputSize="example2.size" :outputType="example2.outputType"
            :info="example2.info" :canScale="example2.canScale" :autoCrop="example2.autoCrop"
            :autoCropWidth="width" :autoCropHeight="height" :fixed="example2.fixed"
            :fixedNumber="fixedNumber" :enlarge="4"></vueCropper>
        </div>
        <label class="btn" for="upload2">+</label>
        <input type="file" id="upload2" style="position:absolute; clip:rect(0 0 0 0);"
          accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event)">
        <!-- <el-button @click="finish2()" class="btn">裁剪</el-button> -->
        <el-button @click="submits" class="btn">确认上传</el-button>
      </div>
    </div>
 
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
    },
    size:{
      type:String
    }
  },
  data() {
    return {
      uploadUrl: process.env.BASE_API + '/uploadfile/',
      headers: {'Authorization': 'bearer ' + store.getters.token},
      model: false,
      crap: false,
      previews: {},
      form: {
        head: ''
      },
      modelSrc:'',
      example2: {
        //img的路径自行修改
        img: '$oss.url + \'/\' + form.head ',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 400,
        autoCropHeight: 300,
        fixed: true,
        // 真实的输出宽高
        infoTrue: true,
        fixedNumber: [1.3, 1]
      },
      downImg: '#',
      hackReset:false
    }
  },
  computed:{
    fixedNumber(){
      let x=parseFloat(this.width/this.height).toFixed(1)
      return [x,1]
    },
    img:{
      get(){
        // console.log(this.hackReset)
        if(this.value){
          var reg = RegExp(/blob/)
          var reg2 = RegExp(/pic/)
          if(reg.test(this.value)||this.value.substr(0, 4) === "data"){
            return this.value
          }else{
            console.log(this.value+"?timeStamp="+ new Date().getTime())
            return this.value+"?timeStamp="+ new Date().getTime();
          }
        }
        return 'http://pic.fushan8.com/Uploads/kimg/2019-08-09/5d4cc'
      },
      set(val) {
        console.log('set',val)
        // this.modelSrc=this.val
          this.$emit('input', {url:val})
        return val
        
      }
    }
  },
  methods: {
    //上传
    submits(){
      this.$refs.cropper2.getCropBlob((data) => {
        var fileName = 'goods'+((Math.random() * 1000).toFixed(0) + new Date().getTime())
        let formdata = new FormData()
        formdata.set('upload_file', data)
        axios.post(this.uploadUrl, formdata, { headers: this.headers}).then(res => {
            console.log(res.data.data[0])
        }).catch(res => {
            failure('error')
        })
      })
    },
    //点击裁剪，这一步是可以拿到处理后的地址
    finish2() {
      this.$refs.cropper2.getCropData((data) => {
        this.modelSrc = data
        this.model = false;
        //裁剪后的图片显示
        this.img = this.modelSrc;
      })
    },
    uploadImg(e) {
      console.log(e)
      //上传图片
      this.img = ''
      var file = e.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      var reader = new FileReader()
      reader.onload = (e) => {
        let data
        data = e.target.result
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        console.log(this.img)
        this.img = data
      }
      reader.readAsArrayBuffer(file)
    }
  }
}
</script>
 
<style>
  * {
    margin: 0;
    padding: 0;
  }
 
  .content {
    margin: auto;
    max-width: 585px;
    margin-bottom: 100px;
  }
 
  .test-button {
    display: flex;
    flex-wrap: wrap;
  }
 
  .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c0ccda;
    color: #1f2d3d;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 20px 10px 0px 0px;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    transition: all .2s ease;
    text-decoration: none;
    user-select: none;
  }
 
  .des {
    line-height: 30px;
  }
 
  code.language-html {
    padding: 10px 20px;
    margin: 10px 0px;
    display: block;
    background-color: #333;
    color: #fff;
    overflow-x: auto;
    font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo, Lucida, Sans, Type, Writer, Ubuntu, Mono;
    border-radius: 5px;
    white-space: pre;
  }
 
  .show-info {
    margin-bottom: 50px;
  }
 
  .show-info h2 {
    line-height: 50px;
  }
 
  /*.title, .title:hover, .title-focus, .title:visited {
        color: black;
    }*/
 
  .title {
    display: block;
    text-decoration: none;
    text-align: center;
    line-height: 1.5;
    margin: 20px 0px;
    background-image: -webkit-linear-gradient(left, #3498db, #f47920 10%, #d71345 20%, #f7acbc 30%, #ffd400 40%, #3498db 50%, #f47920 60%, #d71345 70%, #f7acbc 80%, #ffd400 90%, #3498db);
    color: transparent;
    -webkit-background-clip: text;
    background-size: 200% 100%;
    animation: slide 5s infinite linear;
    font-size: 40px;
  }
 
  .test {
    height: 285px;
  }
 
  .model {
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    top: 0;
    left: 0;
    background: rgba(243, 240, 240, 0.158);
  }
 
  .model-show {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }
 
  .model img {
    display: block;
    margin: auto;
    max-width: 80%;
    user-select: none;
    background-position: 0px 0px, 10px 10px;
    background-size: 20px 20px;
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%), linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
  }
 
  .c-item {
    display: block;
    padding: 10px 0;
    user-select: none;
  }
 
  @keyframes slide {
    0% {
      background-position: 0 0;
    }
 
    100% {
      background-position: -100% 0;
    }
  }
 
  @media screen and (max-width: 1000px) {
    .content {
      max-width: 90%;
      margin: auto;
    }
 
    .test {
      height: 400px;
    }
  }
</style>