
export default {
  data () {


    return {
      rules: {
        codes: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { max: 50, message: '长度限制 50 个字符', trigger: 'blur' }
        ],
        codeName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 50, message: '长度限制 50 个字符', trigger: 'blur' }
        ],
        status: [{ required: true, trigger: 'change' }],
        editStatus: [{ required: true, trigger: 'change' }]
      }
    }
  }
}
