<template>
  <div :class="{'hidden':hidden}" >
    <el-pagination
      small
      background
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @current-change="handleCurrentChange"
    />
    <!-- <el-row>
      <el-col :span="12">
        <el-date-picker id="mydate" v-model="search_month" size="small" type="month" placeholder="选择月" value-format="yyyy-MM" :clearable="false" :editable="false" />
      </el-col>
      <el-col :span="12">
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
export default {
  name: 'MiniPagination',
  data() {
    return {
      search_month: ''
    }
  },
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    page_size: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'prev, pager, next'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.page_size
      },
      set(val) {
        this.$emit('update:page_size', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, page_size: val })
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, page_size: this.pageSize })
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
