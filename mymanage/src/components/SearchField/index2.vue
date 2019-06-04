<template>
  <div :class="{'hidden':hidden}">
    <el-input
      :placeholder="placeholder"
      v-model="new_search"
      size="small"
      clearable
      @input="to_input"
      @keyup.enter.native="to_search"
      @clear="to_search">
      <el-button slot="append" icon="el-icon-search" @click="to_search">{{ buttonName }}</el-button>
    </el-input>
  </div>
</template>

<script>
// 版本二的搜索组件--支持双绑
export default {
  name: 'Mysearch',
  props: {
    hidden: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入关键字(模糊搜索)'
    },
    buttonName: {
      type: String,
      default: '搜索'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      new_search: this.value
    }
  },
  methods: {
    to_search() {
      this.$emit('searchData', this.new_search)
    },
    to_input() {
      this.$emit('input', this.new_search) // 实现双绑的关键
    }
  }
}
</script>

<style scoped>
</style>
