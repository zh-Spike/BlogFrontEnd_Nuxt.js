<template>
  <div id="blog-box">
    <div id="blog-header" class="blog-header clear-fix default-border-radius">
      <div class="logo-box float-left">
        <div class="logo">
          <a href="/">
            <h1>博客</h1>
          </a>
        </div>
      </div>
      <div class="login-tips-text-box float-right" v-if="userInfo===null">
        <span>
          <a href="/login"><i class="sob_blog sobfingermap"> </i>登录</a>
        </span>
        <span>
          <a href="/register"><i class="sob_blog sobmembers-add"></i>注册</a>
        </span>
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
        <div class="user-info-box float-right" v-if="userInfo!==null">
          用户信息
        </div>
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
    checkToken() {
      api.checkToken().then(result => {
        if (result.code === api.success_code) {
          this.userInfo = result.data;
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
  margin-right: 50px;
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
</style>
