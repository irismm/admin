<template>
  <Drawer :title="titles" :drawer-show="drawerShow" @close="drawerClose" :id="id" v-loading="loading">
    <el-form :inline="true" class="form" ref="formData" :rules="rules" :model="formData" label-position="right" label-width="120px">
      <div>
        <el-form-item label="代码" prop="codes">
          <el-input v-model="formData.codes" placeholder="请输入代码"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="代码名称" prop="codeName">
          <el-input v-model="formData.codeName" placeholder="请输入代码名称"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="可编辑" prop="editStatus" class="editStatus" v-if="!this.status">
        <el-switch
          v-model="formData.editStatus"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="状态" prop="status" class="status">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="bottom">
      <el-button class="bt" type="primary" @click="save">保存</el-button>
      <el-button class="bt" @click="drawerClose">关闭</el-button>
    </div>
    <div>
      <h2>子选项</h2>
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        :header-cell-style="{background:'#F2F2F2'}"
        style="width: 100%"
        border>
        <el-table-column prop="name" align="center" label="代码"></el-table-column>
        <el-table-column prop="name" align="center" label="名称"></el-table-column>
        <el-table-column prop="status" align="center" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="dialogOpen(scope.row)">编辑</el-button>
            <el-button type="primary" plain v-if="scope.row.status !== 1" @click="changeStatus(scope.row, 0, scope.$index)">启用</el-button>
            <el-button type="primary" plain v-else @click="changeStatus(scope.row, 1, scope.$index)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Edit :dialogVisible="dialogVisible" :dialogData="dialogData" @close="dialogClose" @save="dialogSave"></Edit>
  </Drawer>
</template>

<script>
import { GetStatus } from '@/api/common'
import { Codedetails, UpdateCode, AddCode } from '@/api/code'
import Validate from './validate'
import Drawer from '@/components/Drawer'
import Edit from './edit'
export default {
  name: "drawer",
  props: {
    drawerShow: { required: true, type: Boolean } // 显示隐藏
  },
  mixins: [Validate],
  components: {
    Drawer, Edit
  },
  computed: {
    titles () {
      if (this.status) {
        return this.$route.meta.title + '编辑'
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      loading: true,
      id: null, // 详情页是通过id来查询的
      editValue: false, // 可编辑选项值
      status: false,
      formData: {},
      statusOptions: [], // 状态集合
      tableData: [], // 表格数据集合
      dialogVisible: false,
      dialogData: {} // 对话框数据集合
    }
  },
  mounted () {
    GetStatus().then(res => {
      this.statusOptions = res.filter(r => r.code !== -1)
    })
    this.reload()
  },
  methods: {
    reload (id) {
      if (id) {
        this.loading = true
        Codedetails(id).then(res => {
          this.status = true
          this.formData = res
        }).catch(() => {
          this.formData = { editStatus: 1 }
        }).finally(() => {
          this.loading = false
        })
      }else {
        this.formData = { editStatus: 1 }
        this.status = false
      }
    },
    // 保存
    save () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.formData.id) {
            UpdateCode(this.formData).then(res => {
              this.formData = res
              this.$message({ type: 'success', message: '更新成功' })
            }).finally(() => {
              this.drawerClose(true)
            })
          } else {
            AddCode(this.formData).then(res => {
              this.formData = res
              this.$message({ type: 'success', message: '新增成功' })
            }).finally(() => {
              this.drawerClose(true)
            })
          }
        }
      })
    },
    changeStatus  (rowData, status, index) {

    },
    // 编辑子选项
    dialogClose () {
      this.dialogData = {}
      this.dialogVisible = false
    },
    dialogSave (data) {
      let index = data.index
      delete data.index
      if (this.dialogData.codeList) {
        if (index) {
          this.dialogData.codeList.splice(index, 1, data)
        } else {
          this.dialogData.codeList.push(Object.assign({ status: 1 }, data))
        }
      } else {
        this.$set(this.dialogData, 'codeList', [Object.assign({ status: 1 }, data)])
      }
    },
    dialogOpen (data) {
      this.dialogVisible = true
      this.dialogData = Object.assign({}, data)
    },
    drawerClose (isTrue) {
      this.loading = false
      this.$emit('close', isTrue)
      this.$refs['formData'].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
