<template>
  <el-dialog :title="!!id ? '权限编辑':'权限新增'" :visible.sync="dialogVisible" :before-close="close">
    <el-form ref="formData" :rules="rules" :model="formData" v-loading="loading" label-position="right" label-width="80px">
      <el-form-item label="权限编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入权限编码"></el-input>
      </el-form-item>
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入权限名称"></el-input>
      </el-form-item>
      <el-form-item label="权限状态" prop="status">
        <el-checkbox v-model="formData.status" :true-label="1" :false-label="0">启用</el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { GetAuthority, UpdateAuthority, AddAuthority } from '@/api/permission'
import Validate from './validate'

export default {
  name: 'formConfig',
  props: {
    id: { type: Number },
    dialogVisible: { required: false, type: Boolean }
  },
  mixins: [Validate],
  data () {
    return {
      loading: false,
      onceCode: '',
      formData: {}
    }
  },
  mounted () {
    this.reload()
  },
  methods :{
    reload () {
      if (this.id) {
        this.loading = true
        GetAuthority(this.id).then(res => {
          this.onceCode = res.code
          this.formData = res
        }).catch(() => {
          this.formData = { status: 1}
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.formData = { status: 1}
      }
    },
    close (isTrue) {
      this.loading = false
      this.$emit('close', isTrue)
      this.$refs['formData'].resetFields()
      this.onceCode = ''
    },
    saveData () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.formData.id) {
            UpdateAuthority(this.formData).then(() => {
              this.$message({ type: 'success', message: '更新成功' })
            }).finally(() => {
              this.close(true)
            })
          } else {
            AddAuthority(this.formData).then(() => {
              this.$message({ type: 'success', message: '更新成功' })
            }).finally(() => {
              this.close(true)
            })
          }
        }
      })
    },
  }

}
</script>

<style scoped>

</style>
