import { mPattern, ePattern, sNumber, urlregex } from '@/utils/validate'

export default {
  data () {

    // 电话
    let checkCellPhone = (rule, value, callback) => {
      if(value==''||value==undefined||value==null){
        callback();
      }else {
        if ((!mPattern.cellPhone.test(value)) && value != '') {
          callback(new Error('请输入正确的电话号码'));
        } else {
          callback();
        }
      }
    }

    // 网址
    let validateURL= (rule,value,callback) => {
      if (urlregex.test(value)) {
        callback()
      } else {
        return callback(new Error('网址不合法'))
      }
    }

    return {
      rules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2到20 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入统一社会代码', trigger: 'blur' },
          { min: 18, message: '不允许小于 18 个字符', trigger: 'blur' }
        ],
        location: [
          { required: false, message: '请输入地址', trigger: 'blur' }
        ],
        LogoUrl: [
          { required: false, message: '请选择LOGO', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkCellPhone, message: '手机号不合法', trigger: 'blur'}
        ],
        url: [
          { required: true, message: '请输入网址', trigger: 'blur' },
          { validator: validateURL, message: '请输入合法的网址', trigger: 'blur' }
        ],
        technique: [
          { required: false, message: '请输入技术要点', trigger: 'blur' }
        ],
        areaId: [
          { required: false, message: '请选择地区', trigger: 'change' }
        ],
        businessScope: [
          { required: false, message: '请输入经营范围', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在 5到200 个字符', trigger: 'blur' }
        ],
        detail: [
          { required: false, message: '请输入经营范围', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在 5到200 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, trigger: 'change' }
        ]
      }
    }
  }
}
