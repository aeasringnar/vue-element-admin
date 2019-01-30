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
            <el-table-column prop="title" label="标题" width="180"></el-table-column>
            <el-table-column prop="slot" label="图片" width="200">
                <template slot-scope="scope">
                    <img :src="scope.row.img_url" height="80" width="180" />
                </template>
            </el-table-column>
            <el-table-column prop="h5_url" label="链接"></el-table-column>
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
            :current-page="my_pagination.page"
            :page-sizes="[10, 20, 60, 100]"
            :page-size="my_pagination.page_size"
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
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="ruleForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="H5链接" prop="h5_url">
                        <el-input v-model="ruleForm.h5_url"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model.number="ruleForm.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" required>
                        <el-upload
                            class="avatar-uploader"
                            action="https://btapi.ibeatop.com/website/uploadfile"
                            :headers="headers"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="ruleForm.img_url" :src="ruleForm.img_url" class="avatar">
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
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="ruleForm_patch.title"></el-input>
                    </el-form-item>
                    <el-form-item label="H5链接" prop="h5_url">
                        <el-input v-model="ruleForm_patch.h5_url"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model.number="ruleForm_patch.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" required>
                        <el-upload
                            class="avatar-uploader"
                            action="https://btapi.ibeatop.com/website/uploadfile"
                            :headers="headers"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess_two"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="ruleForm_patch.img_url" :src="ruleForm_patch.img_url" class="avatar">
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
    import { GetAjax, PostAjax, PatchAjax, DeleteAjax } from '@/api/myapi'

    export default {
        name: "banner_manage",
        data () {
            return {
                msg:'banner_manage',
                centerDialogVisible: false,
                centerDialogVisible_two: false,
                centerDialogVisible_patch: false,
                banner_data: [],
                ruleForm: {
                    title: '',
                    img_url: '',
                    banner_type: 0,
                    sort: '',
                    h5_url: 'null'
                },
                rules: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, type: 'number', message: '请输入排序序号', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    h5_url: [
                        { required: true, message: '请输入H5链接', trigger: 'blur' }
                    ],
                },
                ruleForm_patch: {
                    title: '',
                    img_url: '',
                    banner_type: 0,
                    sort: '',
                    h5_url: 'null'
                },
                rules_patch: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, type: 'number', message: '请输入排序序号', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    h5_url: [
                        { required: true, message: '请输入H5链接', trigger: 'blur' }
                    ],
                },
                headers: {'Authorization': 'bearer ' + store.getters.token},
                delete_data: {},
                page_tatol: 100,
                my_pagination: {
                    page: 1,
                    page_size: 10
                }
            }
        },
        methods: {
            get_banner_data(params) {
                GetAjax('/website/banner',params).then(response => {
                    const data = response.data
                    console.log(data)
                    this.banner_data = data
                    this.page_tatol = response.tatol
                }).catch(error => {
                    alert(error)
                })
            },
            post_banner_data(data) {
                PostAjax('/website/banner',data).then(response => {
                    const data = response.data
                    console.log(data)
                    this.centerDialogVisible = false
                    this.$refs['ruleForm'].resetFields()
                    this.ruleForm.img_url = ''
                    this.$message({
                        showClose: true,
                        message: 'success',
                        type: 'success'
                    })
                    this.get_banner_data(this.my_pagination)
                }).catch(error => {
                    alert(error)
                })
            },
            patch_banner_data(data) {
                PatchAjax('/website/banner',data).then(response => {
                    const data = response.data
                    console.log(data)
                    this.centerDialogVisible_patch = false
                    this.$message({
                        showClose: true,
                        message: 'success',
                        type: 'success'
                    })
                    this.get_banner_data(this.my_pagination)
                }).catch(error => {
                    alert(error)
                })
            },
            delete_banner_data(data) {
                DeleteAjax('/website/banner',data).then(response => {
                    const data = response.data
                    console.log(data)
                    this.centerDialogVisible_two = false
                    this.$message({
                        showClose: true,
                        message: 'success',
                        type: 'success'
                    })
                    this.get_banner_data(this.my_pagination)
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
                this.ruleForm.img_url = ''
                this.centerDialogVisible_patch = false
                this.ruleForm_patch.img_url = ''
            },
            handleAvatarSuccess(res, file) {
                // this.ruleForm.img_url = URL.createObjectURL(file.raw)
                this.ruleForm.img_url = file.response.data[0]
                console.log(file.response.data[0])
            },
            handleAvatarSuccess_two(res, file) {
                // this.ruleForm.img_url = URL.createObjectURL(file.raw)
                this.ruleForm_patch.img_url = file.response.data[0]
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
                this.ruleForm_patch.title = row.title
                this.ruleForm_patch.h5_url = row.h5_url
                this.ruleForm_patch.sort = row.sort
                this.ruleForm_patch.img_url = row.img_url
                this.ruleForm_patch.id = row.id
                this.centerDialogVisible_patch = true
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`)
                this.my_pagination.page_size = val
                this.get_banner_data(this.my_pagination)
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`)
                this.my_pagination.page = val
                this.get_banner_data(this.my_pagination)
            }
        },
        created: function() {
            this.get_banner_data(this.my_pagination)
        }
    }
</script>

<style scoped>
/*.el-upload*/
.avatar-uploader {
    height: 180px;
    width: 250px;
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
    width: 248px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 100%;
    height: 180px;
    display: block;
    border-radius: 6px;
}
</style>