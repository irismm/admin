<template>
  <div>
    <header-title>
      <svg-icon icon-class="user" class-name="icon-add"></svg-icon>
    </header-title>
    <div class="container" v-loading="loading">
      <div class="search">
        <div class="search-right">
          <el-button type="primary" @click="edit">添加用户</el-button>
          <el-input v-model="query.condition.keyword" placeholder="请输入搜索关键字"></el-input>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" tooltip-effect="dark" :header-cell-style="{background:'#F2F2F2'}" style="width: 100%" border>
          <el-table-column prop="id" label="ID" align="center"></el-table-column>
          <el-table-column prop="accountNumber" label="账号" align="center"></el-table-column>
          <el-table-column prop="name" align="center" label="姓名"></el-table-column>
          <el-table-column prop="card" align="center" label="身份证" width="150"></el-table-column>
          <el-table-column prop="phone" align="center" label="手机号" width="120"></el-table-column>
          <el-table-column prop="email" align="center" label="邮箱" width="150"></el-table-column>
          <el-table-column prop="qq" align="center" label="QQ" width="120"></el-table-column>
          <el-table-column prop="skill" align="center" label="技能方向"></el-table-column>
          <el-table-column prop="reportDt" align="center" label="报到日期" width="120"></el-table-column>
          <el-table-column prop="leaveDt" align="center" label="离开日期" width="120"></el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1">正常</el-tag>
              <el-tag v-else-if="scope.row.status === 0" type="danger">禁用</el-tag>
              <el-tag v-else type="danger">无效</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="pwdUpdate(scope.row)">更改密码</el-button>
              <el-button type="primary" plain @click="edit(scope.row,scope.$index)">编辑</el-button>
              <el-button type="primary" plain v-if="scope.row.status !== 1" @click="changeStatus(scope.row, 1, scope.$index)">启用</el-button>
              <el-button type="danger" plain v-else @click="changeStatus(scope.row, 0, scope.$index)">禁用</el-button>
              <el-button type="danger" plain @click="handleDelete(scope.row,scope.$index)">删除</el-button>
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
    <el-dialog title="更改密码" :visible.sync="pwdVisible" v-loading="loading">
      <el-form ref="pwdData" :rules="rules" :model="pwdData" label-position="right" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pwdData.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdData.newPassword" placeholder="请输入新密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input v-model="pwdData.checkpass" placeholder="请再次输入新密码" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdVisible = false">取消</el-button>
        <el-button type="primary" @click="pwdSave">保存</el-button>
      </div>
    </el-dialog>
    <drawer ref="formData" @close="drawerClose" :drawer-show="drawerShow"></drawer>
  </div>
</template>

<script>
import { GetUserPage, UpdatePassword, UpdateStatus, DeleteUser } from '@/api/user'
import Validate from './validate'
import drawer from './module/drawer'
export default {
  name: 'User',
  mixins: [Validate],
  components: {
    drawer
  },
  data () {
    return {
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
      skillOptions: [], // 技能集合
      drawerShow: false,
      drawerStatus: '',
      formData: {},
      pwdVisible: false,
      pwdData: {}
    }
  },
  mounted () {
    this.require()
  },
  methods: {
    require () {
      this.loading = true
      GetUserPage(this.query).then(res => {
        this.tableData = res.content
        this.total = res.totalElements
      }).finally(() => {
        this.loading = false
      })
    },
    // 查询
    search () {
      this.query.page = 1
      this.require()
    },
    // 添加数据或编辑数据
    edit (data, index) {
      this.loading = false
      let id = index >= 0 ? data.id : null
      this.$nextTick(() => {
        this.$refs['formData'].reload(id)
      })
      this.drawerShow = true
    },

    // 点击修改密码按钮
    pwdUpdate (row) {
      this.pwdVisible = true
      this.pwdData = Object.assign({}, row)
    },
    // 修改密码对话框，点保存按钮
    pwdSave () {
      this.$refs['pwdData'].validate((valid) => {
        if (valid) {
          this.loading = true
          UpdatePassword(this.pwdData).then(() => {
            this.$message({ type: 'success', message: '修改成功' })
          }).catch(() => {
            this.$message({ type: 'error', message: '修改失败' })
          }).finally(() => {
            this.loading = false
            this.pwdVisible = false
          })
        }
      })
    },

    // 关闭对话框
    drawerClose (isTrue) {
      this.drawerShow = false
      if (isTrue === true) {
        this.require()
      }
    },

    // 更改启用/禁用状态
    changeStatus (rowData, status, index) {
      let data = { id: rowData.id, status: status }
      this.loading = true
      UpdateStatus(data).then(() => {
        this.tableData[index].status = status
      }).finally(() => {
        this.loading = false
      })
    },
    // 删除数据
    handleDelete (rowData, index) {
      this.$confirm('确认删除该权限吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        DeleteUser(rowData.id).then(() => {
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
  }
}
</script>

<style scoped>

</style>
