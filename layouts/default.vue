<template>
  <div id="blog-box">
    <div class="blog-header clear-fix">
      <div class="logo-box float-left">
        <div class="logo">博客</div>
      </div>
      <div class="login-tips-text-box float-right">
        登录 | 注册
      </div>
      <div class="navigation-box float-right">
        <span>首页</span>
        <span>关于</span>
        <span>友链</span>
      </div>
      <div class="user-info-box float-right" style="display: none">
        用户信息
      </div>
    </div>
    <Nuxt/>
    <div class="blog-footer">
      <div class="copy-right-box">
        <p>
          Copyright ©
          <a href="http://localhost:8082/swagger-ui.html" target="_blank">
            zh-spike
          </a>
          本网站由程序猿(媛)用爱驱动
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

<style>
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
