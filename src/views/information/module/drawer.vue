<template>
  <Drawer :title="titles" :drawer-show="drawerShow" @close="drawerClose" :id="id" v-loading="loading">
    <el-form class="form" ref="formData" :rules="rules" :model="formData" label-position="right" label-width="120px">
      <el-form-item label="企业名称">
        <el-select v-model="formData.enterprises" value-key="id" placeholder="请选择企业名称" @change="selectEnterprise">
          <el-option
            v-for="item in enterprises"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="技术类型" prop="technologicalType">
        <el-select v-model="formData.technologicalType" placeholder="请选择技术类型">
          <el-option
            v-for="item in skillOptions"
            :key="item.type"
            :label="item.bankTechnologicalType"
            :value="item.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目类型" prop="topicType">
        <el-select v-model="formData.topicType" placeholder="请选择题目类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.type"
            :label="item.bankTopicType"
            :value="item.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目详细" prop="topicDetails">
        <tinymce id="d1" v-model="formData.topicDetails" :other_options="initTinymce" height="300"></tinymce>
      </el-form-item>
      <div v-show="formData.topicType === 2 || formData.topicType === 3">
        <el-form-item v-for="(item,index) in formData.optionCodesBeans" v-show="isShow">
          <el-input v-model="item.bankOptionCodes" placeholder="选项" style="width:60px;"></el-input>
          <el-input v-model="item.content" placeholder="请输入内容"></el-input>
          <el-button class="bt" type="danger" @click.native="deleteKnowledge(index,item.id)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="bt" type="text" @click.native="addKnowledgeItem"> + 添加选项</el-button>
        </el-form-item>
      </div>
      <el-form-item label="标签" class="addTag" prop="label">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">添加标签</el-button>
      </el-form-item>
      <el-form-item label="问题解答" prop="answer">
        <el-input type="textarea" :rows="5" v-model="formData.answer" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
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
  </Drawer>
</template>

<script>
import { GetStatus } from '@/api/common'
import { GetEnterpriseList } from '@/api/enterprise'
import { SelectType, SelectTopic, GetDatails, UpdateImformation, AddImformation, DeleteBankOption } from '@/api/imformation'
import Validate from './validate'
import tinymce from 'vue-tinymce-editor'
import Drawer from '@/components/Drawer'
export default {
  name: 'drawer',
  mixins: [Validate],
  props: {
    drawerShow: { required: true, type: Boolean } // 显示隐藏
  },
  components: {
    Drawer, tinymce
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
      id: null, // 详情页是通过id来查询的
      loading: false,
      status: false,
      isChoice: false,
      isShow: false,
      formData: {
        enterprises: {},
        optionCodesBeans: [],
        optionCodesVoList: [],
        optionCodesUpdateVoList: []
      },
      initTinymce: {
        language_url: '/static/tinymce/langs/zh_CN.js' //This url points to location of persian language file.
      },
      enterprises: [], //企业集合
      skillOptions: [], // 技术类型集合
      typeOptions:[], // 题目类型集合
      statusOptions: [], // 状态集合,
      dynamicTags: ['Java', 'Spring', 'VueJs'],
      inputVisible: false,
      inputValue: ''
    }
  },
  mounted() {
    // 企业
    GetEnterpriseList().then(res => {
      this.enterprises = res.map( r => {
        return { id: r.id, name: r.name}
      })
    })

    // 技术类型
    SelectType().then(res => {
      this.skillOptions = res
    })

    // 题目类型
    SelectTopic().then(res => {
      this.typeOptions = res
    })

    // 状态
    GetStatus().then(res => {
      this.statusOptions = res.filter(r => r.code!==-1)
    })

    //初始化
    this.reload()
  },
  methods: {
    reload (id) {
      if (id) {
        this.loading = true
        GetDatails(id).then(res => {
          this.status = true
          res.enterprises = {id: res.enterpriseId, name: res.enterpriseName }
          res.optionCodesVoList = res.optionCodesBeans
          res.optionCodesUpdateVoList = res.optionCodesBeans
          this.formData = res
        }).catch(() => {
          this.formData = { optionCodesBeans: [], optionCodesVoList: [], optionCodesUpdateVoList: []}
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.formData = { optionCodesBeans: [], optionCodesVoList: [], optionCodesUpdateVoList: []}
        this.status = false
      }

    },

    // 保存
    save () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.formData.id) {
            UpdateImformation(this.formData).then(res => {
              this.formData = res
              this.$message({ type: 'success', message: '更新成功' })
            }).finally(() => {
              this.drawerClose(true)
            })
          } else {
            AddImformation(this.formData).then(res => {
              this.formData = res
              this.$message({ type: 'success', message: '保存成功' })
            }).finally(() => {
              this.drawerClose(true)
            })
          }
        }
      })
    },

    // 企业选项框事件
    selectEnterprise (e) {
      this.formData.enterpriseId = e.id
      this.formData.enterpriseName = e.name
    },

    deleteKnowledge (index,id) {
      this.$confirm('确认删除该选项吗?', '提示', {
        type: 'warning'
      }).then(() => {
        DeleteBankOption(id).then(() => {
          this.formData.optionCodesBeans.splice(index,1)
          this.$message({ type: 'success', message: '删除成功' })
        }).catch((err) => {
          this.$message({ type: 'err', message: err })
        })
      })
    },
    addKnowledgeItem () {
      this.isShow = true
      let item = {
        id: '',
        bankOptionCodes: '',
        content: ''
      }
      if (this.formData.id) {
        this.saveFiles(this.formData.optionCodesUpdateVoList,item.bankOptionCodes,item)
      } else {
        this.formData.optionCodesBeans.push(item)
        this.saveFiles(this.formData.optionCodesVoList,item.bankOptionCodes,item)
      }
    },
    saveFiles (files,a,item) {
      if (files.length === 0){
        files.push(item)
      }else {
        let is = true
        for (let i = 0; i < files.length; i++) {
          if(files[i].bankOptionCodes === a && files[i].bankOptionCodes){
            files[i] = item
            is = false
            break
          }
        }
        if(is){
          files.push(item)
        }
      }
    },

    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
        this.formData.label = inputValue

      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    clearStatus () {
      this.status = false // 返回最初状态
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
