<template>
  <div id="blog-box">
    <el-backtop  :bottom="100">
      <div class="el-icon-arrow-up"
        style="{
        height: 100%;
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }">UP
      </div>
    </el-backtop>
    <div id='blog-header' class="blog-header clear-fix default-border-radius">
      <div class="logo-box float-left">
        <div class="logo">
          <a href="/">
            <h1>博客</h1>
          </a>
        </div>
      </div>
      <div id="login-tips-text-box" style="display: none;" class="login-tips-text-box float-right">
        <span>
          <a :href="'/login'+redirectPath"><i class="sob_blog sobfingermap"> </i>登录</a>
        </span>
        <span>
          <a href="/register"><i class="sob_blog sobmembers-add"></i>注册</a>
        </span>
      </div>
      <div id="user-info-box" style="display: none;" class="user-info-box float-right clear-fix">
        <div class="header-right-box float-right">
          <div class="header-user-info clearfix">
            <div class="header-user-avatar float-left">
              <img v-if="userInfo!=null" style="object-fit: cover"
                   :src="userInfo.avatar">
            </div>
            <div class="header-user-name float-left" v-if="userInfo!=null">
              <el-dropdown @command="handlerCommand">
                        <span class="el-dropdown-link">
                            {{ userInfo.userName }} <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-user" command="userInfo">用户信息</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-s-management" command="adminCenter"
                                    v-if="userInfo.roles==='role_admin'">
                    管理中心
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-orange" command="logout">退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
      <div class="navigation-box float-right ">
        <NuxtLink to="/">
          <span :class="$store.state.currentActivityTab==='index'?'header-title-activity':''">
            <i class="sob_blog sobhome"></i> 首页</span>
        </NuxtLink>
        <NuxtLink to="/about">
          <span :class="$store.state.currentActivityTab==='about'?'header-title-activity':''">
            <i class="sob_blog sobabout_line"></i> 关于</span>
        </NuxtLink>
        <NuxtLink to="/link">
          <span :class="$store.state.currentActivityTab==='link'?'header-title-activity':''">
            <i class="sob_blog soblink">
          </i> 友链</span>
        </NuxtLink>
      </div>
    </div>
    <Nuxt/>
    <div class="blog-footer">
      <div class="copy-right-box">
        <p>
          Copyright ©
          <a href="https://github.com/zh-Spike" target="_blank">
            zh-spike
          </a>
          (2020--?)本网站用❤来发电
        </p>
      </div>
      <div class="bottom-link">
        <span>
          <a href="/about" target="_blank">关于我们</a>
        </span>
        |
        <span>
          <a href="/about#contacts" target="_blank">联系我们</a>
        </span>
        |
        <span><a href="link" target="_blank">友情链接</a>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';

export default {
  methods: {
    handlerCommand(command) {
      if (command === 'logout') {
        api.doLogOut().then(result => {
          if (result.code === api.success_code) {
            // 跳转到登录页面
            location.href = "/login";
          }
        })
      } else if (command === 'adminCenter') {
        location.href = "http://localhost:8080/"
      } else if (command === 'userInfo') {
        location.href = "/userInfo/" + this.userInfo.id;
      }
    },
    checkToken() {
      api.checkToken().then(result => {
        let loginTips = document.getElementById('login-tips-text-box');
        let userInfoBox = document.getElementById('user-info-box');
        if (result.code === api.success_code) {
          // 获取状态
          this.userInfo = result.data;
          // 获取状态后 通过状态树来共享
          this.$store.commit("setCurrentUserId", this.userInfo.id);
          // console.log(this.$store.state.currentUserId);
          if (userInfoBox) {
            userInfoBox.style.display = 'block';
          }
        } else {
          if (loginTips) {
            // 控制顶部display
            loginTips.style.display = 'block';
          }
        }
      })
    },
  },
  mounted() {
    console.log(this.$route.path);
    if (this.redirectPath !== '?redirect=' + location.href &&
      this.$route.path !== '/' &&
      this.$route.path !== '/login' &&
      this.$route.path !== '/forget' &&
      this.$route.path !== '/register') {
      // 排除一些特殊的
      // 首页 login
      this.redirectPath = '?redirect=' + location.href;
    }
    this.checkToken();
  },
  data() {
    return {
      redirectPath: '',
      userInfo: null
    }
  }
}
</script>

<style>
.bottom-link a:hover, .copy-right-box a:hover {
  color: #A612FF;
  cursor: pointer;
}

.copy-right-box a {
  color: #7f828b;
}

.bottom-link a {
  color: #7f828b;
}

.header-title-activity {
  color: #409EFF !important;
}

h1 {
  color: #737F90;
  font-size: 24px;
  font-weight: 600;
}

.el-message {
  min-width: 0 !important;
}

.navigation-box i {
  font-size: 20px;
  font-weight: 600;
}

.default-border-radius {
  border-radius: 4px;
}

.navigation-box span:hover, .login-tips-text-box span:hover {
  color: #A612FF;
}

.navigation-box span {
  margin-right: 40px;
  color: #737F90;
  font-size: 18px;
  cursor: pointer;
}

.navigation-box {
  position: absolute;
  right: 220px;
}

.login-tips-text-box span :hover {
  color: #A612FF;
}

.login-tips-text-box a {
  margin-right: 10px;
  color: #737F90;
}


.login-tips-text-box {
  font-size: 16px;
}

.logo-box {
  margin-left: 10px;
}

.logo-box .logo {
  color: #737F90;
  font-size: 24px;
  font-weight: 600;
}

a {
  text-decoration: none;
}

.copy-right-box {
  margin-bottom: 10px;
}

.blog-footer {
  color: #737F90;
  padding-bottom: 30px;
  text-align: center;
}

* {
  padding: 0;
  margin: 0;
}

#blog-box {
  width: 1140px;
  margin: 0 auto;
}

.blog-header {
  position: relative;
  line-height: 30px;
  margin-top: 20px;
  background: #Fff;
  padding: 10px;
}

body {
  background: #F2F2FA;
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}

.clear-fix {
  overflow: hidden;
  zoom: 1;
}

.header-user-info {
  margin-right: 10px;
}

.header-user-name {
  margin-left: 10px;
}

.header-user-name .el-dropdown-link {
  font-size: 16px;
  color: #737F90;
  cursor: pointer;
  font-weight: 600;
  margin-left: 10px;
}

.header-user-avatar img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  vertical-align: middle;
}

.el-backtop{
  width: 80px;
  height: 80px;
}
</style>
