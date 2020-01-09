<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data (){
    return {
        clickTime: new Date().getTime(), // 最后一次点击的时间
        tOut: 30 * 60 * 1000
    }
  },
  methods:{
    clicked () {
      // console.log(new Date().getTime() - this.clickTime)
      if ((new Date().getTime() - this.clickTime) > this.tOut) {
        if (this.$store.getters.token) {
          this.$store.dispatch('FedLogOut').then(() => {
            this.$alert('超时未操作，请重新登录。', '提示', {
              confirmButtonText: '确定'
            }).then(() => {
              location.reload()
            })
          })
        }
      }
      this.clickTime = new Date().getTime()  //当界面被点击更新点击时间
    },
  }
}
</script>
