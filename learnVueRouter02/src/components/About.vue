<!-- About -->
<template>
  <div class="about">
    我是关于组件
    <!-- to属性里面接收的是纯字符串 -->
    <!-- 如果想动态绑定属性就得使用v-bind或者简写： -->
    <!-- <router-link to="/user/zhangsan" tag="button">用户</router-link> -->
    <!-- <router-link :to="'/user/' + this.id" tag="button">用户</router-link> -->

    <!-- 也可以通过代码的形式跳转路由 -->
    <button @click="userClick()">用户</button>
    <router-view></router-view>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      id: "zhangsan",
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    userClick() {
      console.log(this.$router); // 获取整个路由对象
      console.log(this.$route); // 获取当前路由对象
      // this.$router.push({
      //   path: "/user/" + this.id,
      // });
      this.$router.push({
        path: "/user/" + this.id,
        query: {
          name: "ellie",
          age: 18,
          height: "1.7",
        },
      });
      console.log(this.$route.params.id); // 动态获取params路由参数
      console.log(this.$route.query); // 动态获取query路由参数
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped></style>
