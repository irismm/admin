<template>
  <div class="home">
    <p v-auth="'AT_SYSTEM'">有AT_SYSTEM权限可以看到此行</p>
    <p v-auth="'AT_USER'">有AT_USER权限可以看到此行</p>
    <p v-role="'admin'">有admin角色可以看到此行</p>
    <p v-role="'MEMBER'">有MEMBER角色可以看到此行</p>
  </div>
</template>

<script>
export default {
  name: 'home',
  created () {
    console.log('Created!')
  }
}
</script>
