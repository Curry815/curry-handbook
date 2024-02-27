<template>
  <div id="app">
    <!-- tag属性：可以渲染成什么属性的元素 -->
    <!-- replace属性 -->
    <!-- active-class属性：active指定选中状态的类名 -->
    <!-- <router-link to="/home" tag="button" replace active-class="active"
      >首页</router-link
    >
    <router-link to="/about" tag="button" replace active-class="active"
      >关于</router-link
    > -->

    <router-link to="/home" tag="button" replace>首页</router-link>
    <router-link to="/about" tag="button" replace>关于</router-link>

    <!-- <button @click="homeClick">首页</button>
    <button @click="aboutClick">关于</button> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    // homeClick() {
    //   this.$router.push("/home");
    //   console.log("homeClick");
    // },
    // aboutClick() {
    //   this.$router.push("/about");
    //   console.log("aboutClick");
    // },
  },
};
</script>

<style>
.active {
  color: red;
}
</style>
