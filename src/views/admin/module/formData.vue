<template>
  <el-dialog :title="!!id ? '管理员编辑':'管理员新增'" :visible.sync="dialogVisible" :before-close="close">
    <el-form ref="formData" :rules="rules" :model="formData" v-loading="loading" label-position="right" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="系统账号" prop="username">
        <el-input v-model="formData.username" placeholder="请输入系统账号" :disabled="!!id"></el-input>
      </el-form-item>
      <div v-show="!id">
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="formData.roleId" multiple placeholder="请选择角色">
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="saveData">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { GetRoleList } from '@/api/role'
import { GetAdmin, UpdateAdmin, AddAdmin } from '@/api/admin'
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
      onceUsername: '',
      formData: {
        roleId: []
      },
      roleOptions: []
    }
  },
  mounted () {
    // 获取所有角色列表
    GetRoleList().then(res => {
      this.roleOptions = res
    })
    this.reload()
  },
  methods :{
    reload () {
      if (this.id) {
        this.loading = true
        GetAdmin(this.id).then(res => {
          res.roleId = res.roleVos.map(r => r.id)
          this.onceUsername = res.username
          this.formData = res
        }).catch(() => {
          this.formData = { roleId: [] }
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.formData = { roleId: [] }
      }
    },
    close (isTrue) {
      this.loading = false
      this.$emit('close', isTrue)
      this.$refs['formData'].resetFields()
      this.onceUsername = ''
    },
    saveData () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.formData.id) {
            UpdateAdmin(this.formData).then(() => {
              this.$message({ type: 'success', message: '更新成功' })
            }).finally(() => {
              this.close(true)
            })
          } else {
            AddAdmin(this.formData).then(() => {
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
