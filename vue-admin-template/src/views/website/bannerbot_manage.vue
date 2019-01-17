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
            <el-table-column prop="name" label="名称" width="120"></el-table-column>
            <el-table-column prop="role" label="角色" width="80"></el-table-column>
            <el-table-column prop="activity" label="参与活动" width="240"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column prop="avatar_url" label="头像" width="80">
                <template scope="scope">
                    <img :src="scope.row.avatar_url" height="60" width="60" />
                </template>
            </el-table-column>
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
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="role">
                        <el-input v-model="ruleForm.role"></el-input>
                    </el-form-item>
                    <el-form-item label="参与活动" prop="activity">
                        <el-input v-model="ruleForm.activity"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <el-input type="textarea" v-model="ruleForm.content" rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model.number="ruleForm.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="头像" required>
                        <el-upload
                            class="avatar-uploader"
                            action="https://btapi.ibeatop.com/website/uploadfile"
                            :headers="headers"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="ruleForm.avatar_url" :src="ruleForm.avatar_url" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
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
                <el-form :model="ruleForm_patch" :rules="rules_patch" ref="ruleForm_patch" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="ruleForm_patch.name"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="role">
                        <el-input v-model="ruleForm_patch.role"></el-input>
                    </el-form-item>
                    <el-form-item label="参与活动" prop="activity">
                        <el-input v-model="ruleForm_patch.activity"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <el-input type="textarea" v-model="ruleForm_patch.content" rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model.number="ruleForm_patch.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="头像" required>
                        <el-upload
                            class="avatar-uploader"
                            action="https://btapi.ibeatop.com/website/uploadfile"
                            :headers="headers"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess_two"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="ruleForm_patch.avatar_url" :src="ruleForm_patch.avatar_url" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
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
    import { get_bannerbottom, post_bannerbottom, patch_bannerbottom, delete_bannerbottom } from '@/api/website'

    export default {
        name: "bannerbot_manage",
        data () {
            return {
                msg:'bannerbot_manage',
                centerDialogVisible: false,
                centerDialogVisible_two: false,
                centerDialogVisible_patch: false,
                banner_data: [],
                ruleForm: {
                    activity: '',
                    avatar_url: '',
                    content: '',
                    sort: '',
                    name: '',
                    role:''
                },
                rules: {
                    activity: [
                        { required: true, message: '请输入参与活动', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, type: 'number', message: '请输入排序序号', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    content: [
                        { required: true, message: '请输入内容', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    role: [
                        { required: true, message: '请输入角色', trigger: 'blur' }
                    ],
                },
                ruleForm_patch: {
                    activity: '',
                    avatar_url: '',
                    content: '',
                    sort: '',
                    name: '',
                    role:''
                },
                rules_patch: {
                    activity: [
                        { required: true, message: '请输入参与活动', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, type: 'number', message: '请输入排序序号', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    content: [
                        { required: true, message: '请输入内容', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    role: [
                        { required: true, message: '请输入角色', trigger: 'blur' }
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
                get_bannerbottom(pk,page,page_size).then(response => {
                    const data = response.data
                    console.log(data)
                    this.banner_data = data
                    this.page_tatol = response.tatol
                }).catch(error => {
                    alert(error)
                })
            },
            post_banner_data(data) {
                post_bannerbottom(data).then(response => {
                    const data = response.data
                    console.log(data)
                    this.centerDialogVisible = false
                    this.$refs['ruleForm'].resetFields()
                    this.ruleForm.avatar_url = ''
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
                patch_bannerbottom(data).then(response => {
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
                delete_bannerbottom(data).then(response => {
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
                this.ruleForm.avatar_url = ''
                this.centerDialogVisible_patch = false
                this.ruleForm_patch.avatar_url = ''
            },
            handleAvatarSuccess(res, file) {
                // this.ruleForm.img_url = URL.createObjectURL(file.raw)
                this.ruleForm.avatar_url = file.response.data[0]
                console.log(file.response.data[0])
            },
            handleAvatarSuccess_two(res, file) {
                // this.ruleForm.img_url = URL.createObjectURL(file.raw)
                this.ruleForm_patch.avatar_url = file.response.data[0]
                console.log(file.response.data[0])
            },
            beforeAvatarUpload(file) {
                var img_type = ['image/jpeg','image/jpg','image/png']
                var img_index = img_type.indexOf(file.type)
                var isJPG = false
                if(img_index != -1){
                    isJPG = true
                }
                console.log(isJPG)
                const isLt2M = file.size / 1024 / 1024 < 20
                if (!isJPG) {
                        this.$message.error('Upload avatar images can only be JPG / JPEG / PNG format!')
                    }
                if (!isLt2M) {
                    this.$message.error("Upload avatar image size can't exceed 20MB!");
                }
                return isJPG && isLt2M;
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
                this.ruleForm_patch.name = row.name
                this.ruleForm_patch.role = row.role
                this.ruleForm_patch.activity = row.activity
                this.ruleForm_patch.content = row.content
                this.ruleForm_patch.sort = row.sort
                this.ruleForm_patch.avatar_url = row.avatar_url
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