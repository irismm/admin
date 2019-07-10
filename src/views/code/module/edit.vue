<template>
  <el-dialog title="代码编辑" :visible.sync="dialogVisible" :append-to-body="true" @open="reload" width="40%" :before-close="handleClose">
    <el-form ref="dialogData" :rules="rules" :model="dialogData" label-position="right" label-width="100px">
      <el-form-item label="代码" prop="code">
        <el-input v-model="dialogData.code"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="dialogData.name"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="dialogData.status"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'edit',
  props: {
    dialogData: { required: true, type: Object },
    dialogVisible: { required: true, type: Boolean }
  },

  data () {
    return {

      rules: {
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { max: 50, message: '长度限制 50 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 50, message: '长度限制 50 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入值', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reload () {
      this.$nextTick(_ => {
        this.$refs['dialogData'].clearData()
      })
    },
    handleClose () {
      this.$emit('close')
      this.$refs['dialogData'].clearData(this.dialogData)
    },
    submit () {
      this.$refs['dialogData'].validate(valid => {
        if (valid) {
          this.handleClose()
          this.$emit('save', this.dialogData)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
