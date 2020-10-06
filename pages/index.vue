<template>
  <div class="index-page-box clear-fix">
    <div class="index-left-part default-boarder-radius float-left">
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
      <div class="left-categories-box default-boarder-radius">
        <div class="category-item" v-for="(item,index) in categories" :key="index">
          <span v-text="item.name"></span>
        </div>
      </div>

      <div class="ad-box">
        123123
      </div>
    </div>

    <div class="index-center-part float-left">
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
      <div class="right-card">
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
      <div class="right-card">
        <div class="card-title">
          直接空着
        </div>
        <div class="card-content">
          <div class="contact">
            <img
              src="https://avatars0.githubusercontent.com/u/42293758?s=400&u=21b672fff6e347172b1df9d7ebf216e9c4c9c9fb&v=4">
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
      isLoading: false,
      keyword: ''
    }
  },
  mounted() {
    // 获取标签
    this.listLabels();
  },
  methods: {
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
    onPageChange(page) {
      this.isLoading = true;
      // 客户端渲染
      // console.log(page);
      // 加载当前页数据
      api.getArticles(page, this.pageNavigation.pageSize).then(result => {
        if (result.code === api.success_code) {
          this.articles = result.data.contents;
        } else {
          this.$message.error(result.message);
        }
        this.isLoading = false;
      })
    },
  },
  async asyncData({params}) {
    let userInfoRes = await api.getAdminInfo();
    let categoriesRes = await api.getCategories();
    let loopRes = await api.getLoop();
    let topArticleRes = await api.getTopArticle();
    // 在服务器渲染
    let articlesRes = await api.getArticles(1, 5);
    let pageNavigation = {
      currentPage: articlesRes.data.currentPage,
      totalCount: articlesRes.data.totalCount,
      pageSize: articlesRes.data.pageSize
    };
    return {
      pageNavigation: pageNavigation,
      userInfo: userInfoRes.data,
      categories: categoriesRes.data,
      loop: loopRes.data,
      topArticle: topArticleRes.data,
      articles: articlesRes.data.contents,
    };
  }
}
</script>

<!--1140px 240px 660px 240px-->
<style>
.ad-box {
  padding-top: 20px;
  width: 210px;
  height: 210px;
  background: #A612FF;
}

.contact img {
  object-fit: cover;
  width: 210px;
  height: 210px;
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
}

.left-categories-box .category-item {
  padding: 10px 5px;
  cursor: pointer;
  color: #666666;
}

.left-categories-box {
  text-align: center;
  padding-top: 20px;
  background: #FFffff;
  margin-bottom: 20px;
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
  width: 210px;
}

.index-right-part {
  width: 230px;
  margin-left: 10px;
}

.index-center-part {
  width: 640px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
