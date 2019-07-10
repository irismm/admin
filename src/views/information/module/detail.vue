<template>
  <Detail title="题目详细" :detail-show="detailShow" @close="detailClose" :id="id">
    <el-form v-loading="loading" :inline="true" class="form" ref="detailData" :model="detailData" label-position="top" label-width="120px">
      <div>
        <el-form-item prop="topicType">
          <span v-for="item in typeOptions" v-if="detailData.topicType === item.type">[{{item.bankTopicType}}]</span>
        </el-form-item>
        <el-form-item prop="title">
          {{detailData.title}}
        </el-form-item>
        <el-form-item prop="label">
          <el-tag :key="tag" v-for="tag in dynamicTags">{{tag}}</el-tag>
          <el-tag>{{detailData.label}}</el-tag>
        </el-form-item>
      </div>
      <div>
        <el-form-item prop="enterpriseName">
          <span>来自于：</span>
          <el-tag type="warning">{{detailData.enterpriseName}}</el-tag>
        </el-form-item>
      </div>
      <div>
        <el-form-item prop="importanceDegree">
          <el-rate v-model="detailData.importanceDegree" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="问题内容:" prop="topicDetails">
          <span>{{detailData.topicDetails}}</span>
        </el-form-item>
      </div>
      <div v-show="detailData.topicType === 2 || detailData.topicType === 3">
        <el-form-item label="问题选项:" prop="optionCodesBeans">
          <div v-for="item in detailData.optionCodesBeans">
            <span>{{item.bankOptionCodes}}</span>
            <span>、</span>
            <span>{{item.content}}</span>
          </div>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="问题解答:" prop="answer">
          <span>{{detailData.answer}}</span>
        </el-form-item>
      </div>
    </el-form>
    <div class="bottom">
      <el-button class="bt" @click="detailClose">关闭</el-button>
    </div>
  </Detail>
</template>

<script>
import Detail from '@/components/Detail'
export default {
  name: "detail",
  props: {
    detailShow: { required: true, type: Boolean } // 显示隐藏
  },
  components: {
    Detail
  },
  data(){
    return{
      id: null,
      loading: false, // 加载数据
      typeOptions:[], // 题目类型集合
      detailData:{
        importanceDegree: 3.7
      },
      dynamicTags: []
    }
  },
  mounted () {
    // 题目类型
    this.axios.post('/question/selectTopic').then(res => {
      this.typeOptions = res
    })
    this.reload()
  },
  methods: {
    reload (id) {
      if (id) {
        this.loading = true
        this.axios.post(`/question/details?getId=${id}`).then(res => {
          this.detailData = res
        }).finally(() => {
          this.loading = false
        })
      }
    },
    detailClose () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
