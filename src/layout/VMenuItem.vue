<template>
  <el-submenu v-if="menu.children && menu.children.length" :index="menu.path">
    <template slot="title">
      <svg-icon v-if="menu.meta && menu.meta.icon"
                :icon-class="menu.meta.icon" class-name="menu-svg"></svg-icon>
      <span>{{ menu.meta && menu.meta.title }}</span>
    </template>
    <VMenuItem v-for="m in menu.children" :key="m.name" :menu="m"/>
  </el-submenu>
  <el-menu-item v-else :index="menu.path">
    <svg-icon v-if="menu.meta && menu.meta.icon"
              :icon-class="menu.meta.icon" class-name="menu-svg"></svg-icon>
    <span slot="title">{{ menu.meta && menu.meta.title }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'VMenuItem',
  props: {
    menu: {
      required: true
    }
  }
}
</script>
