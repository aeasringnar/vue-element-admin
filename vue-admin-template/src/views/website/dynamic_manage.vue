<template>
    <div class="app-container">
        <el-row>
            <el-col :span="4"><el-button type="primary" @click="new_data">新增</el-button></el-col>
            <el-col :span="20"></el-col>
        </el-row>
        <br>
        <el-table
            :data="dynamic_data"
            border
            stripe
            style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="dynamic_type_str" label="资讯类型" sortable width="110"></el-table-column>
            <el-table-column prop="img_url" label="图片" width="160">
                <template scope="scope">
                    <img :src="scope.row.img_url" height="80" width="140" />
                </template>
            </el-table-column>
            <el-table-column prop="updated" label="更新时间" width="140"></el-table-column>
            <el-table-column prop="sort" label="排序" width="80"></el-table-column>
            <el-table-column fixed="right" label="操作" width="220">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="to_info(scope.row)">查看</el-button>
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
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="ruleForm.title"></el-input>
                    </el-form-item>
                   <el-form-item label="资讯类型" prop="dynamic_type">
                        <el-select v-model="ruleForm.dynamic_type" placeholder="请选择资讯类型">
                            <el-option label="教育前沿" :value="Number(0)"></el-option>
                            <el-option label="政府资讯" :value="Number(1)"></el-option>
                            <el-option label="校园动态" :value="Number(2)"></el-option>
                            <el-option label="游学视窗" :value="Number(3)"></el-option>
                        </el-select>
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
                    <div >
                        <h3>资讯内容 - 富文本编辑器</h3>
                        <editor id='tinymce' v-model='tinymceHtml' :init='init'></editor>
                        <h3>预览区：</h3>
                        <div v-html='tinymceHtml'></div>
                        <br>
                    </div>
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
                    <el-form-item label="资讯类型" prop="dynamic_type">
                        <el-select v-model="ruleForm_patch.dynamic_type" placeholder="请选择资讯类型">
                            <el-option label="教育前沿" :value="Number(0)"></el-option>
                            <el-option label="政府资讯" :value="Number(1)"></el-option>
                            <el-option label="校园动态" :value="Number(2)"></el-option>
                            <el-option label="游学视窗" :value="Number(3)"></el-option>
                        </el-select>
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
                    <div >
                        <h3>资讯内容 - 富文本编辑器</h3>
                        <editor id='tinymce_patch' v-model='tinymceHtml_patch' :init='init'></editor>
                        <h3>预览区：</h3>
                        <div v-html='tinymceHtml_patch'></div>
                        <br>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm_patch')">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm_patch')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="内容详情"
            :visible.sync="centerDialogVisible_info"
            width="50%"
            center>
            <div v-html='show_content'></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible_info = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible_info = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import tinymce from 'tinymce/tinymce'
    import 'tinymce/themes/modern/theme'
    import Editor from '@tinymce/tinymce-vue'
    import 'tinymce/plugins/image'
    import 'tinymce/plugins/link'
    import 'tinymce/plugins/code'
    import 'tinymce/plugins/table'
    import 'tinymce/plugins/lists'
    import 'tinymce/plugins/contextmenu'
    import 'tinymce/plugins/wordcount'
    import 'tinymce/plugins/colorpicker'
    import 'tinymce/plugins/textcolor'
    import store from '@/store'
    import Vue from 'vue'
    import axios from 'axios'
    import { get_dynamic, post_dynamic, patch_dynamic, delete_dynamic } from '@/api/website'

    export default {
        name: "dynamic_manage",
        data () {
            return {
                msg:'dynamic_manage',
                centerDialogVisible: false,
                centerDialogVisible_two: false,
                centerDialogVisible_patch: false,
                centerDialogVisible_info: false,
                dynamic_data: [],
                ruleForm: {
                    title: '',
                    img_url: '',
                    dynamic_type: 0,
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
                    dynamic_type: [
                        { required: true, message: '请选择资讯类型', trigger: 'change' }
                    ],
                },
                ruleForm_patch: {
                    title: '',
                    img_url: '',
                    dynamic_type: 0,
                    sort: '',
                    content: 'null'
                },
                rules_patch: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, type: 'number', message: '请输入排序序号', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    dynamic_type: [
                        { required: true, message: '请选择资讯类型', trigger: 'change' }
                    ],
                },
                headers: {'Authorization': 'bearer ' + store.getters.token},
                delete_data: {},
                tinymceHtml_patch: ``,
                tinymceHtml: ``,
                init: {
                    language_url: './static/tinymce/zh_CN.js',
                    language: 'zh_CN',
                    skin_url: './static/tinymce/skins/lightgray',
                    height: 500,
                    plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
                    toolbar:
                        'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
                    branding: false,
                    paste_word_valid_elements: '*[*]',        // word需要它
                    paste_data_images: true,                  // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
                    paste_convert_word_fake_lists: false,     // 插入word文档需要该属性
                    images_upload_handler:(blobInfo, success, failure) => {
                        this.handleImgUpload(blobInfo, success, failure)
                    }
                },
                show_content: '',
                delete_data: {},
                currentPage: 1,
                page_tatol: 100,
                current_page_size: 10,
            }
        },
        methods: {
            get_dynamic_data(pk,page,page_size) {
                get_dynamic(pk,page,page_size).then(response => {
                    const data = response.data
                    console.log(data)
                    for(var i in data) {
                        if(data[i].dynamic_type == 0) {
                            data[i].dynamic_type_str = "教育前沿"
                        } else if(data[i].dynamic_type == 1) {
                            data[i].dynamic_type_str = "政府资讯"
                        } else if(data[i].dynamic_type == 2) {
                            data[i].dynamic_type_str = "校园动态"
                        } else if(data[i].dynamic_type == 3) {
                            data[i].dynamic_type_str = "游学视窗"
                        }
                    }
                    this.dynamic_data = data
                    this.page_tatol = response.tatol
                }).catch(error => {
                    alert(error)
                })
            },
            post_dynamic_data(data) {
                post_dynamic(data).then(response => {
                    const data = response.data
                    console.log(data)
                    this.centerDialogVisible = false
                    this.$refs['ruleForm'].resetFields()
                    this.ruleForm.img_url = ''
                    this.tinymceHtml = ``
                    this.$message({
                        showClose: true,
                        message: 'success',
                        type: 'success'
                    })
                    this.get_dynamic_data(null,this.currentPage,this.current_page_size)
                }).catch(error => {
                    alert(error)
                })
            },
            patch_dynamic_data(data) {
                patch_dynamic(data).then(response => {
                    const data = response.data
                    console.log(data)
                    this.centerDialogVisible_patch = false
                    this.$message({
                        showClose: true,
                        message: 'success',
                        type: 'success'
                    })
                    this.get_dynamic_data(null,this.currentPage,this.current_page_size)
                }).catch(error => {
                    alert(error)
                })
            },
            delete_dynamic_data(data) {
                delete_dynamic(data).then(response => {
                    const data = response.data
                    console.log(data)
                    this.centerDialogVisible_two = false
                    this.$message({
                        showClose: true,
                        message: 'success',
                        type: 'success'
                    })
                    this.get_dynamic_data(null,this.currentPage,this.current_page_size)
                }).catch(error => {
                    alert(error)
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formName == 'ruleForm') {
                            console.log(this.ruleForm)
                            if (this.ruleForm.img_url == '') {
                                alert("请上传图片")
                            } else{
                                if(this.tinymceHtml == `` || this.tinymceHtml == `` || this.tinymceHtml == '') {
                                    alert('资讯内容不能为空或默认内容')
                                } else{
                                    // console.log(this.tinymceHtml)
                                    let Base64 = {
                                        encode(str) {
                                            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                                                function toSolidBytes(match, p1) {
                                                    return String.fromCharCode('0x' + p1);
                                                }));
                                        },
                                        decode(str) {
                                            return decodeURIComponent(atob(str).split('').map(function (c) {
                                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                                            }).join(''));
                                        }
                                    };

                                    let encoded = Base64.encode(this.tinymceHtml); 
                                    let decoded = Base64.decode(encoded); 
                                    console.log(encoded)
                                    console.log(decoded)
                                    this.ruleForm.content = encoded
                                    this.post_dynamic_data(this.ruleForm)
                                }
                            }
                        } else{
                            console.log(this.ruleForm_patch)
                            if (this.ruleForm_patch.img_url == '') {
                                alert("请上传图片")
                            } else{
                                if(this.tinymceHtml_patch == `` || this.tinymceHtml_patch == `` || this.tinymceHtml_patch == '') {
                                    alert('资讯内容不能为空或默认内容')
                                } else{
                                    let Base64 = {
                                        encode(str) {
                                            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                                                function toSolidBytes(match, p1) {
                                                    return String.fromCharCode('0x' + p1);
                                                }));
                                        },
                                        decode(str) {
                                            return decodeURIComponent(atob(str).split('').map(function (c) {
                                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                                            }).join(''));
                                        }
                                    };

                                    let encoded = Base64.encode(this.tinymceHtml_patch); 
                                    let decoded = Base64.decode(encoded); 
                                    console.log(encoded)
                                    console.log(decoded)
                                    this.ruleForm_patch.content = encoded
                                    this.patch_dynamic_data(this.ruleForm_patch)
                                }
                            }
                        }
                    } else {
                        console.log('error submit!!')
                        return false;
                    }
                })
            },
            resetForm(formName) {
                this.centerDialogVisible = false
                this.$refs[formName].resetFields()
                this.ruleForm.img_url = ''
                this.tinymceHtml = ``
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
                this.delete_dynamic_data(this.delete_data)
            },
            edit_data(row) {
                console.log(row)
                this.ruleForm_patch.title = row.title
                this.ruleForm_patch.sort = row.sort
                this.ruleForm_patch.img_url = row.img_url
                this.ruleForm_patch.dynamic_type = row.dynamic_type
                this.ruleForm_patch.id = row.id
                let Base64 = {
                    encode(str) {
                        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                            function toSolidBytes(match, p1) {
                                return String.fromCharCode('0x' + p1);
                            }));
                    },
                    decode(str) {
                        return decodeURIComponent(atob(str).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                    }
                };
                // console.log(row)
                let decoded = Base64.decode(row.content)
                this.tinymceHtml_patch = decoded
                this.centerDialogVisible_patch = true
            },
            // 富文本的方法
            to_data() {
                console.log(this.tinymceHtml)
                let Base64 = {
                    encode(str) {
                        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                            function toSolidBytes(match, p1) {
                                return String.fromCharCode('0x' + p1);
                            }));
                    },
                    decode(str) {
                        return decodeURIComponent(atob(str).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                    }
                };

                let encoded = Base64.encode(this.tinymceHtml); 
                let decoded = Base64.decode(encoded); 
                console.log(encoded)
                console.log(decoded)
            },
            handleImgUpload (blobInfo, success, failure) {
                let formdata = new FormData()
                formdata.set('upload_file', blobInfo.blob())
                var new_headers = { headers: this.headers}
                axios.post(process.env.BASE_API + '/website/uploadfile', formdata, new_headers).then(res => {
                // console.log(res.data.data)
                success(res.data.data[0])
                }).catch(res => {
                failure('error')
                })
            },
            // 查看详情
            to_info(row) {
                let Base64 = {
                    encode(str) {
                        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                            function toSolidBytes(match, p1) {
                                return String.fromCharCode('0x' + p1);
                            }));
                    },
                    decode(str) {
                        return decodeURIComponent(atob(str).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                    }
                };
                // console.log(row)
                let decoded = Base64.decode(row.content)
                console.log(decoded)
                this.show_content = decoded
                this.centerDialogVisible_info = true
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`)
                this.current_page_size = val
                this.get_dynamic_data(null,this.currentPage,this.current_page_size)
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`)
                this.currentPage = val
                this.get_dynamic_data(null,this.currentPage,this.current_page_size)
            }
        },
        created: function() {
            tinymce.init({})
            this.get_dynamic_data(null,this.currentPage,this.current_page_size)
        },
        components: {Editor}
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