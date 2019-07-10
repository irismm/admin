<template>
  <div>
    <header-title>
      <svg-icon icon-class="admin" class-name="icon-add"></svg-icon>
    </header-title>
    <div class="container" v-loading="loading">
      <div class="search">
        <div class="search-right">
          <el-button type="primary" @click="edit">添加管理员</el-button>
          <el-input v-model="query.condition.key" placeholder="请输入搜索关键字"></el-input>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" tooltip-effect="dark" :header-cell-style="{background:'#F2F2F2'}" style="width: 100%" border>
          <el-table-column prop="username" label="账号" align="center"></el-table-column>
          <el-table-column prop="name" align="center" label="姓名"></el-table-column>
          <el-table-column prop="phone" align="center" label="手机号"></el-table-column>
          <el-table-column prop="email" align="center" label="邮箱" width="180"></el-table-column>
          <el-table-column prop="roleVos" align="center" label="角色">
            <template slot-scope="scope">
              {{ roleShow(scope.row.roleVos) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="状态" width="80">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusLabel">{{scope.row.status | statusOpts}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300"><template slot-scope="scope">
              <div v-if="scope.row.username === 'admin'">
                <el-button type="primary" plain @click="edit(scope.row)">编辑</el-button>
              </div>
              <div v-else>
                <el-button type="primary" plain @click="pwdUpdate(scope.row)">更改密码</el-button>
                <el-button type="primary" plain @click="edit(scope.row)">编辑</el-button>
                <el-button type="primary" plain v-if="scope.row.status !== 1" @click="changeStatus(scope.row, scope.$index, 1)">启用</el-button>
                <el-button type="danger" plain v-else @click="changeStatus(scope.row, scope.$index, 0)">禁用</el-button>
                <el-button type="danger" plain @click="handleDelete(scope.$index,scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="query.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="更改密码" :visible.sync="pwdVisible">
      <el-form ref="pwdData" :rules="rules" :model="pwdData" label-position="right" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pwdData.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdData.newPassword" placeholder="请输入新密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input v-model="pwdData.password2" placeholder="请再次输入新密码" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdVisible = false">取消</el-button>
        <el-button type="primary" @click="pwdSave">保存</el-button>
      </div>
    </el-dialog>
    <EditForm ref="formData" :id="id" :dialog-visible="dialogVisible" @close="close"></EditForm>

  </div>
</template>

<script>
import { GetStatus } from '@/api/common'
import { GetAdminPage, UpdatePassword, UpdateStatus, DeleteAdmin } from '@/api/admin'
import Validate from './module/validate'
import EditForm from './module/formData'

let statusOptions = []
export default {
  name: 'Admin',
  components: { EditForm },
  mixins: [ Validate ],
  data () {
    return {
      id: null,
      loading: false,
      query: {
        condition: {
          key: ''
        },
        page: 1,
        size: 5
      },
      total: 2,
      tableData: [],
      pwdVisible: false,
      pwdData: {},
      dialogVisible: false
    }
  },
  mounted () {
    GetStatus().then(res => {
      statusOptions = res
      this.require()
    })
  },
  methods: {
    require () {
      this.loading = true
      GetAdminPage(this.query).then(res => {
        this.tableData = res.content
        this.total = res.totalElements
      }).finally(() => {
        this.loading = false
      })
    },

    // 显示该管理员下的所有角色
    roleShow (roles) {
      if (roles === null) {
        return '没有角色'
      }
      return roles.map(f => f.name).toString()
    },

    // 查询
    search () {
      this.query.page = 1
      this.require()
    },

    // 点击修改密码按钮
    pwdUpdate (row) {
      this.pwdVisible = true
      this.pwdData = Object.assign({}, row)
    },
    // 修改密码对话框内，点保存按钮
    pwdSave () {
      this.$refs['pwdData'].validate((valid) => {
        if (valid) {
          UpdatePassword(this.pwdData).then(() => {
            this.$message({ type: 'success', message: '修改成功' })
          }).catch(() => {
            this.$message({ type: 'error', message: '修改失败' })
          }).finally(() => {
            this.pwdVisible = false
          })
        }
      })
    },

    edit (rowData) {
      if (rowData != null) {
        this.id = rowData.id
      }
      this.$nextTick(() => {
        this.$refs['formData'].reload() // 刷新信息
      })
      this.dialogVisible = true
    },
    close (isTrue) {
      this.dialogVisible = false
      this.id = null
      if (isTrue === true) {
        this.require()
      }
    },

    // 点击启用禁用，刷新页面
    changeStatus (rowData, index, status) {
      let data = { id: rowData.id, status: status }
      this.loading = true
      UpdateStatus(data).then(() => {
        this.tableData[index].status = status
        this.$message({ type: 'success', message: '状态修改成功' })
      }).finally(() => {
        this.loading = false
      })
    },

    // 删除数据
    handleDelete (index, rowData) {
      this.$confirm('确认删除该角色吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        DeleteAdmin(rowData.id).then(() => {
          this.tableData.splice(index, 1)
          this.$message({ type: 'success', message: '删除成功' })
        }).finally(() => {
          this.loading = false
          this.search()
        })
      })
    },
    handleSizeChange (val) { // 更改条数
      this.query.size = val
      this.query.page = 1
      this.require()
    },
    handleCurrentChange (val) { // 更改页数
      this.query.page = val
      this.require()
    }
  },
  filters: {
    statusLabel (value) {
      switch (value) {
        case 0: return 'danger'
        case 1: return ''
        default: return ''
      }
    },
    statusOpts (value) {
      let item = statusOptions.filter(i => i.code === value)[0]
      return item ? item.name : ''
    }
  }
}
</script>

<style scoped>

</style>
