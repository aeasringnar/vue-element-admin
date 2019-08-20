<template>
    <div class="app-container">
        <el-row>
            <el-col :span="3">
                <el-button size="small" type="primary" @click="my_print">打印</el-button>
            </el-col>
            <el-col :span="21"><p></p></el-col>
        </el-row>
        <el-dialog
            title="小票"
            :visible.sync="centerDialogVisible_two"
            width="40%"
            center>
            <div class="dialogCare">
                <div class="piao-title">小票测试</div>
                <div class="piao-phone">电话：17312345601</div>
                <div class="piao-xing"> * * * * * * * * * * * * * * * * * * * * </div>
                <div class="piao-biaotou">
                    <div class="piao-biaotou-name">名称</div>
                    <div class="piao-biaotou-num">数量</div>
                    <div class="piao-biaotou-price">单价</div>
                </div>
                <div class="piao-biaotou">
                    <div class="piao-biaotou-name">test01</div>
                    <div class="piao-biaotou-num">1</div>
                    <div class="piao-biaotou-price">55</div>
                </div>
                <div class="piao-biaotou">
                    <div class="piao-biaotou-name">test02</div>
                    <div class="piao-biaotou-num">2</div>
                    <div class="piao-biaotou-price">128</div>
                </div>
                <div class="piao-xing"> - - - - - - - - - - - - - - - - - - - - - - </div>
                <div class="all-price">
                    总金额：311
                </div>
                <div class="all-date">
                    日期：2019-02-28
                </div>
                <div class="piao-xing"  style="margin-top:3mm;"> * * * * * * * * * * * * * * * * * * * * </div>
                 <div class="piao-title" style="margin-top:5mm;">请妥善保管好购物凭证</div>
                 <div class="piao-title">多谢惠顾</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="centerDialogVisible_two = false">取 消</el-button>
                <el-button size="small" type="primary" @click="to_print">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import store from '@/store'
    import Vue from 'vue'
    import { GetAjax, PostAjax, PatchAjax, DeleteAjax } from '@/api/myapi'
    import datetime from 'date-and-time'

    export default {
        name: "demo_manage",
        data () {
            return {
                centerDialogVisible_two:false,
            }
        },
        methods: {
            my_print(){
                console.log('打印测试')
                this.centerDialogVisible_two = true
            },
            to_print(){
                let newstr = document.getElementsByClassName('dialogCare')[0].innerHTML
                console.log(newstr)
                window.document.body.innerHTML = newstr
                let oldstr = window.document.body.innerHTML
                window.print()
                window.location.reload()   //解决打印之后按钮失效的问题
                window.document.body.innerHTML = oldstr
                return false
            }
        },
        created: function() {
        }
    }
</script>

<style scoped>
.dialogCare{
    width: 58mm;
    margin: 0 auto;
}
.piao-title{
    text-align: center;
}
.piao-phone{
    text-align: center;
}
.piao-xing{
    text-align: center;
}
.piao-biaotou{
    overflow: hidden;
}
.piao-biaotou-name{
    width: 40%;
    float: left;
    text-align: center;
}
.piao-biaotou-num{
    width: 20%;
    float: left;
    text-align: center;
}
.piao-biaotou-price{
    width: 40%;
    float: left;
    text-align: center;
}
.all-price{
    padding: 0 5mm 0 5mm;
}
.all-date{
    margin-top:5mm;
    text-align: right;
    padding: 0 5mm 0 5mm;
}
</style>