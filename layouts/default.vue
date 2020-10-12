<template>
  <div id="blog-box">
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
          <a href="/login"><i class="sob_blog sobfingermap"> </i>登录</a>
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
          <span><i class="sob_blog sobhome"></i> 首页</span>
        </NuxtLink>
        <NuxtLink to="/about">
          <span><i class="sob_blog sobabout_line"></i> 关于</span>
        </NuxtLink>
        <NuxtLink to="/link">
          <span><i class="sob_blog soblink"></i> 友链</span>
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
      <div>
        <span>关于我们</span>
        |
        <span>联系我们</span>
        |
        <span>友情链接</span>
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
        location.href = "/userInfo"
      }
    },
    checkToken() {
      api.checkToken().then(result => {
        let loginTips = document.getElementById('login-tips-text-box');
        let userInfoBox = document.getElementById('user-info-box');
        if (result.code === api.success_code) {
          this.userInfo = result.data;
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
    this.checkToken();
  },
  data() {
    return {
      userInfo: null
    }
  }
}
</script>
<style>
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
  margin-right: 40px;
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
</style>
