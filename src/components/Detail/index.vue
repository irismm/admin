<template>
  <div class="drawer-background" v-show="detailShowLazy" @click="detailClose">
    <div class="drawer">
      <transition name="translateX"  @after-leave="TransitionLeave">
        <div class="drawer-container" v-show="detailShow" @click.stop>
          <div class="drawer-title">
            <div class="icon" @click="detailClose">
              <slot v-if="icon" name="close"></slot>
              <svg-icon v-else icon-class="close"></svg-icon>
            </div>
            <span>{{titles}}</span><slot name="edit"></slot>
          </div>
          <slot></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'detail',
  props: {
    title: { type: String },
    detailShow: { required: true, type: Boolean } // 显示隐藏
  },
  watch: {
    detailShow (o) {
      if (o) {
        this.detailShowLazy = true
      }
    }
  },

  data () {
    return {
      detailShowLazy: this.detailShow
    }
  },
  computed: {
    titles () {
      if (this.title) {
        return this.title
      }
    },
    icon () {
      return !!this.$slots.icon
    }
  },
  methods: {
    detailClose () {
      this.$emit('close')
    },
    TransitionLeave () {
      this.detailShowLazy = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .drawer-title {
    position: relative;
    margin-top: 10px;
    margin-bottom: 35px;

    span {
      font-size: 20px;
      font-weight: bold;
    }

    .icon {
      position: absolute;
      right: 0;

      &:hover {
        text-shadow: 1px 1px 1px #373d41;
      }
    }
  }

  .translateX-enter-active, .translateX-leave-active {
    transition: transform .5s;
  }
  .translateX-enter,.translateX-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateX(100%);
  }
</style>
