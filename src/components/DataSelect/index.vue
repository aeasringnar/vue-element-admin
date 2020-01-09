<template>
  <div>
    <el-select id="myselect" size="small" v-model="select_value" :placeholder="my_placeholder" 
      @change="chiose_data" @visible-change="show_select" :style="my_style" :multiple="is_multi"
      filterable :loading="loading" remote :remote-method="remoteMethod">
        <el-option v-for="item in find_datas" :key="item.id" :label="item[show_key]" :value="String(item.id)"/>
        <mini-pagination :total="data_pagination.count" :page.sync="data_pagination.page" :page_size.sync="data_pagination.page_size" @pagination="find_data_change"/>
        <template v-if="is_big">
          <el-date-picker style="margin: 0px 8px;" id="mydate" v-model="search_month" size="small" type="monthrange" value-format="yyyy-MM"
            range-separator="-" start-placeholder="开始月" end-placeholder="结束月"
            :clearable="false" :editable="false" :validate-event="false" @change="change_month"/>
        </template>
    </el-select>
  </div>
</template>

<script>
import store from '@/store'
import MiniPagination from '@/components/MiniPagination'
import { GetAjax } from '@/api/myapi'
import datetime from 'date-and-time'

export default {
  name: 'BigDataSelect',
  components: { MiniPagination },
  props: {
    value: {
      required: true,
      type: [Number, String, Array]
    },
    findUrl: {
      required: true,
      type: String
    },
    pageSize: {
      required: true,
      type: Number
    },
    showKey: {
      required: true,
      type: String,
      default: 'title'
    },
    myStyle: {
      type: String,
      default: 'width: 80%;'
    },
    isMulti: {
      type: Boolean,
      default: false
    },
    myPlaceholder: {
      type: String,
      default: '请选择'
    },
    isBig: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      data_pagination: {
        page: 1,
        page_size: this.pageSize,
        count: 0,
        search_time: datetime.format(new Date(), 'YYYY-MM') + ',' + datetime.format(new Date(), 'YYYY-MM')
      },
      // show_key: this.showKey,
      // select_value: this.value,
      find_datas: [],
      loading: false,
      search_month: [datetime.format(new Date(), 'YYYY-MM'), datetime.format(new Date(), 'YYYY-MM')]
    }
  },
  computed: {
    select_value:{
      get: function() {
        return this.value
      },
      set: function (newValue) {
        console.log('查看返回数据...')
        console.log(newValue)
        return newValue
      }
    },
    my_style() {
      return this.myStyle
    },
    is_multi() {
      return this.isMulti
    },
    my_placeholder() {
      return this.myPlaceholder
    },
    show_key() {
      return this.showKey
    },
    is_big() {
      return this.isBig
    }
  },
  methods: {
    find_data_fuc(params) {
      if (!this.is_big) {
        delete params.search_time
      }
      GetAjax(this.findUrl, params).then(response => {
        const data = response.data
        this.find_datas = data
        this.data_pagination.count = response.count
        this.loading = false
      })
    },
    find_data_change() {
      this.loading = true
      this.find_data_fuc(this.data_pagination)
    },
    chiose_data(val) {
      this.$emit('input', val)
    },
    show_select(val) {
      if (val) {
        this.loading = true
        this.find_data_fuc(this.data_pagination)
      }
    },
    remoteMethod(query) {
      this.loading = true
      this.data_pagination.search = query
      this.data_pagination.page = 1
      this.find_data_fuc(this.data_pagination)
    },
    change_month(val) {
      console.log(val)
      if (val) {
        this.loading = true
        this.data_pagination.search_time = val[0] + ',' + val[1]
        this.find_data_fuc(this.data_pagination)
      }
    }
  }
}
</script>