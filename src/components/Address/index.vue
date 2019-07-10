<template>
  <div class="el-select es-select">
    <div class="el-input el-input--suffix el-input--small">
      <input type="text" @click="dialogOpen" v-model="data" readonly="readonly" autocomplete="off" placeholder="请选择" class="el-input__inner">
    </div>
    <Site :dialogVisible="dialogVisible" @submit="Submit" @close="dialogClose"></Site>
  </div>
</template>

<style lang="scss" scoped>
  .es-select {
  }
  .el-area {
    width: 460px;
    background: #fff;
    border-radius: 3px;
    margin-top: 10px;
    box-shadow: 1px 1px 7px 0 rgba(34, 34, 34, 0.23137254901960785);
    padding: 6px;

    .text {
      padding: 3px 13px;
      font-weight: bold;
    }
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
        border-bottom: 1px solid #fff;
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
        &:hover {
          background: #dcdfe6;
          cursor: pointer;
        }
      }
    }
  }
</style>

<script>
import Site from './module/edit'
export default {
  name: 'SiteAddress',
  props: {
    data: { type: String }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  components: {
    Site
  },
  methods: {
    Submit (data) {
      this.$emit('submit', data)
    },
    dialogClose () {
      this.dialogVisible = false
    },
    dialogOpen () {
      this.dialogVisible = true
    }
  }

}
</script>
