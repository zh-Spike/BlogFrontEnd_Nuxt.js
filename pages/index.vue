<template>
  <div id="index-page-box" class="index-page-box clear-fix">
    <div id="index-left-part" class="index-left-part default-boarder-radius float-left">
      <div class="index-left-user-info default-boarder-radius">
        <div class="user-avatar">
          <img :src="userInfo.avatar">
        </div>
        <div class="user-name">
          <span v-text="userInfo.userName"></span>
        </div>
        <div class="user-sign">
          <span v-text="userInfo.sign"></span>
        </div>
      </div>
      <div class="left-user-self-links default-boarder-radius">
        <span class="sob_blog sobwechat"> </span>
        <span class="sob_blog sobbilibili-line"></span>
        <span class="sob_blog sobgithub"> </span>
      </div>
      <div class="left-categories-box ">
        <div class="category-item default-boarder-radius" v-for="(item,index) in categories" :key="index">
          <span v-text="item.name" @click="listArticlesByCategoryId(item)"></span>
        </div>
      </div>
      <div class="right-card">
        <div class="card-title">
          当前可用实验室
          <div class="lab-box">
            <el-table
              :data="labs"
              style="width: 100%">
              <el-table-column
                prop="labName"
                label="实验室名称"
                width="130">
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

    <div id="index-center-part" class="index-center-part float-left">
      <div class="loop-box default-border-radius">
        <el-carousel :interval="4000" arrow="always">
          <el-carousel-item v-for="(item,index) in loop" :key="index">
            <img :src="item.imageUrl" style="object-fit: cover">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="top-article-box">
        <div class="article-item default-border-radius clear-fix" v-for="(item,index) in topArticle" :key="index">
          <div class="article-left float-left">
            <div class="article-title">
              <span class="top-tips">置顶</span>
              <span class="title">{{ item.title }}</span>
            </div>
            <div class="article-summary ">
              <p>
                {{ item.summary }}
                <span>...</span>
                <span class="read-more">读取全文</span>
              </p>
            </div>
            <div class="labels">
              <el-tag
                size="medium"
                v-for="(tag,tagIndex) in item.labels"
                :key="tagIndex">
                {{ tag }}
              </el-tag>
            </div>
          </div>
          <div class="article-right">
            <div class="article-cover float-right">
              <img :src="'http://localhost:8082/portal/image/'+item.cover">
            </div>
          </div>
        </div>
      </div>
      <div class="latest-articles-box"
           v-loading="isLoading">
        <div class="article-item default-border-radius clear-fix" v-for="(item,index) in articles" :key="index">
          <div class="article-left float-left">
            <div class="article-title">
              <span class="title">{{ item.title }}</span>
            </div>
            <div class="article-summary ">
              <p>
                {{ item.summary }}
                <span>...</span>
                <span class="read-more">读取全文</span>
              </p>
            </div>
            <div class="labels">
              <el-tag
                size="medium"
                v-for="(tag,tagIndex) in item.labels"
                :key="tagIndex">
                {{ tag }}
              </el-tag>
            </div>
          </div>
          <div class="article-right">
            <div class="article-cover float-right">
              <img :src="'http://localhost:8082/portal/image/'+item.cover">
            </div>
          </div>
        </div>
      </div>
      <div class="article-page-navigation-bar">
        <el-pagination
          class="article-list-page-navigation-bar"
          background
          @current-change="onPageChange"
          :current-page="pageNavigation.currentPage"
          :page-size="pageNavigation.pageSize"
          layout="prev, pager, next"
          :total="pageNavigation.totalCount">
        </el-pagination>
      </div>
    </div>
    <div class="index-right-part float-left">
      <div class="right-card">
        <div class="card-title">
          内容搜索
        </div>
        <div class="card-content">
          <el-input
            size="medium"
            placeholder="直接进行一个搜索"
            prefix-icon="el-icon-search"
            v-model="keyword">
          </el-input>
        </div>
      </div>
      <div id="hot-label-box" class="right-card">
        <div class="card-title">
          热门标签
        </div>
        <div class="card-content clear-fix">
          <div class="labels-list-box">
            <client-only>
              <wordcloud
                :margin="margin"
                :rotate="rotate"
                :wordPadding="wordPadding"
                :fontSize="fontSize"
                :data="defaultWords"
                nameKey="name"
                valueKey="count"
                :showTooltip="false"
                :wordClick="wordClickHandler">
              </wordcloud>
            </client-only>
          </div>
        </div>
      </div>
      <div id="right-float-box" class="right-card">
        <div class="card-title">
          时间管理
        </div>
        <div class="card-content">
          <div class="sign-box">
            <el-table
              v-loading="loading"
              :data="appointments"
              :row-class-name="tableRowClassName"
              style="width: 100%">
              <el-table-column
                prop="labName"
                label="审批实验室"
                width="130">
              </el-table-column>
              <el-table-column
                prop="appointmentNumber"
                label="预约人数"
                width="80">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';

export default {
  data() {
    return {
      margin: {top: 0, right: 0, bottom: 0, left: 0},
      rotate: {from: -30, to: 30, numOfOrientation: 20},
      fontSize: [30, 50],
      wordPadding: 4,
      defaultWords: [],
      appointments: [],
      currentCategoryId: '',
      loading: false,
      user: {
        id: ''
      },
      isLoading: false,
      keyword: ''
    }
  },
  beforeMount() {
    this.checkToken();
  },
  mounted() {
    this.listLabels();
    this.listAppointments();
    window.addEventListener('scroll', this.onWindowScroll);
    let that = this;
    window.onresize = function () {
      that.onWindowScroll();
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  },
  methods: {
    listArticlesByCategoryId(item) {
      this.loading = true;
      // console.log(item);
      // 重置页码
      this.pageNavigation.currentPage = 1;
      this.currentCategoryId = item.id;
      // 请求结果
      api.getArticles(this.currentCategoryId,
        this.pageNavigation.currentPage,
        this.pageNavigation.pageSize).then(result => {
        // 处理结果
        this.handleArticleResult(result);
      });
    },
    onWindowScroll: function () {
      let scrolledTop = document.documentElement.scrollTop;
      let scrolledLeft = document.documentElement.scrollLeft;
      let centerPart = document.getElementById('index-center-part');
      let parentPart = document.getElementById('index-page-box');
      // 计算leftPart顶部
      let leftPart = document.getElementById('index-left-part');
      // 左侧悬浮控制
      if (centerPart && leftPart && parentPart) {
        let baseTop = centerPart.offsetTop;
        if (scrolledTop <= baseTop) {
          leftPart.style.top = (baseTop - scrolledTop) + 'px';
        } else {
          leftPart.style.top = '20px';
        }
        // 处理左右
        if (scrolledLeft > 0) {
          leftPart.style.left = -scrolledLeft + 'px';
        } else {
          // 正常状态 放到上级div的左边
          leftPart.style.left = parentPart.offsetLeft + 'px';
        }
      }
      // 右侧悬浮控制
      let rightFloatBox = document.getElementById('right-float-box')
      let hotLabelBox = document.getElementById('hot-label-box')
      if (rightFloatBox && hotLabelBox) {
        let bottomOfRightFloatBox = rightFloatBox.offsetTop + rightFloatBox.offsetHeight;
        // console.log('rightFloatBox ==>' + rightFloatBox);
        if (scrolledTop >= bottomOfRightFloatBox) {
          // console.log('显示内容');
          hotLabelBox.style.position = 'fixed';
          hotLabelBox.style.top = '20px';
          hotLabelBox.style.width = '210px';
        } else {
          hotLabelBox.style.position = '';
          hotLabelBox.style.top = '';
          // console.log('隐藏');
        }
        // 处理左右
        if (scrolledLeft < 0) {
          hotLabelBox.style.left = parentPart.offsetWidth
            + parentPart.offsetLeft
            + hotLabelBox.offsetWidth
            + 'px';
        } else {
          hotLabelBox.style.left = parentPart.offsetWidth
            + parentPart.offsetLeft
            - hotLabelBox.offsetWidth
            - scrolledLeft
            + 'px';
        }
        // console.log('onScroll...'+ scrollTop);
      }
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
    checkToken() {
      api.checkToken().then(result => {
        if (result.code === api.success_code) {
          this.user = result.data;
          // console.log(this.user);
        }
      })
    },
    listLabels() {
      api.getLabels(20).then(result => {
        if (result.code == api.success_code) {
          this.defaultWords = result.data.content;
        }
      });
    },
    wordClickHandler(name, value, vm) {
      console.log(value);
    },
    handleArticleResult(result) {
      if (result.code === api.success_code) {
        this.articles = result.data.contents;
        // 回到顶部
        let topHeader = document.getElementById('blog-header');
        if (topHeader) {
          topHeader.scrollIntoView({
            block: 'start',
            behavior: 'smooth'
          })
        }
        // 处理页码
        this.pageNavigation.currentPage = result.data.currentPage;
        this.pageNavigation.totalCount = result.data.totalCount;
        this.pageNavigation.pageSize = result.data.pageSize;
      } else {
        this.$message.error(result.message);
      }
      this.isLoading = false;
    },
    onPageChange(page) {
      this.isLoading = true;
      // 客户端渲染
      // console.log(page);
      // 加载当前页数据
      api.getArticles(this.currentCategoryId, page, this.pageNavigation.pageSize).then(result => {
        this.handleArticleResult(result);
      })
    },
  }
  ,
  async asyncData({params}) {
    let labRes = await api.getLabList();
    let userInfoRes = await api.getAdminInfo();
    let categoriesRes = await api.getCategories();
    let loopRes = await api.getLoop();
    let topArticleRes = await api.getTopArticle();
    // 在服务器渲染
    let articlesRes = await api.getArticles('', 1, 10);
    let pageNavigation = {
      currentPage: articlesRes.data.currentPage,
      totalCount: articlesRes.data.totalCount,
      pageSize: articlesRes.data.pageSize
    };
    let tempCategories = [];
    tempCategories.push({
      name: '全部分类',
      id: ''
    });
    tempCategories = tempCategories.concat(categoriesRes.data);
    return {
      labs: labRes.data,
      pageNavigation: pageNavigation,
      userInfo: userInfoRes.data,
      categories: tempCategories,
      loop: loopRes.data,
      topArticle: topArticleRes.data,
      articles: articlesRes.data.contents,
    };
  }
}
</script>

<!--1140px 240px 660px 240px-->
<style>
#index-left-part {
  position: fixed;
  top: 91px
}

.lab-box {
  margin-top: 10px;
  border-radius: 4px;
}

.el-table .danger-row {
  background: oldlace;
  border-radius: 4px;
}

.el-table .success-row {
  border-radius: 4px;
  background: #f0f9eb;
}

.sign-box {
  border-radius: 4px;
}

.wordCloud .text {
  cursor: pointer;
}

.labels-list-box {
  height: 400px;
}

.right-card {
  border-radius: 4px;
  background: #FFffff;
  padding: 10px;
  margin-bottom: 20px;
}

.right-card .card-title {
  font-size: 14px;
  color: #999999;
  margin-bottom: 10px;
  font-weight: 600;
}

.article-page-navigation-bar {
  text-align: center;
}

.article-page-navigation-bar .el-pagination.is-background .el-pager li {
  background-color: #fff;
}

.read-more:hover {
  color: #444444;
}

.labels .el-tag--medium {
  height: 22px;
  line-height: 22px;
}

.labels .el-tag {
  margin-right: 10px;
  cursor: pointer;
}

.labels {
  margin-top: 20px;
}

.read-more {
  color: #999999;
  border-radius: 4px;
  cursor: pointer;
  padding: 3px 10px;
  font-size: 12px;
}

.article-summary {
  max-width: 500px;
  margin-top: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: #909399;
}

.article-title {
  margin-top: 10px;
  max-width: 500px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.article-title .top-tips {
  background: #ff4500;
  color: #FFffff;
  font-size: 12px;
  padding: 3px 10px;
  vertical-align: middle;
  border-radius: 4px;
}

.article-item {
  background: #FFffff;
  margin-bottom: 20px;
  padding: 10px;
}

.article-title .title {
  font-size: 20px;
  vertical-align: middle;
  color: #606266;
}

.top-article-box {
  margin-top: 20px;
}

.article-cover img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.loop-box .el-carousel__button {
  height: 10px;
  width: 10px;
  border-radius: 50%;
}

.loop-box {
  background: #FFffff;
  padding: 10px;
}

.loop-box img {
  width: 100%;
  height: 300px;
  border-radius: 4px;
}

.left-categories-box .category-item:hover {
  background: #F5F5F5;
  color: #409EFF;
}

.left-categories-box .category-item {
  padding: 10px 5px;
  cursor: pointer;
  margin-left: 15px;
  margin-right: 15px;
  color: #666666;
}

.left-categories-box {
  text-align: center;
  padding-top: 20px;
  background: #FFffff;
  margin-bottom: 20px;
  padding-bottom: 10px;
}

.left-user-self-links span:hover {
  color: #909090;
}

.left-user-self-links {
  text-align: center;
  padding-top: 20px;
  background: #FFffff;
}

.left-user-self-links span {
  font-weight: 600;
  font-size: 30px;
  cursor: pointer;
  color: #CACACA;
  margin-right: 15px;
  margin-left: 15px;
}

.index-left-user-info {
  text-align: center;
  background: #FFffff;
  padding-top: 10px;
}

.index-left-user-info .user-sign {
  margin-top: 14px;
  color: #CACACA;
}

.index-left-user-info .user-name {
  margin-top: 14px;
  color: #606060;
  font-size: 18px;
  font-weight: 600;
}

.index-left-user-info .user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.index-page-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.index-left-part {
  margin-right: 10px;
  /*background: #FFffff;*/
  width: 230px;
}

.index-right-part {
  width: 230px;
  margin-left: 10px;
}

.index-center-part {
  width: 640px;
  margin-left: 250px;
  margin-right: 10px;
}
</style>
