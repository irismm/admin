import { mPattern, ePattern, sNumber } from '@/utils/validate'

export default {
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error('请输入密码'));
      } else {
        if (this.pwdData.checknewpass !== "") {
          this.$refs.pwdData.validateField('checknewpass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pwdData.newpass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      rules: {
        newpass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6到18 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: [ 'blur', 'change' ]}
        ],
        checknewpass: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6到18 个字符', trigger: 'blur' },
          { validator: validatePass2, trigger: [ 'blur', 'change' ]}
        ]
      }
    }
  }
}
