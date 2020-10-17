<template>
  <div class="login-box">
    <div class="login-tip-text">
      <span class="login-tip">
      登录
      </span>
      <span class="login-type" @click="toAccountLogin">
      账号登陆
      </span>
      ·
      <span class="login-type" @click="toScanLogin">
      扫码登录
      </span>
    </div>
    <div class="login-center-qrCode-box" v-if="loginType==='1'">
      <div id="login-qr-code" class="login-qr-code">
        <el-image
          ref="loginQrCode"
          style="width: 160px; height: 160px; "
          :src="qrCodeLoginImagePath"
          @error="onQrCodeLoadError">
        </el-image>
      </div>
      <div id="login-qr-code-refresh" style="display: none;" @click="refreshQrCode">
        <span>
          <i class="el-icon-refresh"></i> 点击刷新二维码
        </span>
      </div>
      <div class="login-scan-tips">
        请打开客户端App进行扫码登录
      </div>
    </div>
    <div class=" login-center-box" v-if="loginType==='0'">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="账号" required>
              <el-input v-model="user.userName" placeholder="用户名/邮箱"></el-input>
            </el-form-item>
            <el-form-item label="密码" required>
              <el-input type="password" v-model="originalPassword" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item label="验证码" required>
              <el-input v-model="loginInfo.verifyCode" placeholder="请输入右侧验证码"
                        @keyup.enter.native="doLogin"></el-input>
              <img
                :src="captchaPath" @click="updateVerifyCode" class="captcha-code">
            </el-form-item>
            <el-form-item class="login-button">
              <el-button type="primary" @click="doLogin" size="medium">登 录
              </el-button>
              <span class="forget-tip-text">
                  <a href="/forget">忘记密码</a>
              </span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import {hex_md5} from "@/utils/md5";
import * as api from '@/api/api';

export default {
  asyncData() {
    return {
      loginInfo: {
        verifyCode: '',
      },
      captchaPath: '/user/captcha',
    }
  },
  data() {
    return {
      isScanStateChecking: false,
      qrCodeLoginKey: '',
      qrCodeLoginImagePath: '',
      loginType: '0',
      isCommitting: false,
      originalPassword: '',
      user: {
        userName: '',
        password: ''
      },
    }
  },
  mounted() {
    this.$store.commit("setCurrentActivityTab", "index");
  },
  methods: {
    checkLoginState() {
      if (this.isScanStateChecking || this.loginType !== '1' || this.qrCodeLoginKey === '') {
        return;
      }
      // 什么时机去查询
      this.isScanStateChecking = true;
      console.log('查询登陆状态...' + this.qrCodeLoginKey);
      // 图片返回就查询
      // 如果正查询就不需要查询
      api.checkScanLoginState(this.qrCodeLoginKey).then(result => {
        // 查询登录状态
        console.log(result);
        // 处理结果 3种
        let code = result.code;
        console.log(code);
        this.isScanStateChecking = false;
        if (code === api.scan_code) {
          // 登陆成功
          this.handleLoginSuccess(result);
        } else if (code === api.qr_code_deprecate) {
          // 扫码超时
          this.onQrCodeLoadError();
        } else if (code === api.waiting_for_scan) {
          // 等待扫描
          this.checkLoginState();
        }
      });
    },
    refreshQrCode() {
      this.getLoginQrcode();
    },
    onQrCodeLoadError() {
      this.qrCodeLoginKey = '';
      this.qrCodeLoginImagePath = '';
      // 二维码加载失败
      // 显示刷新
      let qrCodeBox = document.getElementById('login-qr-code');
      if (qrCodeBox) {
        qrCodeBox.style.display = 'none';
      }
      let refreshBox = document.getElementById('login-qr-code-refresh');
      if (refreshBox) {
        refreshBox.style.display = 'block';
      }
    },
    toScanLogin() {
      if (this.qrCodeLoginKey === '') {
        this.getLoginQrcode();
      }
      this.loginType = '1';
    },
    toAccountLogin() {
      // 清空图片和key 下次在切换的时候 重新拉取新的二维码
      this.qrCodeLoginKey = '';
      this.qrCodeLoginImagePath = '';
      this.loginType = '0';
    },
    getLoginQrcode() {
      api.getLoginQrCode().then(result => {
        console.log(result);
        let qrCodeBox = document.getElementById('login-qr-code');
        let refreshBox = document.getElementById('login-qr-code-refresh');
        if (result.code === api.success_code) {
          this.qrCodeLoginImagePath = result.data.url;
          this.qrCodeLoginKey = result.data.code;
          // 控制refresh和原本的显示和隐藏
          if (qrCodeBox) {
            // 让控件重新加载图片
            this.$refs.loginQrCode.error = false;
            qrCodeBox.style.display = 'block';
            this.checkLoginState();
          }
          if (refreshBox) {
            refreshBox.style.display = 'none';
          }
        }
      }).catch(error => {
          console.log(error);
        }
      );
    },
    handleLoginSuccess(result) {
      this.$message({
        message: result.message,
        center: true,
        type: 'success'
      })
      // this.$router.push({path: '/index'});
      // 从地址中获得redirect
      let redirect = this.$route.query.redirect;
      if (redirect) {
        location.href = redirect;
      } else {
        // 如果没有就跳转到首页
        location.href = "/";
      }
    },
    doLogin() {
      // 发起登录
      // 检查数据
      if (this.user.userName === '') {
        this.$message.warning('账号不能为空');
        return;
      }
      if (this.originalPassword === '') {
        this.$message.warning('密码不能为空');
        return
      }
      if (this.loginInfo.verifyCode === '') {
        this.$message.warning('验证码不能为空');
        return;
      }
      if (this.isCommitting) {
        return;
      }
      this.isCommitting = true;
      this.user.password = hex_md5(this.originalPassword);
      // 向服务器提交数据
      api.doLogin(this.loginInfo.verifyCode, this.user).then(result => {
        // 处理登陆结果
        // 判断状态
        // console.log(result);
        this.isCommitting = false;
        if (result.code === api.success_code) {
          this.handleLoginSuccess(result);
        } else {
          // 其他则给出提示
          // 更新验证码
          this.$message.error(result.message);
          this.updateVerifyCode();
        }
      });
    },
    updateVerifyCode() {
      this.captchaPath = '/user/captcha' + "?random=" + Date.parse(new Date());
      // console.log(this.captchaPath);
    },
  }
}
</script>

<style>
#login-qr-code-refresh span {
  line-height: 164px;
  width: 160px;
  display: inline-block;
  background: #F7F7F7;
  height: 160px;
  cursor: pointer;
}

#login-qr-code-refresh {
  width: 250px;
  height: 164px;
  text-align: center;
}

.login-center-qrCode-box {
  width: 250px;
  height: 194px;
  margin-left: 50px;
  text-align: center;
}

.login-scan-tips {
  margin-top: 10px;
  color: #999999;
}

.login-tip {
  font-weight: 600;
  font-size: 20px;
  margin-right: 20px;
}

.login-type {
  cursor: pointer;
  font-size: 14px;
}

.login-type:hover {
  color: #A612FF;
}

.forget-tip-text a:hover {
  color: #A612FF;
}

.forget-tip-text a {
  color: #999999;
}

.forget-tip-text {
  margin-left: 10px;
}

.login-tip-text {
  display: inline-block;
  margin-bottom: 20px;
  color: #999999;
}

.captcha-code {
  cursor: pointer;
  width: 120px;
  height: 42px;
  padding-left: 10px;
  padding-right: 10px;
  vertical-align: middle;
  margin-left: 10px;
  border: #e6e6e6 solid 1px;
}

.login-button {
  margin-bottom: 0;
}

.login-center-box {
  margin-left: 65px;
}

.login-center-box .el-input {
  width: 200px;
}

.login-box {
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 20px;
  background: #ffffff;
  margin-top: 20px;
}

.login-center-box .el-input__inner {
  border-radius: 0;
  border-bottom: #e6e6e6 solid 1px;
  height: 42px;
}

.login-center-box .el-form-item__label {
  background: #FBFBFB;
  border-left: #e6e6e6 solid 1px;
  border-top: #e6e6e6 solid 1px;
  border-bottom: #e6e6e6 solid 1px;
  text-align: center;
}
</style>
