<template>
  <div class="reservation-box clear-fix">

    <div class="article-loading-part" v-if="isArticleProcessing">
      <div class="content-loading">
        <div class="loading-title clear-fix"></div>
        <div class="loading-content">
          <div class="loading-text animation-delay"></div>
          <div class="loading-text"></div>
        </div>
        <div class="loading-info clear-fix">
          <div class="loading-type"></div>
          <div class="loading-avatar"></div>
          <div class="loading-nickname"></div>
        </div>
      </div>
    </div>
    <div class="reservation-header" v-show="!isArticleProcessing">
      <div class="header-left float-left">
        <div class="right-card">
          <div class="header-card-title">
            当前可用实验室
            <div class="lab-box">
              <el-table
                :data="labs"
                style="width: 100%">
                <el-table-column
                  prop="labName"
                  label="实验室名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="labAvailable"
                  label="可用容量"
                  width="80">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="header-right float-right">
        <div class="right-card">
          <div class="header-card-title">
            时间管理
            <div class="sign-box">
              <el-table
                :data="appointments"
                :row-class-name="tableRowClassName"
                style="width: 100%">
                <el-table-column
                  prop="labName"
                  label="审批实验室"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="appointmentNumber"
                  label="预约人数"
                  width="80">
                </el-table-column>
                <el-table-column
                  label="状态"
                  width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.state === '0'">
                      <el-tag type="danger">拒绝</el-tag>
                    </div>
                    <div v-if="scope.row.state === '1'">
                      <el-tag type="primary">审核中</el-tag>
                    </div>
                    <div v-if="scope.row.state === '2'">
                      <el-tag type="success">通过</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="startTime"
                  label="发起时间"
                  width="200">
                  <template slot-scope="scope">
						<span v-text="formatDate(scope.row.startTime)">
						</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="220">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="doSignIn(scope.row)" v-if="scope.row.isUsed!=='1'">
                      签到
                    </el-button>
                    <el-button disabled type="primary" size="mini" @click="doSignIn(scope.row)" v-if="scope.row.isUsed==='1'">
                      签到
                    </el-button>
                    <el-button type="info" size="mini" @click="edit(scope.row)" v-if="scope.row.state==='1'">
                      修改
                    </el-button>
                    <el-button disabled type="info" size="mini" @click="edit(scope.row)" v-if="scope.row.state!=='1'">
                      修改
                    </el-button>
                    <el-button type="danger"  size="mini"
                               @click="deleteItem(scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="reservation-bottom" v-show="!isArticleProcessing">
      <div class="bottom-header ">
        签到中心
      </div>
      <div class="sign-box">
        <div class="sign-list-box">
          <el-table
            v-loading="loading"
            :data="signs"
            style="width: 100%">
            <el-table-column
              fixed
              prop="appointmentId"
              label="预约ID"
              width="200">
            </el-table-column>
            <el-table-column
              prop="labName"
              label="实验室"
              width="150">
            </el-table-column>
            <el-table-column
              label="用户"
              width="200">
              <template slot-scope="scope">
                <a href="#" class="article-user-avatar clearfix">
                  <el-avatar :src="scope.row.userAvatar"></el-avatar>
                  <span class="article-user-name">{{ scope.row.userName }}</span>
                </a>
              </template>
            </el-table-column>
            <el-table-column
              label="状态">
              <template slot-scope="scope">
                <div v-if="scope.row.state === '0'">
                  <el-tag type="info">未激活</el-tag>
                </div>
                <div v-if="scope.row.state === '1'">
                  <el-tag type="primary">已签到</el-tag>
                </div>
                <div v-if="scope.row.state === '2'">
                  <el-tag type="danger">签退</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="number"
              label="预约人数">
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="更新日期"
              width="200">
              <template slot-scope="scope">
						<span v-text="formatDate(scope.row.createTime)">
						</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="primary" v-if="scope.row.state === '0'" size="medium"
                           @click="doSignIn(scope.row)">
                  签到
                </el-button>
                <el-button type="primary" v-if="scope.row.state !== '0'" size="medium"
                           @click="doSignIn(scope.row)"
                           disabled>签到
                </el-button>
                <el-button type="danger" v-if="scope.row.state === '1'" size="medium"
                           @click="doSignOut(scope.row)">签退
                </el-button>
                <el-button type="danger" v-if="scope.row.state !== '1'" size="medium"
                           @click="doSignOut(scope.row)" disabled>签退
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      title="删除提示"
      :visible.sync="deleteDialogShow"
      width="400px">
      <span>你确定要删除: {{ deleteMessage }} 的审批吗？</span>
      <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="primary" @click="deleteDialogShow= false">取 消</el-button>
					<el-button size="medium" type="danger" @click="doDeleteItem">确 定</el-button>
				</span>
    </el-dialog>
    <div class="reservation-middle-box">
      <div class="category-action-bar margin-bottom-10">
        <el-button type="primary" size="medium" @click="showAddAppointment"
                   v-show="!isArticleProcessing">新建预约
        </el-button>
      </div>
      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :show-close="false"
        :title="editTitle"
        :visible.sync="editorDialogShow"
        width="700px">
        <div class="appointment-editor-box">
          <el-form label-width="100px">
            <el-table
              ref="singleTable"
              :data="labs"
              style="width: 100%;padding-bottom: 20px">
              <el-table-column
                property="labName"
                label="实验室名称"
                width="150">
              </el-table-column>
              <el-table-column
                property="labAvailable"
                label="可用容量"
                width="120">
              </el-table-column>
              <el-table-column
                property="state"
                label="可用性">
                <template slot-scope="scope">
                  <div v-if="scope.row.state === '0'">
                    <el-tag type="danger">不可用</el-tag>
                  </div>
                  <div v-if="scope.row.state === '1'">
                    <el-tag type="success">正 常</el-tag>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-form-item label="选择实验室">
              <el-select v-model="appointment.labId">
                <el-option v-for="item in labs"
                           :key="item.id"
                           :label="item.labName"
                           :disabled="item.state==='0'"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预约人数">
              <el-input v-model="appointment.appointmentNumber"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="appointment.state">
                <el-option label="审批中" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="起始时间">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="appointment.startTime"
                                style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-time-picker placeholder="选择时间" v-model="appointment.startTime"
                                style="width: 100%;"></el-time-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="appointment.endTime"
                                style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-time-picker placeholder="选择时间" v-model="appointment.endTime"
                                style="width: 100%;"></el-time-picker>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="danger" @click="onEditorClose">取 消</el-button>
					<el-button size="medium" type="primary" @click="postAppointment">{{ editorCommitText }}</el-button>
				</span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/api";
import * as dateUtils from "@/utils/date";

export default {
  head() {
    return {
      title: 'zh-spike系统-' + '预约',
      editorCommitText: '添加',
      editorDialogShow: false,
      editTitle: '新增预约',
      appointments: [],
      labs: [],
      deleteDialogShow: false,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'zh-spike系统-预约页面'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: '杭州电子科技大学, HDU, 项目, 实验室, 系统'
        }
      ]
    }
  },
  async asyncData(context) {
    let labRes = await api.getLabList();
    let userId = context.params.id;
    return api.getUserInfo(userId).then(result => {
      // console.log(result.data);
      return {
        userInfo: result.data,
        parUserId: userId,
        labs: labRes.data,
      }
    })
  },
  data() {
    return {
      isArticleProcessing: true,
      target: 'userInfo',
      isLoading: false,
      loading: false,
      editorCommitText: '添加',
      editorDialogShow: false,
      editTitle: '新增预约',
      appointments: [],
      labs: [],
      signs: [],
      deleteMessage: '',
      deleteDialogShow: false,
      user: {
        id: '',
        userName: '',
        sign: ''
      },
      sign: {
        id: '',
        isUsed: '',
        labId: '',
        appointmentId: ''
      },
      lab: {
        id: '',
        labName: '',
        state: '',
        labNumber: ''
      },
      appointment: {
        id: '',
        labId: '',
        appointmentNumber: '',
        state: '1',
        startTime: '',
        endTime: ''
      },
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
    listSigns() {
      this.loading = true;
      api.getSignList().then(result => {
        // console.log(result);
        this.loading = false;
        if (result.code === api.success_code) {
          this.signs = result.data;
        }
      });
    },
    checkLogin() {
      api.checkToken().then(result => {
        // console.log(result);
        if (result.code === api.failed_code) {
          // 跳转到登录页面
          location.href = "/login?redirect=" + location.href;
          this.$message("请您先登录哦 ...");
        }
      });
    },
    showWarning(msg) {
      this.$message({
        message: msg,
        type: 'warning',
        center: true
      })
    },
    postAppointment() {
      // 检查内容
      if (this.appointment.labId === '') {
        this.showWarning('实验室不能为空');
        return;
      }
      if (this.appointment.appointmentNumber === '') {
        this.showWarning('人数不能为空');
        return;
      }
      if (this.appointment.startTime === '') {
        this.showWarning('起始时间不能为空');
        return;
      }
      if (this.appointment.endTime === '') {
        this.showWarning('结束时间不能为空');
        return;
      }
      if (this.appointment.endTime < this.appointment.startTime) {
        this.showWarning('时间不要搞错┗|｀O′|┛ 嗷~~');
        return;
      }
      // console.log(this.appointment.id);
      // console.log(this.appointment);
      if (this.appointment.id === '') {
        // 如果没有ID的就是添加
        api.postAppointment(this.appointment).then(result => {
          this.editorDialogShow = false;
          if (result.code === api.success_code) {
            this.$message({
              message: '添加成功',
              center: true,
              type: 'success'
            });
            // 刷新列表
            this.listAppointments();
            // 重置数据
            this.resetAppointment();
          }
          this.showWarning(result.message);
        });
      } else {
        // console.log(this.appointment);
        api.updateAppointment(this.appointment.id, this.appointment).then(result => {
          if (result.code === api.success_code) {
            this.$message.success(result.message);
            this.editorDialogShow = false;
            this.listAppointments();
            this.resetAppointment();
          } else {
            this.$message.error(result.message);
          }
        })
      }
    },
    resetSign() {
      this.sign = '';
    },
    doSignIn(item) {
      this.sign.appointmentId = item.id;
      this.sign.labId = item.labId;
      api.signIn(this.sign).then(result => {
        if (result.code === api.success_code) {
          this.$message.success(result.message);
          this.listAppointments();
          this.listSigns();
          this.resetSign();
        } else {
          this.$message.error(result.message);
        }
      })
    },
    doSignOut(item) {
      this.sign.id = item.id;
      // console.log(this.sign.id);
      api.signOut(this.sign.id).then(result => {
        if (result.code === api.success_code) {
          this.$message.success(result.message);
          this.listAppointments();
          this.listSigns();
          this.resetSign();
        } else {
          this.$message.error(result.message);
        }
      })
    },
    edit(item) {
      // 赋值 先请求单个数据 再显示 数据回显
      this.appointment.id = item.id;
      // 显示dialog
      // console.log(this.currentRow);
      this.appointment.labId = item.labId;
      this.appointment.appointmentNumber = item.appointmentNumber;
      this.appointment.startTime = item.startTime;
      this.appointment.endTime = item.endTime;
      // console.log(item);
      this.editorDialogShow = true;
      this.editorCommitText = '修改信息';
      this.editTitle = '编辑预约申请';
    },
    deleteItem(item) {
      // 不是马上删除 弹出确认方框
      this.deleteDialogShow = true;
      this.deleteMessage = item.userName;
      this.deleteTargetId = item.id
      // console.log(item);
    },
    onEditorClose() {
      this.editorDialogShow = false;
      this.resetLab();
    },
    resetLab() {
      this.lab.labName = '';
      this.lab.labNumber = '';
      this.lab.state = '1';
    },
    resetAppointment() {
      this.appointment.appointmentNumber = '';
      this.appointment.state = '1';
      this.appointment.startTime = '';
      this.appointment.endTime = '';
    },
    doDeleteItem() {
      api.deleteAppointment(this.deleteTargetId).then(result => {
        console.log(this.deleteTargetId);
        if (result.code === api.success_code) {
          this.$message({
            type: 'success',
            center: true,
            message: result.message
          });
          this.listAppointments();
        }
      });
      this.deleteDialogShow = false;
    },
    showAddAppointment() {
      this.checkLogin();
      this.appointment.id = '';
      this.appointment.labId = '';
      this.appointment.appointmentNumber = '';
      this.appointment.startTime = '';
      this.appointment.endTime = '';
      this.editorDialogShow = true;
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    },
    getUserInfo() {
      api.getUserInfo(this.parUserId).then(result => {
        if (result.code === api.success_code) {
          this.userInfo = result.data;
        }
      });
    },
    tableRowClassName({row}) {
      if (row.state === "0") {
        return 'danger-row';
      } else if (row.state === "2") {
        return 'success-row';
      }
      return '';
    },
    listAppointments() {
      this.loading = true;
      api.getUserAppointmentsList().then(result => {
        this.loading = false;
        // console.log(result);
        if (result.code === api.success_code) {
          this.appointments = result.data;
        }
      });
    },
  },
  mounted() {
    this.$store.commit("setCurrentActivityTab", "reservation");
    this.listAppointments();
    this.listSigns();
    let that = this;
    window.onresize = function () {
      that.onWindowScroll();
    };
    let timer = setInterval(function () {
      that.isArticleProcessing = false;
      clearInterval(timer);
    }, 1000);
  },
}
</script>

<style>
.reservation-header .header-left {
  margin-left: 10px;
  margin-bottom: 10px;
  /*border-right: #999999 solid 1px;*/
  margin-top: 20px;
}

.reservation-header .header-right {
  margin-top: 20px;
}

.article-loading-part {
  margin-top: 20px;
}

.article-loading-part .loading-title {
  width: 200px;
  height: 24px;
  background-color: #eaeaea;
}

.article-loading-part .loading-content {
  margin-left: 10px;
  margin-top: 10px;
  width: 600px;
}

.article-loading-part .content-loading {
  padding: 10px;
  background: #f3f3f3;
  margin-top: 5px;
}

.article-loading-part .loading-text {
  width: 100%;
  height: 16px;
  margin: 0 0 10px;
  background-color: #eaeaea;
  -webkit-animation: loading 1s ease-in-out infinite;
  animation: loading 1s ease-in-out infinite;
}

@keyframes loading {
  0% {
    width: 40%;
  }

  50% {
    width: 100%;
  }
  100% {
    width: 40%;
  }
}

.article-loading-part .animation-delay {
  -webkit-animation: loading 1s ease-in-out -.5s infinite;
  animation: loading 1s ease-in-out -.5s infinite;
}

.article-loading-part .animation-delay-second {
  -webkit-animation: loading 1s ease-in-out -.3s infinite;
  animation: loading 1s ease-in-out -.3s infinite;
}

.article-loading-part .loading-info {
  display: inline-block;
  width: 100%;
  height: 30px;
}

.article-loading-part .loading-nickname {
  width: 100px;
  margin-left: 50px;
  height: 20px;
  background: #eaeaea;
}

.article-loading-part .loading-avatar {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: #eaeaea;
  margin-left: 10px;
  float: left;
}

.category-action-bar {
  margin-top: 20px;
  margin-bottom: 40px;
  text-align: center;
}

.reservation-header {
  width: 1140px;
  background: #fff;
  margin-top: 20px;
  margin-bottom: 20px;
  /*height: 600px;*/
  overflow: auto;
}

.header-card-title {
  font-size: 20px;
  color: #409EFF;
  margin-bottom: 10px;
  font-weight: 600;
}

.article-user-name {
  margin-left: 10px;
  font-weight: 600;
  color: #222222;
}

.article-user-avatar {
  display: block;
}

.article-user-avatar span {
  display: block;
  line-height: 40px;
  float: left;
}

.reservation-bottom {
  width: 1140px;
  background: #fff;
  margin-top: 20px;
  margin-bottom: 20px;
  /*height: 400px;*/
  overflow: auto;
}

.bottom-header {
  font-size: 20px;
  color: #409EFF;
  margin-bottom: 10px;
  font-weight: 600;
  margin-top: 20px;
  margin-left: 20px;
}
.sign-box .el-table{
  font-size: 14px;
}
.user-list-box {
  padding: 20px;
}

.reset-tips-text {
  margin-left: 15px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 20px;
}

.user-list-page-navigation-bar {
  margin-right: 50px;
  float: right;
}
</style>
