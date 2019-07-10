 import { mPattern, ePattern, sNumber, pwd, card } from '@/utils/validate'

export default {
  data () {
    // 编码
    let validateUsername = (rule, value, callback) => {
      if (value === this.onceUsername) {
        callback()
      } else {
        this.axios.post(`/userManagement/judgeUnique?accountNumber=${this.formData.accountNumber}`).then(res => {
          if (res) {
            return callback(new Error('账号重复'))
          } else {
            callback()
          }
        })
      }
    }

    // 密码验证
    const validatePass = (rule, value, callback) => {
      if (pwd.test(value)) {
        callback()
      } else {
        return callback(new Error('类型格式错误'))
      }
    }

    // 修改密码验证
    const validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (pwd.test(value)) {
          callback()
        }
        return callback(new Error('密码只包含数字字母下划线，长度在6-18位'))
      }
    };

    // 再次密码验证
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdData.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 身份证号码
    let checkCard = (rule, value, callback) => {
      if (card.test(value)) {
        callback()
      }
      return callback(new Error('身份证号码不合法'))
    }
    // 电话
    let checkCellPhone = (rule, value, callback) => {
      if (mPattern.cellPhone.test(value)) {
        callback()
      }
      return callback(new Error('类型格式错误'))
    }

    // QQ
    let checkQQ = (rule, value, callback) => {
      if (sNumber.numPattern.test(value)) {
        callback()
      }
      return callback(new Error('类型格式错误'))
    }

    // 邮箱
    let checkEmail = (rule, value, callback) => {
      if (ePattern.test(value)) {
        callback()
      }
      return callback(new Error('邮箱格式错误'))
    }

    return {
      rules: {
        accountNumber: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3到20 个字符', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: false, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validatePass1, trigger: 'blur' }
        ],
        checkpass: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2到20 个字符', trigger: 'blur' }
        ],
        picUrl: [
          { required: false, message: '请选择', trigger: 'change' }
        ],
        card: [
          { required: true, message: '请输入身份证', trigger: 'blur' },
          { validator: checkCard, trigger: 'blur' }
        ],
        frontUrl: [
          { required: false, message: '请选择', trigger: 'change' }
        ],
        backUrl: [
          { required: false, message: '请选择', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkCellPhone, trigger: 'blur' }
        ],
        province: [
          { required: false, message: '请选择籍贯1', trigger: 'change' }
        ],
        nativePlace: [
          { required: false, message: '请选择籍贯2', trigger: 'change' }
        ],
        qq: [
          { required: false, message: '请输入QQ号码', trigger: 'blur' },
          { validator: checkQQ, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        skill: [
          { required: false, message: '请选择技能', trigger: 'change' }
        ],
        reportDt: [
          { required: true, message: '请输入报到日期', trigger: 'blur' }
        ],
        leaveDt: [
          { required: true, message: '请输入离开日期', trigger: 'blur' }
        ],
        status: [
          { required: true, trigger: 'change' }
        ]
      }
    }
  }
}
