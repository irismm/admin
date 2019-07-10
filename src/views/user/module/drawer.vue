<template>
  <Drawer :title="titles" :drawer-show="drawerShow" @close="drawerClose" :id="id" v-loading="loading">
    <el-form class="form" ref="formData" :rules="rules" :model="formData" label-position="right" label-width="100px">
      <el-form-item label="用户账号" prop="accountNumber">
        <el-input v-model="formData.accountNumber" placeholder="请输入用户账号"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入登录密码"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="picUrl">
        <Upload icon="picture" :url="formData.picUrl" title="头像"
                :disable-img="disableStatus" class="sfz"
                @change="changePicture">
        </Upload>
      </el-form-item>
      <el-form-item label="身份证号码" prop="card">
        <el-input v-model="formData.card" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-form-item label="身份证照片">
        <div class="uploadRow">
          <Upload icon="front" :url="formData.frontUrl" title="身份证正面"
                  :disable-img="disableStatus" class="sfz"
                  @change="changeFront">
          </Upload>
          <Upload icon="back" :url="formData.backUrl" title="身份证背面"
                  :disable-img="disableStatus" class="sfz"
                  @change="changeBack">
          </Upload>
        </div>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="籍贯" prop="nativePlace" class="area2">
        <el-select v-model="province" placeholder="请选择省份" @change="changeA">
          <el-option
            v-for="item in provinceOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
        <el-select v-model="formData.nativePlace" placeholder="请选择城市" @change="changeB">
          <el-option
            v-for="item in cityOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="QQ" prop="qq">
        <el-input v-model="formData.qq" placeholder="请输入QQ号码"></el-input>
      </el-form-item>
      <el-form-item label="email" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="技能方向" prop="skill">
        <el-select filterable allow-create default-first-option v-model="formData.skill"
                   placeholder="请选择技能方向">
          <el-option
            v-for="(item,index) in skillOptions"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报到日期" prop="reportDt">
        <el-date-picker
          v-model="formData.reportDt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择报到日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="离开日期" prop="leaveDt">
        <el-date-picker
          v-model="formData.leaveDt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择离开日期">
        </el-date-picker>
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
      <el-button class="bt" @click="drawerClose">取消</el-button>
    </div>
  </Drawer>
</template>

<script>
import { GetStatus, GetByAreaParentCode, GetAreaCode } from '@/api/common'
import { GetUser, UpdateUser, AddUser } from '@/api/user'
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
      onceUsername: '',
      loading: false,
      id: null, // 详情页是通过id来查询的
      status: false,
      formData: {
        picUrl: '',
        frontUrl: '',
        backUrl: '',
        fileSaveVos: [],
        fileUpdateVos: []
      },
      provinceOptions: [], // 省份集合
      cityOptions: [], // 城市集合
      province: '',
      skillOptions: ['web前端', 'java后端'], // 技术类型集合
      statusOptions: [] // 状态集合
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

    this.reload()
  },
  methods: {
    reload (id) {
      if (id) {
        this.loading = true
        GetUser(id).then(res => {
          this.status = true
          this.onceUsername = res.accountNumber
          res.fileSaveVos = res.fileBeans
          res.fileUpdateVos = res.fileBeans
          res.picUrl = res.fileBeans.filter(r => r.applyTo === 'logo').map(r => r.url)[0]
          res.frontUrl = res.fileBeans.filter(r => r.applyTo === 'front').map(r => r.url)[0]
          res.backUrl = res.fileBeans.filter(r => r.applyTo === 'back').map(r => r.url)[0]
          GetAreaCode(res.nativePlace).then(r => {
            this.areaSet(r)
          })
          this.formData = res
        }).catch(() => {
          this.formData = { picUrl: '', frontUrl: '', backUrl: '', fileSaveVos: [], fileUpdateVos: [], fileBeans: [] }
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.formData = { picUrl: '', frontUrl: '', backUrl: '', fileSaveVos: [], fileUpdateVos: [], fileBeans: [] }
        this.status = false
      }
    },
    // 保存
    save () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.formData.id) {
            UpdateUser(this.formData).then(() => {
              this.$message({ type: 'success', message: '更新成功' })
            }).finally(() => {
              this.drawerClose(true)
            })
          } else {
            AddUser(this.formData).then(() => {
              this.$message({ type: 'success', message: '新增成功' })
            }).finally(() => {
              this.drawerClose(true)
            })
          }
        }
      })
    },
    // 籍贯选择
    changeA (e) {
      this.formData.nativePlace = ''
      // 城市
      GetByAreaParentCode(e).then(res => {
        this.cityOptions = res
      })
    },
    changeB (e) {
      this.formData.nativePlace = e
    },
    // 头像
    changePicture (data) {
      this.$nextTick(() => {
        this.changeImage('logo', data)
        this.formData.picUrl = data.url
      })
    },

    // 身份证正面
    changeFront (data) {
      this.$nextTick(() => {
        this.changeImage('front', data)
        this.formData.frontUrl = data.url
      })
    },

    // 身份证背面
    changeBack (data) {
      this.$nextTick(() => {
        this.changeImage('back', data)
        this.formData.backUrl = data.url
      })
    },

    clearStatus () {
      this.status = false // 返回最初状态
    },
    drawerClose (isTrue) {
      this.loading = false
      this.$emit('close', isTrue)
      this.$refs['formData'].resetFields()
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
    areaSet (r) {
      for (let index in r) {
        if (r[index].level === 1) {
          this.changeA(r[index].code)
          this.province = r[index].code
        }
      }
      for (let index in r) {
        if (r[index].level === 2) {
          this.changeB(r[index].code)
        }
      }
    }

  }
}
</script>

<style lang="scss" scoped>
 .uploadRow > .sfz {
   float: left;
   width: 350px;
 }
 .uploadRow > .sfz > .el-form-item__content {
   margin-left: 0!important;
 }
 .uploadRow:after {
   content: '';
   display: block;
   clear: both;
 }

</style>
