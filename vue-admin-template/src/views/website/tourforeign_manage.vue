<template>
    <div class="app-container">
        <el-row>
            <el-col :span="4"><el-button type="primary" @click="new_data">新增</el-button></el-col>
            <el-col :span="20"></el-col>
        </el-row>
        <br>
        <el-table
            :data="banner_data"
            border
            stripe
            style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="title" label="标题" width="280"></el-table-column>
            <el-table-column prop="day_num" label="时间节点" width="100"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column prop="updated" label="更新时间" width="140"></el-table-column>
            <el-table-column prop="sort" label="排序" width="80"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="small" @click="edit_data(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="delete_data_fuc(scope.row)">删除</el-button>
                </template>
          </el-table-column>
        </el-table>
        <div class="block">
            <br>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 60, 100]"
            :page-size="current_page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page_tatol">
            </el-pagination>
        </div>

        <el-dialog
            title="新增"
            :visible.sync="centerDialogVisible"
            width="50%"
            center>
            <div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="ruleForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="时间节点" prop="day_num">
                        <el-input v-model="ruleForm.day_num"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <el-input type="textarea" v-model="ruleForm.content" rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model.number="ruleForm.sort"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="确认删除"
            :visible.sync="centerDialogVisible_two"
            width="30%"
            center>
            <span>是否确认删除，删除后不可恢复？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible_two = false">取 消</el-button>
                <el-button type="primary" @click="true_delete">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="编辑"
            :visible.sync="centerDialogVisible_patch"
            width="50%"
            center>
            <div>
                <el-form :model="ruleForm_patch" :rules="rules_patch" ref="ruleForm_patch" label-width="110px" class="demo-ruleForm">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="ruleForm_patch.title"></el-input>
                    </el-form-item>
                    <el-form-item label="时间节点" prop="day_num">
                        <el-input v-model="ruleForm_patch.day_num"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <el-input type="textarea" v-model="ruleForm_patch.content" rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model.number="ruleForm_patch.sort"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm_patch')">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm_patch')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import store from '@/store'
    import Vue from 'vue'
    import { get_tourforeign, post_tourforeign, patch_tourforeign, delete_tourforeign } from '@/api/website'

    export default {
        name: "tourforeign_manage",
        data () {
            return {
                msg:'tourforeign_manage',
                centerDialogVisible: false,
                centerDialogVisible_two: false,
                centerDialogVisible_patch: false,
                banner_data: [],
                ruleForm: {
                    title: '',
                    day_num: '',
                    sort: '',
                    content: ''
                },
                rules: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, type: 'number', message: '请输入排序序号', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    content: [
                        { required: true, message: '请输入内容', trigger: 'blur' }
                    ],
                    day_num: [
                        { required: true, message: '请输入时间节点', trigger: 'blur' }
                    ],
                },
                ruleForm_patch: {
                    title: '',
                    day_num: '',
                    sort: '',
                    content: ''
                },
                rules_patch: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, type: 'number', message: '请输入排序序号', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    content: [
                        { required: true, message: '请输入内容', trigger: 'blur' }
                    ],
                    day_num: [
                        { required: true, message: '请输入时间节点', trigger: 'blur' }
                    ],
                },
                headers: {'Authorization': 'bearer ' + store.getters.token},
                delete_data: {},
                currentPage: 1,
                page_tatol: 100,
                current_page_size: 10,
            }
        },
        methods: {
            get_banner_data(pk,page,page_size) {
                get_tourforeign(pk,page,page_size).then(response => {
                    const data = response.data
                    console.log(data)
                    this.banner_data = data
                    this.page_tatol = response.tatol
                }).catch(error => {
                    alert(error)
                })
            },
            post_banner_data(data) {
                post_tourforeign(data).then(response => {
                    const data = response.data
                    console.log(data)
                    this.centerDialogVisible = false
                    this.$refs['ruleForm'].resetFields()
                    this.$message({
                        showClose: true,
                        message: 'success',
                        type: 'success'
                    })
                    this.get_banner_data(null,this.currentPage,this.current_page_size)
                }).catch(error => {
                    alert(error)
                })
            },
            patch_banner_data(data) {
                patch_tourforeign(data).then(response => {
                    const data = response.data
                    console.log(data)
                    this.centerDialogVisible_patch = false
                    this.$message({
                        showClose: true,
                        message: 'success',
                        type: 'success'
                    })
                    this.get_banner_data(null,this.currentPage,this.current_page_size)
                }).catch(error => {
                    alert(error)
                })
            },
            delete_banner_data(data) {
                delete_tourforeign(data).then(response => {
                    const data = response.data
                    console.log(data)
                    this.centerDialogVisible_two = false
                    this.$message({
                        showClose: true,
                        message: 'success',
                        type: 'success'
                    })
                    this.get_banner_data(null,this.currentPage,this.current_page_size)
                }).catch(error => {
                    alert(error)
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formName == 'ruleForm') {
                            console.log(this.ruleForm)
                            this.post_banner_data(this.ruleForm)
                        } else{
                            console.log(this.ruleForm_patch)
                            this.patch_banner_data(this.ruleForm_patch)
                        }
                    } else {
                        console.log('error submit!!')
                        return false;
                    }
                })
            },
            resetForm(formName) {
                console.log(formName)
                this.centerDialogVisible = false
                this.$refs[formName].resetFields()
                this.centerDialogVisible_patch = false
            },
            delete_data_fuc(row) {
                console.log(row)
                this.delete_data = row
                this.centerDialogVisible_two = true
            },
            new_data() {
                this.centerDialogVisible =true
            },
            true_delete() {
                this.delete_banner_data(this.delete_data)
            },
            edit_data(row) {
                console.log(row)
                this.ruleForm_patch.title = row.title
                this.ruleForm_patch.day_num = row.day_num
                this.ruleForm_patch.content = row.content
                this.ruleForm_patch.sort = row.sort
                this.ruleForm_patch.id = row.id
                this.centerDialogVisible_patch = true
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`)
                this.current_page_size = val
                this.get_banner_data(null,this.currentPage,this.current_page_size)
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`)
                this.currentPage = val
                this.get_banner_data(null,this.currentPage,this.current_page_size)
            }
        },
        created: function() {
            this.get_banner_data(null,this.currentPage,this.current_page_size)
        }
    }
</script>

<style scoped>
/*.el-upload*/
.avatar-uploader {
    height: 100px;
    width: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 98px;
    height: 98px;
    line-height: 98px;
    text-align: center;
}
.avatar {
    width: 100%;
    height: 100px;
    display: block;
    border-radius: 6px;
}
</style>