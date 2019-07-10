
export default {
  data () {

    // 编码
    let validateCode = (rule, value, callback) => {
      if (value === this.onceCode) {
        callback()
      } else {
        this.axios.get(`/role/getRoleCode/code?code=${this.formData.code}`).then(res => {
          if (res) {
            return callback(new Error('角色编码重复'))
          } else {
            callback()
          }
        })
      }
    }

    return {
      rules: {
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5到20 个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3到20 个字符', trigger: 'blur' }
        ],
        status: [{ required: true, trigger: 'change' }],
        authorityId: [
          { required: true, message: '至少选择一个权限', trigger: 'change' }
        ]
      }
    }
  }
}
