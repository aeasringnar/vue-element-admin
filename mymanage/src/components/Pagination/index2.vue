<template>
  <div :class="{'hidden':hidden}" >
    <el-pagination
      v-show="total > 0"
      :background="background"
      :current-page.sync="drf_filter.page"
      :page-size.sync="drf_filter.page_size"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
// <pagination2 v-model="drf_filter" :total="total_page"/>
export default {
  name: 'Pagination2',
  props: {
    total: {
      required: true,
      type: Number
    }, /*
    page: {
      type: Number,
      default: 1
    },
    page_size: {
      type: Number,
      default: 10
    }, */
    value: {
      type: Object, // {total_page:100 , page:1, page_size:10 }
      required: true
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
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
  data() {
    return {
      // drf_filter: JSON.parse(JSON.stringify(this.value))
      drf_filter: this.value

    }
  },
  /* computed: {
    currentPage: {
      get() {
        return this.value.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.value.page_size
      },
      set(val) {
        this.$emit('update:page_size', val)
      }
    }
  }, */
  methods: {
    handleSizeChange(val) {
      // this.$emit('pagination', { page: this.currentPage, page_size: val })
      this.drf_filter.page = 1
      this.drf_filter.page_size = val
      this.$emit('input', this.drf_filter)
    },
    handleCurrentChange(val) {
      // this.$emit('pagination', { page: val, page_size: this.pageSize })
      this.drf_filter.page = val
      this.$emit('input', this.drf_filter)
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
