<template>
  <div>
    <header-title>
      <svg-icon icon-class="information" class-name="icon-add"></svg-icon>
    </header-title>
    <div class="container" v-loading="loading">
      <div class="search">
        <div class="search-right">
          <el-button type="primary" @click="handleEdit">添加题目</el-button>
          <el-input v-model="query.condition.keyword" placeholder="请输入搜索关键字"></el-input>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="text" @click="openAdvancedSearch">高级搜索</el-button>
        </div>
        <div v-show="isShow" class="search-isShow">
          <h3>高级搜索</h3>
          <el-form :model="query.condition" label-position="right" label-width="70px">
            <div>
              <el-form-item label="技术类型" prop="technologicalType">
                <!--<el-checkbox-group v-model="query.condition.technologicalType" @change="handleChangeTech">-->
                  <!--<el-checkbox v-for="item in skillOptions" :key="item.type" :label="item.type">-->
                    <!--{{item.bankTechnologicalType}}-->
                  <!--</el-checkbox>-->
                <!--</el-checkbox-group>-->
                <el-select v-model="query.condition.technologicalType" clearable placeholder="请选择技术类型">
                  <el-option
                    v-for="item in skillOptions"
                    :key="item.type"
                    :label="item.bankTechnologicalType"
                    :value="item.type">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题目类型" prop="topicType">
                <!--<el-checkbox-group v-model="query.condition.topicType" @change="handleChangeTopic">-->
                  <!--<el-checkbox v-for="item in typeOptions" :key="item.type" :label="item.type">-->
                    <!--{{item.bankTopicType}}-->
                  <!--</el-checkbox>-->
                <!--</el-checkbox-group>-->
                <el-select v-model="query.condition.topicType" clearable placeholder="请选择题目类型">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.type"
                    :label="item.bankTopicType"
                    :value="item.type">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="重要级" class="level">
                <el-input v-model="query.condition.startDt" placeholder="请输入级别"></el-input>
                <span>-</span>
                <el-input v-model="query.condition.endDt" placeholder="请输入级别"></el-input>
              </el-form-item>
              <el-form-item label="添加时间" class="dateSelect">
                <el-date-picker v-model="query.condition.startDt" type="date" placeholder="选择日期"></el-date-picker>
                <span>-</span>
                <el-date-picker v-model="query.condition.endDt" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>
            <div>
              <!--<el-form-item label="公司" prop="enterpriseName" class="company">-->
                <!--<el-input v-model="query.condition.enterpriseName" placeholder="请输入公司"></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="公司" class="company">
                <el-select v-model="query.condition.enterprises" value-key="id" placeholder="请选择公司" @change="selectEnterprise">
                  <el-option
                    v-for="item in enterprises"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题目" prop="title" class="question">
                <el-input v-model="query.condition.title" placeholder="请输入题目"></el-input>
              </el-form-item>
            </div>
            <div class="btn">
              <el-button type="primary" @click="advancedSearch">搜索</el-button>
            </div>
          </el-form>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" tooltip-effect="dark" :header-cell-style="{background:'#F2F2F2'}" style="width: 100%" border>
          <el-table-column prop="id" label="ID" align="center"></el-table-column>
          <el-table-column prop="technologicalType" align="center" label="技术类型">
            <template slot-scope="scope">
              <span>{{scope.row.technologicalType | techTypeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" align="center" label="标题" width="180"></el-table-column>
          <el-table-column prop="topicType" align="center" label="类型">
            <template slot-scope="scope">
              <span>{{scope.row.topicType | topicTypeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="label" align="center" label="标签"></el-table-column>
          <el-table-column prop="website" align="center" label="重要性"></el-table-column>
          <el-table-column prop="enterpriseName" align="center" label="所属公司" width="120"></el-table-column>
          <el-table-column prop="updateDt" align="center" label="添加日期" width="120"></el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1">正常</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="280">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="handleDetail(scope.row,scope.$index)">详细</el-button>
              <el-button type="primary" plain @click="handleEdit(scope.row,scope.$index)">编辑</el-button>
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
    <drawer ref="formData" @close="drawerClose" :drawer-show="drawerShow"></drawer>
    <detail ref="detailData" @close="detailClose" :detail-show="detailShow"></detail>
  </div>
</template>

<script>
import { GetEnterpriseList } from '@/api/enterprise'
import { GetImformationPage, SelectType, SelectTopic, SelectPage, UpdateStatus, DeleteData } from '@/api/imformation'
import drawer from './module/drawer'
import detail from './module/detail'
let skillOptions = []
let typeOptions = []

export default {
  name: 'information',
  components: {
    drawer, detail
  },
  data () {
    return {
      query: {
        condition: {
          keyword: '',
          endDt: '',
          enterpriseName: '',
          startDt: '',
          technologicalType: '',
          title: '',
          topicType: '',
          enterprises: {}
        },
        page: 1,
        size: 5
      },
      enterprises: [], // 企业集合
      skillOptions: [], // 技术类型集合
      typeOptions: [], // 题目类型集合
      total: 0,
      isShow: false,
      loading: false,
      tableData: [],
      drawerShow: false,
      detailShow: false,
      drawerStatus: '',
      formData: {},
      detailData: {}
    }
  },
  mounted () {
    // 技术类型
    SelectType().then(res => {
      this.skillOptions = res
      skillOptions = res
    })
    // 题目类型
    SelectTopic().then(res => {
      this.typeOptions = res
      typeOptions = res
    })
    // 公司
    GetEnterpriseList().then(res => {
      this.enterprises = res.map(r => {
        return { id: r.id, name: r.name }
      })
    })
    this.require()
  },
  methods: {
    handleChangeTech (e) {
      this.query.condition.technologicalType = e
    },
    handleChangeTopic (e) {
      this.query.condition.topicType = e
    },
    require () {
      this.loading = true
      GetImformationPage(this.query).then(res => {
        this.tableData = res.content
        this.total = res.totalElements
      }).finally(() => {
        this.loading = false
      })
    },
    // 添加数据或编辑数据或详情
    handleEdit (rowData, index) {
      this.loading = false
      let id = index >= 0 ? rowData.id : null
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
    handleDetail (rowData, index) {
      this.loading = false
      let id = index >= 0 ? rowData.id : null
      this.$nextTick(() => {
        this.$refs['detailData'].reload(id)
      })
      this.detailShow = true
    },
    // 关闭对话框
    detailClose () {
      this.detailShow = false
    },
    // 企业选项框事件
    selectEnterprise (e) {
      this.query.condition.enterpriseId = e.id
      this.query.condition.enterpriseName = e.name
    },
    // 搜索按钮
    search () {
      this.query.page = 1
      this.require()
    },
    // 打开关闭高级搜索
    openAdvancedSearch () {
      this.isShow = !this.isShow
    },
    // 高级搜索内的搜索按钮
    advancedSearch () {
      this.query.page = 1
      this.reloadData()
    },
    reloadData () {
      this.loading = true
      SelectPage(this.query).then(res => {
        this.tableData = res.content
        this.total = res.totalElements
      }).finally(() => {
        this.loading = false
      })
    },

    // 更改启用/禁用状态
    changeStatus (rowData, status, index) {
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
    handleDelete (rowData, index) {
      this.$confirm('确认删除该角色吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        DeleteData(rowData.id).then(() => {
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
    techTypeFilter (value) {
      let item = skillOptions.filter(i => i.type === value)[0]
      return item ? item.bankTechnologicalType : ''
    },
    topicTypeFilter (value) {
      let item = typeOptions.filter(i => i.type === value)[0]
      return item ? item.bankTopicType : ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
