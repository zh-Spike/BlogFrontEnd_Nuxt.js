<template>
  <div class="article-box" id="article-box">
    <div class="content-box clear-fix">
      <div class="article-left-part default-board-radius float-left">
        <div class="article-content-box">
          <div class="article-detail-title">
            <h1 v-text="articleRes.title"></h1>
          </div>
          <div class="article-info">
            <img :src="articleRes.user.avatar" size="small">
            <span class="user-name">
          {{ articleRes.user.userName }}
        </span>
            <span class="el-icon-date"> 发布于</span>
            <span>
          {{ articleRes.createTime | formatDate("yyyy-MM-dd hh:mm") }}
        </span>
            <span class="el-icon-view"> {{ articleRes.viewCount }}</span>
          </div>
          <div class="article-labels">
            <el-tag type="info" size="mini" v-for="(item,index) in articleRes.labels" :key="index">
              <a :href="'/search?keyword=' + item" target="_blank">{{ item }}</a>
            </el-tag>
          </div>
          <div class="catalog-box" id="article-content-category-box">

          </div>
          <div id="article-content" class="article-content" v-html="articleRes.content">
          </div>
        </div>
        <div class="article-comment-box">

        </div>
        <div class="article-recommend-box">
          <div class="recommend-header-title">
            相关阅读推荐
          </div>
          <div class="recommend-item" v-for="(item,index) in recommendArticleRes" :key="index">
            <div class="recommend-title">
              <a :href="'/article/' + item.id" target="_blank">
                {{ item.title }}</a>
            </div>
            <div class="recommend-summary">
              {{ item.summary }}
            </div>
            <div class="recommend-info">
              <span class="el-icon-date"> 发布于</span>
              <span>
          {{ item.createTime | formatDate("yyyy-MM-dd hh:mm") }}
        </span>
              <span class="el-icon-view"> {{ item.viewCount }}</span>
              <el-tag type="info" size="mini" v-for="(tag,tagIndex) in item.labels" :key="tagIndex">
                <a :href="'/search?keyword=' + tag" target="_blank">{{ tag }}</a>
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="article-right-part default-board-radius float-left">
        <div class="article-right-card">
          <div id="article-content-search" class="right-card-title">
            内容搜索
          </div>
          <div class="right-card-content">
            <el-input
              size="medium"
              @keyup.enter.native="toSearchPage"
              placeholder="直接进行一个搜索"
              prefix-icon="el-icon-search"
              v-model="keyword">
            </el-input>
          </div>
        </div>
        <div id="article-content-labels" class="article-right-card">
          <div class="right-card-title">
            热门标签
          </div>
          <div class="right-card-content">
            <WordCloud></WordCloud>
          </div>
        </div>
        <div id="article-content-category" class="article-right-card">
          <div class="right-card-title">
            文章目录
          </div>
          <div class="right-card-content" id="article-catalog-container">

          </div>
        </div>
      </div>
    </div>
    <div class="article-detail-part">
      <el-dialog
        :visible.sync="isImageDialogShow">
        <img :src="targetImagePath"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import Catelog from '@/utils/headerLineHandler';

export default {
  data() {
    return {
      isImageDialogShow: false,
      targetImagePath: '',
      keyword: '',
    }
  },
  /*
  加载文章详情 需要传文章ID
   */
  async asyncData({params}) {
    let articleResult = await api.getArticleDetailById(params.id);
    let recommendArticle = await api.getRecommendArticle(articleResult.data.id, 10);
    // console.log(recommendArticle.data);
    // console.log('test....');
    // console.log(params.id);
    return {
      articleRes: articleResult.data,
      recommendArticleRes: recommendArticle.data
    };

  },
  methods: {
    handleContentImages() {
      document.getElementById('article-content');
      // 遍历图片
      let contentBox = document.getElementById('article-content');
      let images = contentBox.querySelectorAll('img');
      images.forEach(item => {
        // console.log(item);
        item.addEventListener('click', this.showImage);
      })
    },
    toSearchPage() {
      // 如果没有输入 则无效
      this.keyword == this.keyword.trim();
      if (this.keyword === '') {
        console.log('内容为空');
        return;
      }
      // 跳转搜索页面
      location.href = '/search?keyword=' + encodeURIComponent(this.keyword);
    },
    showImage(event) {
      // console.log(event.target.src);
      // 显示dialog
      this.isImageDialogShow = true;
      this.targetImagePath = event.target.src;
    },
    onWindowScroll() {
      let scrolledTop = document.documentElement.scrollTop;
      let scrolledLeft = document.documentElement.scrollLeft;
      let labelsBox = document.getElementById('article-content-labels');
      let searchBox = document.getElementById('article-content-search');
      let parentPart = document.getElementById('article-box');
      if (searchBox) {
        let bottomOfSearch = searchBox.offsetTop + searchBox.offsetHeight;
        if (scrolledTop >= bottomOfSearch) {
          // console.log('显示内容');
          labelsBox.style.position = 'fixed';
          labelsBox.style.marginLeft = '20px';
          labelsBox.style.top = '20px';
          labelsBox.style.padding = '10px';
          labelsBox.style.width = '300px';
        } else {
          labelsBox.style.position = '';
          labelsBox.style.marginLeft = '';
          labelsBox.style.top = '';
          labelsBox.style.width = 'auto';
          // console.log('隐藏');
        }
        // 处理左右
        if (scrolledLeft < 0) {
          labelsBox.style.left = parentPart.offsetWidth
            + parentPart.offsetLeft
            + labelsBox.offsetWidth
            + 'px';
        } else {
          labelsBox.style.left = parentPart.offsetWidth
            + parentPart.offsetLeft
            - labelsBox.offsetWidth
            - scrolledLeft
            + 'px';
        }
      }
    }
  },
  mounted() {
    new Catelog({
      contentEl: 'article-content',
      catalogEl: 'article-catalog-container',
      selector: ['h1', 'h2', 'h3'],
    });
    hljs.initHighlighting();
    this.handleContentImages();
    // 添加滚动监听
    window.addEventListener('scroll', this.onWindowScroll);
    let that = this;
    window.onresize = function () {
      that.onWindowScroll();
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  },
};
</script>

<style>
#article-catalog-container ul {
  margin-left: 10px;
  line-height: 30px;
  list-style: none;
}

#article-catalog-container {
  padding: 10px;
}

#article-content-category-box {
  margin-top: 20px;
}

.content-category-title {
  padding: 10px 0;
  font-size: 20px;
  font-weight: 600;
}

#article-content-category-box li:hover, #article-catalog-container li:hover {
  color: #A612FF;
}

#article-content-category-box li, #article-catalog-container li {
  cursor: pointer;
  color: #409EFF;
}

#article-content-category-box ul {
  margin-left: 38px;
  list-style: none;
  line-height: 30px;
}

.recommend-header-title {
  font-size: 20px;
  font-weight: 600;
  color: #409EFF;
}

.recommend-item span {
  margin-right: 10px;
}

.recommend-item {
  border-bottom: #F5F5F5 solid 1px;
  padding-bottom: 20px;
  padding-top: 20px;
}

.recommend-info a:hover, .article-labels a:hover {
  color: #A612FF;
}

.recommend-info a {
  color: #7f828b;
}

.article-labels a {
  color: #7f828b;
}

.recommend-info {
  font-size: 14px;
  color: #7f828b;
}

.recommend-summary {
  font-size: 16px;
  color: #7f828b;
  margin: 10px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.recommend-title a:hover {
  color: #A612FF;
}

.recommend-title a {
  color: #47494e;
}

.recommend-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  font-size: 22px;
  color: #47494e;
  line-height: 30px;
  font-weight: 600;
}

.article-recommend-box {
  background: #fff;
  padding: 20px;
}

.article-right-card {
  border-radius: 4px;
  background: #FFffff;
  padding: 10px;
  margin-bottom: 20px;
}

.article-right-card .card-subtitle {
  font-size: 10px;
  color: #909399;
  margin-bottom: 10px;
  font-weight: 200;
}

.right-card-title {
  font-size: 16px;
  color: #999999;
  border-bottom: #d7d8db solid 1px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 5px 10px 10px 10px;
  margin-bottom: 10px;
  font-weight: 600;
}

.article-detail-part .el-dialog__header {
  padding: 0;
}

.article-detail-part .el-dialog__body {
  padding: 10px;
}

.article-detail-part .el-dialog {
  width: fit-content;
}

.article-content h2 {
  margin-top: 10px;
  margin-bottom: 10px;
}

.article-content pre {
  padding: 10px 0;
}

.article-content img {
  padding: 10px 0;
  cursor: zoom-in;
}

.article-content pre code {
  font-size: 14px;
  padding: 10px;
}

.article-content ul {
  margin-left: 20px;
}

.article-content p, .article-content ul {
  line-height: 24px;
  color: #7f828b;
  font-size: 16px;
  padding: 5px 0;
}

.article-content h1 {
  color: #000;
  line-height: 40px;
}

.article-detail-title h1 {
  color: #000;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.article-content {
  margin-top: 20px;
}

.article-content img {
  max-width: 740px;
}

.article-labels .el-tag {
  margin-right: 10px;
  cursor: pointer;
}

.article-labels {
  margin-left: 34px;
  margin-top: 10px;
}

.article-info .user-name {
  font-weight: 600;
}

.article-info {
  margin-top: 20px;
}

.article-info span {
  line-height: 32px;
  font-size: 16px;
  color: #737F90;
}

.article-info img {
  width: 26px;
  height: 26px;
  margin-right: 5px;
  border-radius: 50%;
  vertical-align: middle;
}

.article-content-box {
  background: #fff;
  margin-bottom: 20px;
  padding: 20px;
}

.article-left-part {
  margin-right: 20px;
  width: 780px;
}

.article-right-part {
  width: 300px;
}

.article-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

</style>
