<template>
  <div class="header">
    <div class="title">
      <span class="code"><slot></slot> {{titles}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'headerTitle',
  props: {
    title: { type: String }
  },
  computed: {
    titles () {
      return this.title || this.$route.meta.title
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    padding: 10px;
    box-shadow: 1px 1px 12px rgba(153, 153, 153, 0.21);
    margin-bottom: 20px;
    .title {
      span {
        margin-left: 20px;
        font-size: 20px;
        font-weight: bold;
        height: 40px;
        line-height: 40px;
      }
    }
  }
</style>
