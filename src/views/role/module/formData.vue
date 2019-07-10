<template>
  <el-dialog :title="!!id ? '角色编辑':'角色新增'" :visible.sync="dialogVisible" :before-close="close">
    <el-form ref="formData" :rules="rules" :model="formData" v-loading="loading" label-position="right" label-width="80px">
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入角色编码"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色状态" prop="status">
        <el-checkbox v-model="formData.status" :true-label="1" :false-label="0">启用</el-checkbox>
      </el-form-item>
      <el-form-item label="角色权限" prop="authorityId">
        <el-checkbox-group v-model="formData.authorityId" @change="handleChange">
          <el-checkbox v-for="item in permissions" :key="item.id" :label="item.id">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { GetAuthorityList } from '@/api/permission'
import { GetRole, UpdateRole, AddRole } from '@/api/role'

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
      permissions: [],
      loading: false,
      onceCode: '',
      formData: {
        authorityId: []
      }
    }
  },
  mounted () {
    // 获取所有的权限
    GetAuthorityList().then(res => {
      this.permissions = res
    })
    this.reload()
  },
  methods :{
    handleChange() {
      this.$emit('change', this.formData.authorityId)
    },
    reload () {
      if (this.id) {
        this.loading = true
        GetRole(this.id).then(res => {
          res.authorityId = res.authorityVos.map(r => r.id)
          this.onceCode = res.code
          this.formData = res
        }).catch(() => {
          this.formData = { status: 1, authorityId: []}
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.formData = { status: 1, authorityId: []}
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
            UpdateRole(this.formData).then(() => {
              this.$message({ type: 'success', message: '更新成功' })
            }).finally(() => {
              this.close(true)
            })
          } else {
            AddRole(this.formData).then(() => {
              this.$message({ type: 'success', message: '新增成功' })
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
