<template>
  <div class="user-detail-info-box clear-fix">
    <div class="user-info-header-bg">
      <img :src="userInfo.avatar">
    </div>
    <div class="user-info-left-part float-left" id="user-info-left-part">
      <el-tabs tab-position="left" v-model="target">
        <el-tab-pane label="用户信息" name="userInfo"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="user-info-right-part float-left" id="user-info-right-part">
      <div class="avatar-username">
        <img :src="userInfo.avatar">
        <span>{{ userInfo.userName }}</span>
      </div>
      <div class="info-item">
        <span class="info-left">角色:  </span>
        <el-tag size="mini" v-if="userInfo.roles==='role_admin'" type="danger">
          管理员
        </el-tag>
        <el-tag size="mini" v-else>
          注册用户
        </el-tag>
      </div>
      <div class="info-item reg-time">
        <span class="info-left">在线:  </span>
        {{ userInfo.updateTime | formatDate("yyyy-MM-dd hh:ss") }}
      </div>
      <div class="info-item sign" v-if="!isEditorMode">
        <span class="info-left">签名:  </span>
        <span v-text="userInfo.sign===''?'很酷，不说话! ...':userInfo.sign"></span>
      </div>
      <div class="info-item sign-input clear-fix" v-else>
        <div class="info-left float-left">签名:</div>
        <div class="float-left">
          <el-input v-model="user.sign" type="text" placeholder="独一无二的签名! " size="mini"></el-input>
        </div>
      </div>
      <div class="info-item user-name-info clear-fix" v-if="isEditorMode">
        <div class="info-left float-left">昵称:</div>
        <div class="float-left">
          <el-input type="text" v-model="user.userName" placeholder="万中无一的昵称! " size="mini"></el-input>
        </div>
      </div>
      <div class="update-btn" v-if="isEditorMode">
        <el-button size="mini" type="primary" @click="updateUserInfo"> 更新</el-button>
      </div>
      <div class="user-info-editor-btn" v-if="parUserId===currentUserId">
        <el-button size="mini" :type="isEditorMode?'danger':'primary'" @click="switchEditorMode "
                   v-text="!isEditorMode?'编辑':'取消'"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';

export default {
  asyncData(context) {
    let userId = context.params.id;
    return api.getUserInfo(userId).then(result => {
      // console.log(result.data);
      return {
        userInfo: result.data,
        parUserId: userId,
      }
    })
  },
  data() {
    return {
      target: 'userInfo',
      isEditorMode: false,
      user: {
        id: '',
        userName: '',
        sign: ''
      }
    }
  },
  computed: {
    currentUserId() {
      return this.$store.state.currentUserId;
    }
  },
  watch: {
    currentUserId(newValue) {
      console.log('currentUserId ==> ' + newValue);
    }
  },
  methods: {
    getUserInfo() {
      api.getUserInfo(this.parUserId).then(result => {
        if (result.code === api.success_code) {
          this.userInfo = result.data;
        }
      });
    },
    switchEditorMode() {
      this.isEditorMode = !this.isEditorMode;
      this.user.userName = '';
      this.user.sign = '';
    },
    async updateUserInfo() {
      this.user.id = this.parUserId;
      // 检查用户名是否存在
      let checkUserName = await api.checkUserName(this.user.userName);
      if (checkUserName.code === api.success_code) {
        this.$message.error(checkUserName.message);
        return;
      }
      api.updateUserInfo(this.user, this.user.id).then(result => {
        if (result.code === api.success_code) {
          this.isEditorMode = false;
          this.getUserInfo();
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      })
    }
  },
  mounted() {
    this.$store.commit("setCurrentActivityTab", "index");
  },
}
</script>

<style>
.update-btn {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 650px;
}

.user-info-editor-btn {
  position: absolute;
  right: 50px;
  bottom: 30px;
}

.avatar-username img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: middle;
}

.info-item .info-left {
  font-size: 16px;
  font-weight: 600;
  color: #47494e;
  margin-right: 10px;
}

.info-item {
  line-height: 30px;
  padding: 6px;
  color: #7f828b;
}

.user-info-header-bg img {
  width: 100%;
  object-fit: cover;
  filter: blur(4px) contrast(.8);
  height: 200px;
}

.avatar-username .span {
  margin-top: 30px;
}

.avatar-username {
  margin-left: 10px;
  font-size: 20px;
  display: inline-block;
  line-height: 40px;
  font-weight: 600;
  color: #7f828b;
}

.user-info-left-part .el-tabs--left .el-tabs__header.is-left {
  margin-right: 0;
}

.user-info-left-part .el-tabs__item {
  border-right: 1px dashed #e0e0e0;
  height: fit-content;
  color: #666;
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 16px;
  transition: all .3s;
}

.user-info-left-part .el-tabs__nav {
  padding-right: 30px;
}

.user-info-left-part .el-tabs__item.is-active {
  color: #A612FF;
  font-size: 18px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-weight: 600;
  transition: all .3s;
}

.user-info-left-part .el-tabs__item.is-active::after {
  content: " ";
  display: inline-block;
  position: absolute;
  right: -20px;
  width: 27px;
  height: 27px;
  border: 6px solid #A612FF;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  background-color: #fff;
  -webkit-transform: scale(.5);
  -moz-transform: scale(.5);
  -ms-transform: scale(.5);
  transform: scale(.5);
}

.user-info-left-part .el-tabs__nav-wrap::after {
  display: none;
}

.user-info-left-part .el-tabs__active-bar {
  width: 0 !important;
}

.user-info-left-part .el-tabs {
  text-align: right;
}

.user-info-left-part .el-tabs--left .el-tabs__header.is-left {
  float: none;
}

.user-detail-info-box {
  background: #fff;
  margin-top: 20px;
  margin-bottom: 20px;
}

.user-info-left-part {
  /*
  1140-300=840px
  */
  width: 300px;
  padding-top: 20px;
}

.user-info-right-part {
  width: 710px;
  position: relative;
  padding: 35px 110px 20px 20px;
  /*height: 1900px;*/
}

.user-info-item {
  padding-top: 5px;
  padding-bottom: 80px;
  line-height: 30px;
  font-size: 16px;
}

.user-info-right-part .user-info-img {
  margin-bottom: 100px;
}

.user-info-right-part .user-info-img img {
  width: 100%;
}

.websites a {
  padding-right: 10px;
  color: #7f828b;
}

.websites {
  margin-left: 20px;
}

.user-info-item p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

h1 {
  color: #737f90;
  font-size: 24px;
  font-weight: 600;
}

.user-info-right-part h1 {
  margin-bottom: 20px;
}

.user-info-item .contact {
  color: #7f828b;
}

</style>

