<template>
  <div>
    <header-title>
      <svg-icon icon-class="code" class-name="icon-add"></svg-icon>
    </header-title>
    <div class="container" v-loading="loading">
      <div class="search">
        <div class="search-right">
          <transition name="fade">
            <div v-show="toolShow" style="margin-left: 10px;float: left">
              <el-button type="primary" @click="changeStatus">启用</el-button>
              <el-button @click="changeStatus">禁用</el-button>
            </div>
          </transition>
          <el-button type="primary" @click="edit">添加代码</el-button>
          <el-input v-model="query.condition.keyword" placeholder="请输入搜索关键字"></el-input>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
      </div>
      <div class="table">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" :header-cell-style="{background:'#F2F2F2'}" style="width: 100%" border
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="codes" align="center" label="代码"></el-table-column>
          <el-table-column prop="codeName" align="center" label="名称"></el-table-column>
          <el-table-column prop="editStatus" align="center" label="可编辑" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.editStatus === 1">是</el-tag>
              <el-tag v-else type="danger">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1">正常</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="220">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="edit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="primary" plain v-if="scope.row.status !== 1" @click="changeStatus(scope.row, scope.$index,1)">启用</el-button>
              <el-button type="danger" plain v-else @click="changeStatus(scope.row, scope.$index,0)">禁用</el-button>
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
import { GetCodePage, UpdateStatus, DeleteCode } from '@/api/code'
import drawer from './module/drawer'
export default {
  name: 'Code',
  components: {
    drawer
  },
  data (){
    return {
      loading: false,
      toolShow: false, // 工具显示隐藏
      query: {
        condition: {
          keyword: ''
        },
        page: 1,
        size: 5
      },
      total: 0,
      tableData: [],
      drawerShow: false, // 编辑框显示隐藏
      drawerStatus: '',
      formData: {},
      multipleSelection: []
    }
  },
  mounted () {
    this.require()
  },
  methods:{
    require () {
      this.loading = true
      GetCodePage(this.query).then(res => {
        this.tableData = res.content
        this.total = res.totalElements
      }).finally(() => {
        this.loading = false
      })
    },

    // 查询
    search () {
      this.require()
    },
    // 添加数据或编辑数据
    edit (index,rowData) {
      this.loading = false
      let id = index >=0 ? rowData.id : null
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
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.toolShow = this.multipleSelection.length > 0
    },
    // 更改启用/禁用状态
    changeStatus (rowData,index,status) {
      let data = { id: rowData.id, status:status}
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
      this.$confirm('确认删除该权限吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        DeleteCode(rowData.id).then(() => {
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
