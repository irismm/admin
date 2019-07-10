<template>
  <div>
    <header-title>
      <svg-icon icon-class="permission" class-name="icon-add"></svg-icon>
    </header-title>
    <div class="container" v-loading="loading">
      <div class="search">
        <div class="search-right">
          <el-button type="primary" @click="edit">添加权限</el-button>
          <el-input v-model="query.condition.key" placeholder="请输入搜索关键字"></el-input>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" tooltip-effect="dark" :header-cell-style="{background:'#F2F2F2'}" style="width: 100%" border>
          <el-table-column prop="code" label="编码" align="center"></el-table-column>
          <el-table-column prop="name" align="center" label="名称"></el-table-column>
          <el-table-column prop="status" align="center" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1">正常</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="edit(scope.row,scope.$index)">编辑</el-button>
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
    <EditForm ref="formData" :id="id" :dialogVisible="dialogVisible" @close="close"></EditForm>
  </div>
</template>

<script>
import { GetAuthorityPage, DeleteAuthority } from '@/api/permission'
import EditForm from './module/formData'

export default {
  name: 'Permission',
  components: { EditForm },
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
      total: 0,
      tableData: [],
      dialogVisible: false
    }
  },
  mounted () {
    this.require()
  },
  methods: {
    require () {
      this.loading = true
        GetAuthorityPage(this.query).then(res => {
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
    // 删除数据
    handleDelete (rowData, index) {
      let id = rowData.id
      if (rowData.status === 1) {
        this.$message('该权限已被启用，不能删除！')
      } else {
        this.$confirm('确认删除该权限吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true
          DeleteAuthority(id).then(() => {
            this.tableData.splice(index, 1)
            this.$message({ type: 'success', message: '删除成功' })
          }).finally(() => {
            this.loading = false
            this.search()
          })
        })
      }
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
