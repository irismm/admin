<template>
  <div class="editBody">
    <el-dialog
      title="地区选择"
      :modal-append-to-body='false'
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="close">
      <div>
        <div class="el-area" v-loading="loading">
          <div class="header">
            <span :class="{spanHover: spanHover===0}" @click="changeA(0)">省份</span>
            <span :class="{spanHover: spanHover===1}" @click="changeA(1)">城市</span>
            <span :class="{spanHover: spanHover===2}" @click="changeA(2)">区县</span>
          </div>
          <ul><li v-for="s in site" :key="s.id" @click="changeArea(s.id, s.name)"><span>{{s.name}}</span></li></ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="text">
            {{names}}
        </div>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="Submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'editName',
  props: {
    dialogVisible: { required: true, type: Boolean }
  },
  data () {
    return {
      loading: false,
      show: false,
      isActive: false,
      spanHover: 0,
      area: {
        id: {
          news: []
        },
        name: {
          news: []
        }
      },
      site: [],
      children: {
      }
    }
  },
  computed: {
    names () {
      return this.area.name.news.toString().replace(/,/g, '')
    }
  },
  mounted () {
    this.changeArea(0)
  },
  methods: {
    close () {
      this.$emit('close')
    },
    Submit () {
      this.close()
      let ids = this.area.id.news
      console.log(ids)

      this.$emit('submit', { id: ids[ids.length - 1], name: this.names })
    },
    changeA (id) {
      this.spanHover = id // 改变位置  1 2 3
      let cid = this.area.id.news[id] // 获取新数组的id
      let data = this.children[`Area${cid}`]
      if (data === undefined) {
        this.site = [{ id: 1, name: '没有数据' }]
      } else {
        this.site = data
      }
      this.area.name.news.length = id
      this.area.id.news.length = id + 1
    },
    getArea (id, func) {
      this.loading = true
      this.axios.post(`area/list?id=${id}`).then(res => {
        func(res)
        this.loading = false
      })
    },
    changeArea (id, name) {
      let length = this.area.name.news.length
      if (length < 2) {
        this.getArea(id, res => {
          this.$nextTick(() => {
            this.$set(this.children, `Area${id}`, res)
            this.site = res
            this.area.id.news.push(id)
            if (name !== undefined) {
              this.area.name.news.push(name)
              if (this.area.name.news.length <= 2) {
                this.changeA(this.area.name.news.length)
              }
            }
          })
        })
      } else {
        this.$nextTick(() => {
          if (this.area.id.news.length >= 4) {
            this.area.id.news.splice(3, 1, id)
          } else {
            this.area.id.news.push(id)
          }
          this.area.name.news.splice(2, 1, name)
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .editBody .el-dialog__body {
    padding: unset!important;
  }
</style>
<style lang="scss" scoped>
  .dialog-footer {
    position: relative;
    .text {
      padding: 3px 13px;
      font-weight: bold;
      float: left;
      font-size: 14px;
    }
  }
  .el-area {
    width: 100%;
    background: #fff;
    border-radius: 3px;
    padding: 6px;

    .header {
      padding: 3px;
      margin: 10px 10px 0 10px;
      position: relative;
      & > div {
        position: absolute;
        right: 0;
        top: 0;
      }
      span {
        padding: 5px 20px;
        margin-right: 10px;
        box-sizing: border-box;
        border: 1px solid transparent;
        cursor: pointer;
      }
      .spanHover, span:hover {
        border: 1px solid #dcdfe6;
        border-bottom: 3px solid #fff;
      }
    }
    ul {
      margin: 2px 13px 10px 13px;
      border: 1px solid #dcdfe6;
      list-style: none;
      padding: 10px;

      li {
        display: inline-block;
        width: 100px;
        height: 30px;
        line-height: 30px;
        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
        text-align: center;
        margin: 4px;
        &:hover {
          background: #dcdfe6;
          cursor: pointer;
        }
      }
    }
  }
</style>
