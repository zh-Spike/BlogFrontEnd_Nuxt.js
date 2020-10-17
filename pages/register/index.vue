<template>
  <div class="register-box">
    <div class="register-form-container">
      <div class="register-title">
        注册
      </div>
      <div class="form-content">
        <el-form label-width="100px">
          <el-form-item label="验证码" required>
            <el-input v-model="captchaCode" placeholder="请输入右侧验证码"
                      @keyup.enter.native="doLogin"></el-input>
            <img
              :src="captchaPath" @click="updateVerifyCode" class="captcha-code">
          </el-form-item>
          <el-form-item
            required
            label="邮箱地址">
            <el-input placeholder="请输入邮箱地址" v-model="user.email"></el-input>
            <el-button v-if="!isCountDowning" type="primary" @click="getVerifyCode"
                       class="email-get-verify-code-btn">获取验证码
            </el-button>
            <el-button v-else class="get-verify-code-btn" @click="getVerifyCode" disabled type="primary">
              {{ countDownText }}
            </el-button>
          </el-form-item>
          <el-form-item
            required
            label="用户名">
            <el-input @blur="checkUserName" placeholder="请输入唯一用户名" v-model="user.userName"></el-input>
            <span class="el-icon-error" style="color:#F56C6C;" v-if="isUserNameAvailable==='0'"> 该用户名已注册</span>
            <span class="el-icon-success" style="color:#67C23A;"
                  v-if="isUserNameAvailable==='1'"> 您的用户名也太棒了把♪(^∇^*)</span>
          </el-form-item>
          <el-form-item
            required
            label="密 码">
            <el-input v-model="originalPassword" placeholder="请输入暗号" type="password"></el-input>
          </el-form-item>
          <el-form-item
            required
            label="邮箱验证码">
            <el-input v-model="emailCode" placeholder="请输入邮箱验证码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doRegister">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';
import {hex_md5} from "@/utils/md5";

/**
 * 注册相关逻辑:
 * 1 当鼠标离开用户名 需要校验用户名是否已经注册
 * 2 点击获取验证码的 检查格式和邮箱是否已经注册 再获取验证码
 *
 * 输入框:
 * 1 用户名
 * 2 邮箱地址 --> 获取验证码的按钮
 * 3 邮箱验证码
 * 4 密码
 * 5 图灵验证码
 * 6 注册按钮
 *
 * 结果处理:
 * 1 用户名已经注册 toast
 * 2 验证码不正确 toast --> 停止倒计时
 * 3 图灵码不正确 --> 重新加载新的图灵码
 * 4 邮箱格式不正确 toast
 * 5 注册成功结果
 *
 */
export default {
  mounted() {
    this.$store.commit("setCurrentActivityTab", "index");
  },
  data() {
    return {
      isUserNameAvailable: '',
      isCountDowning: false,
      countDownText: '重新发送(60)s',
      captchaPath: '/user/captcha',
      captchaCode: '',
      emailCode: '',
      originalPassword: '',
      user: {
        userName: '',
        password: '',
        email: '',
      }
    }
  },
  methods: {
    checkUserName() {
      if (this.user.userName === '') {
        this.isUserNameAvailable = '';
        return;
      }
      // 查询用户名是否可用
      api.checkUserName(this.user.userName).then(result => {
        if (result.code === api.success_code) {
          // 不可用 已存在
          this.isUserNameAvailable = '0';
        } else {
          // 可用 不存在
          this.isUserNameAvailable = '1';
        }
      })
    },
    updateVerifyCode() {
      this.captchaPath = '/user/captcha' + "?random=" + Date.parse(new Date());
      // console.log(this.captchaPath);
    },
    doRegister() {
      // 检查内容
      if (this.captchaCode === '') {
        this.$message.error("您的图灵验证码还未输入呢");
      }
      if (this.user.email === '') {
        this.$message.error("您的邮箱地址还未输入呢");
      }
      if (this.emailCode === '') {
        this.$message.error("您的邮箱验证码还未输入呢");
      }
      if (this.user.userName === '') {
        this.$message.error("您的大名还未输入呢");
      }
      if (this.originalPassword === '') {
        this.$message.error("您的暗号还未输入呢");
      }
      // 转换密码
      this.user.password = hex_md5(this.originalPassword);
      // 提交数据
      api.registerUser(this.captchaCode, this.emailCode, this.user).then(result => {
        // 处理结果
        if (result.code === api.join_in_success) {
          // 注册成功
          // 给出提示
          this.$message.success(result.message);
          // 直接跳转到的登录页面
          location.href = "/login";
        } else {
          this.$message.error(result.message);
          // 给出提示 更新邮箱验证码
          this.updateVerifyCode();
        }

      })
    },
    getVerifyCode() {
      if (this.captchaCode === '') {
        this.$message.error("请输入图灵验证码");
        return;
      }
      if (this.user.email === '') {
        this.$message.error("请输入邮箱地址");
        return;
      }
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (!reg.test(this.user.email)) {
        this.$message.error("邮箱地址不正确");
        return;
      }
      api.sendEmailCode(this.captchaCode, this.user.email, 'register').then(result => {
        if (result.code === api.success_code) {
          // 如果发送成功，开始倒计时
          this.startCountDown();
          this.$message.success(result.message);
        } else {
          // 否则给出提示
          this.$message.error(result.message);
          this.updateVerifyCode();
        }
      })
    },
    startCountDown() {
      let time = 60;
      this.isCountDowning = true;
      let that = this;
      let interval = setInterval(function () {
        // 执行倒计时内容
        time--;
        if (time <= 0) {
          that.isCountDowning = false;
          clearInterval(interval);
        }
        // console.log('倒计时 == > ' + time)
        that.countDownText = '重新发送(' + time + ')s';
      }, 1000);
    },
  }
}
</script>

<style>
.form-content {
  margin-left: 60px;
}

.register-title {
  color: #999;
  position: absolute;
  font-weight: 600;
  font-size: 20px;
  margin-right: 20px;
}

.register-form-container {
  position: relative;
}

.captcha-code {
  cursor: pointer;
  width: 118px;
  height: 36px;
  padding-left: 10px;
  padding-right: 10px;
  vertical-align: middle;
  margin-left: 10px;
  border: #e6e6e6 solid 1px;
}

.email-get-verify-code-btn {
  margin-left: 10px;
}

.get-verify-code-btn {
  margin-left: 10px;
}

.register-form-container .el-input {
  width: 250px;
}

.register-form-container .el-input__inner {
  width: 250px;
}

.register-box {
  margin-top: 20px;
  padding: 20px;
  margin-bottom: 20px;
  background: #fff;
}
</style>
