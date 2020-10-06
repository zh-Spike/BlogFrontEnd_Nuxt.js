<template>
  <div class="register-box">
    <div class="login-tip-text">
      登录
    </div>
    <div class=" login-center-box">
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
    let tempKey = Date.parse(new Date());
    return {
      loginInfo: {
        verifyCode: '',
        captcha_key: tempKey,
      },
      captchaPath: 'http://localhost:8082/user/captcha?captcha_key=' + tempKey,
    }
  },
  data() {
    return {
      isCommitting: false,
      originalPassword: '',
      user: {
        userName: '',
        password: ''
      },
    }
  },
  beforeMount() {
    this.updateVerifyCode();
  },
  methods: {
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
      api.doLogin(this.loginInfo.verifyCode, this.loginInfo.captcha_key, this.user).then(result => {
        // 处理登陆结果
        // 判断状态
        if (result.code === api.success_code) {
          this.isCommitting = false;
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
        } else {
          // 其他则给出提示
          // 更新验证码
          this.$message.error(result.message);
          this.updateVerifyCode();
        }
      });
    },
    updateVerifyCode() {
      this.captchaPath = 'http://localhost:8082/user/captcha?captcha_key=' + this.loginInfo.captcha_key + "&random" + Date.parse(new Date());
      // console.log(this.captchaPath);
    },
  }
}
</script>

<style>
.forget-tip-text a:hover {
  color: #A612FF;
}

.forget-tip-text a {
  color: #999999;
}

.login-tip-text {
  display: inline-block;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 20px;
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

.login-center-box .el-input {
  width: 200px;
}

.register-box {
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
