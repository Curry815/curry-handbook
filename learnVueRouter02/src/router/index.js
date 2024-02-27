import Vue from "vue";
import Router from "vue-router";
// import Home from "../components/Home";
// import About from "../components/About";

// 或者懒加载的方式
const Home = () => import("../components/Home");
const About = () => import("../components/About");
const HomeMessage = () => import("../components/HomeMesage");
const User = () => import("../components/User");

Vue.use(Router);

const routes = [
  {
    path: "",
    redirect: "/home", //redirect 重定向
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      // 这个是document对象的meta属性，一般用来定义窗口的标签名称的，就可以用meta去定义
      title: "首页",
    },
    children: [
      {
        path: "", //默认展示首页的message组件
        redirect: "message",
      },
      {
        path: "message",
        component: HomeMessage,
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    meta: {
      title: "关于",
    },
    component: About,
  },
  {
    path: "/user/:id",
    name: "User",
    meta: {
      title: "档案",
    },
    component: User,
  },
];

const router = new Router({
  routes,
  mode: "history",
  linkActiveClass: "active", // 统一改成active选中状态的类名
});

// 前置钩子：即路由跳转之前
// 例如我想要根据不同的组件，窗口的标题相应也进行更换
router.beforeEach((to, from, next) => {
  // 从from跳转到to
  document.title = to.meta.title;
  // console.log(to);
  console.log("+++++");
  document.title = to.matched[0].meta.title; // 为了解决有些路由嵌套导致出现undefined的情况，所以用matched的第1条数据去找meta的title值
  next(); // 必须执行这个函数
});

// beforeEach函数常用于进行导航的权限控制、路由跳转前的操作等。它的使用场景有如下：
// 1.导航权限控制
// 决定用户是否有权限访问某个路由
router.beforeEach((to, from, next) => {
  // 检查用户是否已经登陆
  if (!isLoginIn && to.path !== "/login") {
    next("/login"); // 重定向到登录页
  } else {
    next(); // 继续路由导航
  }
});

// 2.路由跳转前的操作
// 例如在路由跳转之前，加载数据、验证表单等
router.beforeEach((to, from, next) => {
  // 加载数据
  fetchData(to.params.id)
    .then(() => {
      next(); // 数据加载完成后继续路由导航
    })
    .catch((error) => {
      console.log("加载数据失败", error);
      next(false); // 中断路由导航
    });
});

// 3.路由日志记录
// 可以在beforeEach中记录路由的访问情况，用于统计和调试
router.beforeEach((to, from, next) => {
  console.log("Nagigation from ${from.path} to ${to.path}");
  next(); //继续路由导航
});

// 4.全局路由加载动画
// 在路由跳转之前显示加载动画，路由跳转完成后隐藏加载动画

// 后置钩子：即路由跳转之后
// 注意：这个函数没有next()函数，因为是路由跳转之后的事情了，所以就不必用next()函数去执行了
router.afterEach((to, from) => {
  console.log("------");
});

// afterEach()函数是全局后置钩子函数，它用于在每次路由跳转之后执行一些逻辑，主要用途：
// 1.页面访问统计：记录用户访问页面的行为。例如发送页面访问统计数据到服务器或第三方分析工具。
// 2.页面跳转后的数据处理：例如清楚页面数据、滚动到顶部等。
// 1.1 清除页面数据：
router.afterEach((to, from) => {
  // 清除页面数据
  clearPageData(); // 在这个函数中可以实现清除页面数据的逻辑，例如重置表单(reset方法)、清空缓存(将表单数据对象中的属性设置为空字符串或者null，以达到清空表单数据的效果)等
});
// 1.2 滚动到顶部：
router.afterEach((to, from) => {
  // 滚动到顶部
  window.scrollTo(0, 0); // 水平参数，垂直参数
});
// 1.3 其他数据处理操作：
// 例如发送统计数据、更新页面状态等
router.afterEach((to, from) => {
  // 发送页面访问统计数据
  sendPageView;
});

// 3.全局路由跳转日志记录，用于调试或监控
// 4.页面访问权限控制：根据用户的访问路径判断是否需要对用户进行额外的身份验证或授权。

export default router;
