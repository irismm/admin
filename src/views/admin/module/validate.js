import { mPattern, ePattern, sNumber, pwd } from '@/utils/validate'

export default {
  data () {

    // 用户名
    let validateUsername = (rule, value, callback) => {
      if (value === this.onceUsername) {
        callback()
      } else {
        this.axios.get(`/admin/getAdminUsername/username?username=${this.formData.username}`).then(res => {
          if (res) {
            return callback(new Error('用户名重复'))
          } else {
            callback()
          }
        })
      }
    }
    // 邮箱
    let checkEmail = (rule, value, callback) => {
      if (ePattern.test(value)) {
        callback()
      }
      return callback(new Error('邮箱格式错误'))
    }

    // 电话
    let checkCellPhone = (rule, value, callback) => {
      if (mPattern.cellPhone.test(value)) {
        callback()
      } else {
        return callback(new Error('类型格式错误'))
      }
    }

    // 密码验证
    const validatePass = (rule, value, callback) => {
      if (pwd.test(value)) {
        callback()
      } else {
        return callback(new Error('类型格式错误'))
      }
    };
    // 修改密码验证
    const validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (pwd.test(value)) {
          callback()
        } else {
          return callback(new Error('密码只包含数字字母下划线，长度在6-18位'))
        }
      }
    };
    // 再次密码验证
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pwdData.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2到20 个字符', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入系统账号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3到20 个字符', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkCellPhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址',trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '至少选择一个权限', trigger: 'change' }
        ],
        password: [
          { required: false, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6到18 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur'}
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6到18 个字符', trigger: 'blur' },
          { validator: validatePass1, trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6到18 个字符', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  }
}
