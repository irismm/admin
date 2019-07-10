<template>
  <div class="file-upload">
    <el-upload v-if="UploadBorder" ref="upload" drag :disabled="disableImgs"
      class="avatar-uploader" :auto-upload="true" :action="uploadUrl" :show-file-list="false"
      :on-progress="progressChange" :http-request="fnUploadRequest" :on-success="handleAvatarSuccess"
      multiple
     >
      <div v-if="!!url" class="avatar avatar-height" :class="{ 'avatar-hover': !disableImgs && !!$slots.default}">
        <div class="avatar-slot" @click.stop="deleteFile" v-show="!disableImgs && !!$slots.default">
          <slot></slot>
        </div>
        <img :src="url">
      </div>
      <div v-else class="avatar-uploader-bg">
        <svg-icon :icon-class="icon" class-name="svg-class"></svg-icon>
        <h3 style="color:#a6a9ad;user-select:none;margin-top:-25px;"> {{title}} </h3>
      </div>
      <div class="progress" v-show="progressShow">
        <div class="bgs">
          <el-progress type="circle" :percentage="percentage"></el-progress>
        </div>
      </div>
    </el-upload>

    <div v-else class="avatar-uploader">
      <div class="el-upload el-upload--text">
        <div class="el-upload-dragger avatar-height">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fileUpload',
  props: {
    data: { type: Object }, // UploadItem
    url: { type: String, default: '' },
    icon: { type: String, default: 'add' },
    title: { type: String, default: '上传文件' },
    disableImg: { type: Boolean }
  },
  computed: {
    /**
     * @return {boolean}
     */
    UploadBorder () {
      if (!this.data) {
        return true
      } else {
        return this.data.border
      }
    },
    disableImgs () {
      if (!this.disableImg) {
        return this.disabled
      } else {
        return true
      }
    }
  },
  data () {
    return {
      progressShow: false, // 进度条显示
      percentage: 0, // 进度条
      uploadUrl: '',
      uploadHeaders: { authorization: '' }, // 上传头部
      disabled: false
    }
  },
  methods: {
    deleteFile () {
      this.$confirm('确定要删除当前图片吗?', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '返回',
        type: 'warning' })
        .then(_ => {
          // todo 删除图片 emit父级的删除方法
          this.$emit('delete', this.data)
        })
        .catch(_ => {})
    },
    fnUploadRequest (option) { // 上传文件验证
      this.disabled = true
      const isLt2M = option.file.size / 1024 / 1024 < 2
      const fileName = option.file.type

      let regex = /(jpg|jpeg|gif|png|bmp)$/
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.disabled = false
      } else {
        if (regex.test(fileName.toLowerCase())) {
          this.UploadFile(option) // 上传逻辑
        } else {
          this.disabled = false
          this.$message.error('请选择图片文件')
        }
      }
    },
    async UploadFile (option) {
      let file = option.file
      this.progressShow = true // 开启进度条
      let param = new FormData() // 创建FormData对象
      param.append('file',file)
      this.axios.post('/common/uploadFile', param).then(res => {
        this.uploadUrl = res.url
        //this.$success('上传成功')
        this.$emit('change',{ name: res.name, url: res.url, size: res.size, md5: res.md5 })
        this.disabled = false
        this.closeDisable()
      })
    },
    handleAvatarSuccess(res, file) {
      this.uploadUrl = URL.createObjectURL(file.raw);
    },
    progressChange (event) {
      this.percentage = event
      if (event === 100) {
        this.closeDisable()
      }
    },
    closeDisable () {
      setTimeout(() => {
        this.progressShow = false
        this.percentage = 0
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>

  .file-upload {
    width: 200px;
    position: relative;
  }

  .progress {
    position: absolute;
    left: 0;
    top: 0;
    background: #999;
    opacity: 0.8;
    width: 100%;
    height: 100%;
    .bgs {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
    }
  }
  .avatar-uploader {
    margin: 10px;
  }
  .avatar-uploader-bg {
    width: 100%;
  }

  .avatar-slot {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #999;
    opacity: 0;
    transition: all .5s;
    z-index: 999;
  }

  .avatar {
    width: 100%;
    display: flex;

    img {
      width: 100%;
      justify-content: center;
      align-items: center;
      display: block;
      vertical-align:middle;
      object-fit: contain;
    }

  }
</style>
