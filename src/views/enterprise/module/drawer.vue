<template>
  <Drawer :title="titles" :drawer-show="drawerShow" @close="drawerClose" :id="id" v-loading="loading">
      <el-form class="form" ref="formData" :rules="rules" :model="formData" label-position="right" label-width="120px">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="统一社会代码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入统一社会信用代码"></el-input>
          <span style="margin-left:10px;">查询地址<a href="http://www.gsxt.gov.cn" target="_blank" style="color:#169BD5">http://www.gsxt.gov.cn</a></span>
        </el-form-item>
        <el-form-item label="地址" prop="location">
          <el-input v-model="formData.location" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" prop="LogoUrl">
          <Upload icon="logo" :url="formData.LogoUrl" title="LOGO"
                  :disable-img="disableStatus"
                  @change="changeLogo">
          </Upload>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="官方网站" prop="url">
          <el-input v-model="formData.url" placeholder="请输入官方网站"></el-input>
        </el-form-item>
        <el-form-item label="技术要点" prop="labelIds" class="addTag">
          <el-select v-model="formData.labelIds" multiple placeholder="请选择技术要点">
            <el-option
              v-for="item in labelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
        <!--<el-form-item label="技术要点" prop="labelIds" class="addTag">-->
          <!--<el-tag-->
            <!--v-for="item in formData.labelBeans"-->
            <!--:key="item.id"-->
            <!--closable-->
            <!--:disable-transitions="false"-->
            <!--@close="handleClose(item)">-->
            <!--{{item.name}}-->
          <!--</el-tag>-->
          <!--<el-input-->
            <!--class="input-new-tag"-->
            <!--v-if="inputVisible"-->
            <!--v-model="inputValue"-->
            <!--ref="saveTagInput"-->
            <!--size="small"-->
            <!--@keyup.enter.native="handleInputConfirm"-->
            <!--@blur="handleInputConfirm">-->
          <!--</el-input>-->
          <!--<el-button v-else class="button-new-tag" size="small" @click="showInput">添加标签</el-button>-->
        <!--</el-form-item>-->
        <el-form-item label="所在地区" class="area">
          <el-select v-model="provinceCode" placeholder="请选择省份" @change="changeA">
            <el-option
              v-for="item in provinceOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="cityCode" placeholder="请选择城市" @change="changeB">
            <el-option
              v-for="item in cityOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="formData.areaCode" placeholder="请选择区县" @change="changeC">
            <el-option
              v-for="item in areaOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经营范围" prop="businessScope">
          <el-input type="textarea" :rows="5" v-model="formData.businessScope" placeholder="请输入经营范围"></el-input>
        </el-form-item>
        <el-form-item label="详细介绍" prop="detail">
          <el-input type="textarea" :rows="5" v-model="formData.detail" placeholder="请输入详细介绍"></el-input>
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
import { GetStatus, GetLabel, GetByAreaParentCode, GetAreaCode, AddLabel } from '@/api/common'
import { GetEnterprise, UpdateEnterprise, AddEnterprise } from '@/api/enterprise'
import Validate from './validate'
import Drawer from '@/components/Drawer'
import Upload from '@/components/Upload'
export default {
  name: 'drawer',
  mixins: [Validate],
  props: {
    drawerShow: { required: true, type: Boolean } // 显示隐藏
  },
  components: {
    Drawer, Upload
  },
  computed: {
    titles () {
      if (this.status) {
        return this.$route.meta.title + '编辑'
      } else {
        return ''
      }
    },
    disableStatus () {
      if (this.status) {
        return false
      } else {
        return !!this.id // !this.id  id不存在返回false 新增
      }
    }
  },
  data () {
    return {
      id: null, // 详情页是通过id来查询的
      loading: false,
      onceCode: '',
      status: false,
      formData: {
        LogoUrl: '',
        fileSaveVos: [{ url: '' }],
        fileUpdateVos: [],
        labelBeans: [],
        labelIds: []
      },
      statusOptions: [], // 状态集合
      provinceOptions: [], // 省份集合
      cityOptions: [], // 城市集合
      areaOptions: [], // 区县集合
      provinceCode: '', // 省code
      cityCode: '', // 市code
      areaCode: '', // 区code
      inputVisible: false,
      inputValue: '',
      labelOptions: []
    }
  },
  mounted () {
    // 省份
    GetByAreaParentCode(0).then(res => {
      this.provinceOptions = res
    })

    // 获取状态
    GetStatus().then(res => {
      this.statusOptions = res
    })

    // 获取标签
    GetLabel().then(res => {
      this.labelOptions = res
    })

    this.reload()
  },
  methods: {
    changeA (provinceCode) {
      // 城市
      GetByAreaParentCode(provinceCode).then(res => {
        this.cityOptions = res
      })
      this.cityCode = ''
      this.formData.areaCode = ''
    },
    changeB (cityCode) {
      // 区县
      GetByAreaParentCode(cityCode).then(res => {
        this.areaOptions = res
      })
      this.formData.areaCode = ''
    },
    changeC (areaCode) {
      this.formData.areaCode = areaCode
    },

    reload (id) {
      if (id) {
        this.loading = true
        GetEnterprise(id).then(res => {
          this.status = true
          this.onceCode = res.code
          res.fileSaveVos = res.imageBeans
          res.fileUpdateVos = res.imageBeans
          res.LogoUrl = res.imageBeans.map(r => r.url)[0]
          res.labelIds = res.labelBeans.map(r => r.id)
          GetAreaCode(res.areaCode).then(r => {
            this.areaSet(r)
          })
          this.formData = res
        }).catch(() => {
          this.formData = { labelIds: [], labelBeans: [], fileUpdateVos: [], LogoUrl: '', imageBeans: [], fileSaveVos: [] }
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.formData = { labelIds: [], labelBeans: [], fileUpdateVos: [], LogoUrl: '', imageBeans: [], fileSaveVos: [] }
        this.provinceCode = null
        this.cityCode = null
        this.status = false
      }
    },

    // 保存
    save () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.formData.id) {
            UpdateEnterprise(this.formData).then(() => {
              this.$message({ type: 'success', message: '更新成功' })
            }).finally(() => {
              this.drawerClose(true)
            })
          } else {
            AddEnterprise(this.formData).then(() => {
              this.$message({ type: 'success', message: '保存成功' })
            }).finally(() => {
              this.drawerClose(true)
            })
          }
        }
      })
    },

    changeLogo (data) {
      this.$nextTick(() => {
        this.changeImage('Logo', data)
        this.formData.LogoUrl = data.url
      })
    },
    changeImage (a, data) {
      let vos = {
        applyTo: a,
        name: data.name,
        url: data.url,
        size: data.size,
        md5: data.md5
      }
      if (this.formData.id) {
        this.saveFiles(this.formData.fileUpdateVos, a, vos)
      } else {
        this.saveFiles(this.formData.fileSaveVos, a, vos)
      }
    },
    saveFiles (files, a, vos) {
      if (files.length === 0) {
        files.push(vos)
      } else {
        let is = true
        for (let i = 0; i < files.length; i++) {
          if (files[i].applyTo === a) {
            files[i] = vos
            is = false
            break
          }
        }
        if (is) {
          files.push(vos)
        }
      }
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      let inputValue = this.inputValue
      let oldValues = this.labelOptions.map(r => r.name)
      if (inputValue && oldValues.indexOf(inputValue) === -1) {
        AddLabel(inputValue).then(res => {
          this.labelOptions.push(res)
          this.formData.labelIds.push(res.id)
        })
      } else if (!inputValue) {
        this.$message('标签不能为空,请重新输入')
      } else {
        this.$message('标签重复,请重新输入')
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    clearStatus () {
      this.status = false // 返回最初状态
    },
    drawerClose (isTrue) {
      this.loading = false
      this.$emit('close', isTrue)
      this.$refs['formData'].resetFields()
      this.onceCode = ''
    },
    areaSet (r) {
      for (let index in r) {
        if (r[index].level === 1) {
          this.changeA(r[index].code)
          this.provinceCode = r[index].code
        }
      }
      for (let index in r) {
        if (r[index].level === 2) {
          this.changeB(r[index].code)
          this.cityCode = r[index].code
        }
      }
      for (let index in r) {
        if (r[index].level === 3) {
          this.changeC(r[index].code)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
