<template>
  <div>
    <header-title>
      <svg-icon icon-class="enterprise" class-name="icon-add"></svg-icon>
    </header-title>
    <div class="container" v-loading="loading">
      <div class="search">
        <div class="search-right">
          <el-button type="primary" @click="edit">添加企业</el-button>
          <el-input v-model="query.condition.key" placeholder="请输入搜索关键字"></el-input>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" tooltip-effect="dark" :header-cell-style="{background:'#F2F2F2'}" style="width: 100%" border>
          <el-table-column prop="id" label="ID" align="center"></el-table-column>
          <el-table-column prop="name" align="center" label="名称" width="180"></el-table-column>
          <el-table-column prop="code" align="center" label="统一社会信用代码" width="180"></el-table-column>
          <el-table-column prop="phone" align="center" label="联系电话" width="120"></el-table-column>
          <el-table-column prop="location" align="center" label="地址" width="300"></el-table-column>
          <el-table-column prop="url" align="center" label="官方网站" width="200"></el-table-column>
          <el-table-column prop="updateDt" align="center" label="更新日期" width="120"></el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusLabel">{{scope.row.status | statusOpts}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="220">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="edit(scope.row,scope.$index)">编辑</el-button>
              <el-button type="primary" plain v-if="scope.row.status !== 1" @click="changeStatus(scope.row, scope.$index , 1)">启用</el-button>
              <el-button type="danger" plain v-else-if="scope.row.status !== 0" @click="changeStatus(scope.row, scope.$index, 0)">禁用</el-button>
              <el-button type="info" plain v-else @click="changeStatus(scope.row, scope.$index, -1)">注销</el-button>
              <el-button type="danger" plain @click="handleDelete(scope.$index,scope.row)">删除</el-button>
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
    <drawer ref="formData" @close="drawerClose" :drawer-show="drawerShow"></drawer>
  </div>
</template>

<script>
import { GetStatus } from '@/api/common'
import { GetEnterprisePage, UpdateStatus, DeleteEnterprise } from '@/api/enterprise'
import drawer from './module/drawer'
let statusOptions = []
export default {
  name: 'Enterprise',
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
      total: 0,
      tableData: [],
      drawerShow: false,
      drawerStatus: '',
      formData: {},
      options: [
        { key: 'true', name: '激活' },
        { key: 'false', name: '锁定' }
      ],
      value: ''
    }
  },
  mounted () {
    GetStatus().then(res => {
      statusOptions = res
    })
    this.require()
  },
  methods: {
    require () {
      this.loading = true
      GetEnterprisePage(this.query).then(res => {
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

    // 关闭对话框
    drawerClose (isTrue) {
      this.drawerShow = false
      if (isTrue === true) {
        this.require()
      }
    },

    // 更改启用/禁用状态
    changeStatus (rowData, index, status) {
      let data = { id: rowData.id, status: status }
      this.loading = true
      UpdateStatus(data).then(() => {
        this.tableData[index].status = status
        this.$message({ type: 'success', message: '状态修改成功' })
      }).finally(() => {
        this.loading = false
        this.search()
      })
    },
    // 删除数据
    handleDelete (index, rowData) {
      this.$confirm('确认删除该企业信息吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        DeleteEnterprise(rowData.id).then(() => {
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
        case 1: return 'primary'
        case 0: return 'danger'
        case -1: return 'info'
        default: return 'primary'
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
