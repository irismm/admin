import { mPattern, ePattern, sNumber } from '@/utils/validate'

export default {
  data () {

    return {
      rules: {
        enterpriseId: [
          { required: true, message: '请选择企业', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2到20 个字符', trigger: 'blur' }
        ],
        technologicalType: [
          { required: false, message: '请选择技术类型', trigger: 'change' }
        ],
        topicType: [
          { required: false, message: '请选择题目类型', trigger: 'change' }
        ],
        topicDetails: [
          { required: true, message: '请输入题目详细', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在 5到200 个字符', trigger: 'blur' }
        ],

        answer: [
          { required: false, message: '请输入答案', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在 5到200 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, trigger: 'change' }
        ]
      }
    }
  }
}
