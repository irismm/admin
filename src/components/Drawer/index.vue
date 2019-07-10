<template>
  <div class="drawer-background" v-show="drawerShowLazy" @click="drawerClose">
    <div class="drawer">
      <transition name="translateX"  @after-leave="TransitionLeave">
        <div class="drawer-container" v-show="drawerShow" @click.stop>
          <div class="drawer-title">
            <div class="icon" @click="drawerClose">
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
  name: 'drawer',
  props: {
    id: { required: true },
    title: { type: String },
    drawerShow: { required: true, type: Boolean } // 显示隐藏
  },
  watch: {
    drawerShow (o) {
      if (o) {
        this.drawerShowLazy = true
      }
    }
  },
  created () {
    let route = this.$route
    this.routeTitle = route.meta.title
  },
  data () {
    return {
      drawerShowLazy: this.drawerShow,
      routeTitle: ''
    }
  },
  computed: {
    titles () {
      if (this.title) {
        return this.title
      }
      let suffix = !this.id ? '新增' : '编辑'
      return this.routeTitle + suffix
    },
    icon () {
      return !!this.$slots.icon
    }
  },
  methods: {
    drawerClose () {
      this.$emit('close')
    },
    TransitionLeave () {
      this.drawerShowLazy = false
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
