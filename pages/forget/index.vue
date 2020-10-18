<template>
  <div class="forget-box">
    <div class="forget-container">
      <div class="forget-title">
        找回密码
      </div>
      <div class="forget-form-container">
        <div class="verify-code-container" v-if="showType==='verifyCode'">
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
              label="邮箱验证码">
              <el-input v-model="emailCode" placeholder="请输入邮箱验证码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="resetPassword">找回密码</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="forget-reset-password-container" v-if="showType==='resetPassword'">
          <el-form label-width="100px">
            <el-form-item
              required
              label="用户新密码">
              <el-input type="password" v-model="originalPassword" placeholder="请输入用户新密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="setPassword">设置新密码</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/api";
import {hex_md5} from "@/utils/md5";

export default {
  head() {
    return {
      title: 'zh-spike系统-找回密码',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'zh-spike系统-找回密码'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: '杭州电子科技大学, HDU, 项目, 实验室, 系统'
        }
      ]
    }
  },
  mounted() {
    this.$store.commit("setCurrentActivityTab", "index");
  },
  data() {
    return {
      showType: 'verifyCode',
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
    setPassword() {
      if (this.originalPassword === '') {
        this.$message.error('请输入新密码');
        return;
      }
      this.user.password = hex_md5(this.originalPassword);
      // 提交数据
      api.updatePassword(this.emailCode, this.user).then(result => {
        if (result.code === api.success_code) {
          // 成功 提示 并且跳转到登录页面
          this.$message.success(result.message);
          location.href = "/login";
        } else {
          this.$message.error(result.message);
          this.showType = 'verifyCode';
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
      api.sendEmailCode(this.captchaCode, this.user.email, 'forget').then(result => {
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
    resetPassword() {
      if (this.captchaCode === '') {
        this.$message.error('图灵码不可为空');
      }
      if (this.user.email === '') {
        this.$message.error('邮箱地址不可为空');
      }
      if (this.emailCode === '') {
        this.$message.error('邮箱验证码不可为空');
      }
      /*
        判空
        检查当前验证是否正确 若正确则显示修改密码的部分
      */
      api.checkVerifyCode(this.captchaCode, this.user.email, this.emailCode).then(result => {
        if (result.code === api.success_code) {
          // 显示设置密码的UI
          this.showType = 'resetPassword';
        } else {
          // 给出提示 重新加载验证码
          this.$message.error(result.message);
          this.updateVerifyCode();
        }
      });
    },
    updateVerifyCode() {
      this.captchaPath = '/user/captcha' + "?random=" + Date.parse(new Date());
      // console.log(this.captchaPath);
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
  },
}
</script>

<style>
.email-get-verify-code-btn {
  margin-left: 10px;
}

.get-verify-code-btn {
  margin-left: 10px;
}

.forget-title {
  color: #999;
  position: absolute;
  font-weight: 600;
  font-size: 20px;
  margin-right: 20px;
}

.forget-container .el-input {
  width: 250px;
}

.forget-container .el-input__inner {
  width: 250px;
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

.forget-form-container {
  margin-top: 40px;
  margin-left: 60px;
}

.forget-container {
  background: #fff;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 20px;
}
</style>
