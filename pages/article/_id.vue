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
          <div class="article-comment-input">
            <div class="comment-input-header">
              评论输入
            </div>
            <el-input
              @focus="checkLogin"
              rows="4"
              type="textarea"
              placeholder="请文明评论"
              v-model="comment.content"
              maxlength="256"
              show-word-limit>
            </el-input>
            <div class="comment-submit-btn">
              <el-button type="primary" size="medium" @click="doComment">评论</el-button>
            </div>
          </div>
          <div class="article-comment-list" id="article-comment-list">
            <div class="comment-list-header">
              文章评论
            </div>
            <div class="comment-item-list">
              <div class="article-comment-item" v-for="(item,index) in commentList" :key="index">
                <div class="article-comment-user-info">
                  <a :href="'/user/'+item.userId">
                    <img :src="item.userAvatar">
                    <span class="user-name">{{ item.userName }}</span>
                  </a>
                  <el-tag size="mini" type="danger" v-if="item.state==='3'">
                    置顶
                  </el-tag>
                </div>
                <div class="article-comment-reply" v-if="item.parentContent!==null && item.parentContent!==''">
                  <span>回复@{{ item.userName }} :{{ item.parentContent }}</span>
                </div>
                <div class="article-comment-content">
                  {{ item.content }}
                </div>
                <div class="article-comment-action">
                <span class="el-icon-date">
                  {{ item.createTime | formatDate("yyyy-MM-dd hh:mm") }}
                </span>
                  ·
                  <span class="item-reply-btn" @click="onReplyClick(index,item.userName)">
                  回复
                </span>
                </div>
                <div class="article-sub-comment-box clear-fix" style="display: none" :id="'sub_input_'+index">
                  <div class="sub-comment-input float-left">
                    <el-input
                      @focus="checkLogin"
                      rows="2"
                      type="textarea"
                      :placeholder="subCommentPlaceHolder"
                      v-model="subComment"
                      maxlength="256"
                      show-word-limit>
                    </el-input>
                  </div>
                  <div class="sub-comment-btn float-left">
                    <el-button size="mini" type="primary" @click="doSubComment(item.content)">
                      回复
                    </el-button>
                  </div>
                </div>
              </div>
              <div class="no-comment-content" v-if="commentList.length===0">
                暂时没用评论,快来评论吧
                "┗|｀O′|┛ 嗷~~"
              </div>
              <div class="loader-more-comment" v-if="!isLastPage" @click="doLoadMore">
                加载更多评论 >>
              </div>
            </div>
          </div>
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

let lastInputBox = null;
export default {
  data() {
    return {
      subComment: '',
      comment: {
        content: '',
        articleId: '',
        parentContent: '',
      },
      isImageDialogShow: false,
      targetImagePath: '',
      keyword: '',
      currentPage: 1,
      pageSize: 10,
      subCommentPlaceHolder: '请文明回复',
    }
  },
  /*
  加载文章详情 需要传文章ID
   */
  async asyncData({params}) {
    let articleResult = await api.getArticleDetailById(params.id);
    let recommendArticle = await api.getRecommendArticle(articleResult.data.id, 10);
    let commentRes = await api.getCommentByArticleId(articleResult.data.id, 1, 10);
    // console.log(recommendArticle.data);
    // console.log('test....');
    // console.log(params.id);
    // console.log(commentRes.data.contents);

    return {
      articleRes: articleResult.data,
      recommendArticleRes: recommendArticle.data,
      commentList: commentRes.data.contents,
      isLastPage: commentRes.data.last,
    };
  },
  methods: {
    doSubComment(parentContent) {
      // 检查数据
      if (this.subComment === '') {
        this.$message.error("您还没填写回复内容呢!");
        return;
      }
      // 处理数据
      this.comment.content = this.subComment;
      this.comment.articleId = this.articleRes.id;
      this.comment.parentContent = parentContent;
      api.postComment(this.comment).then(result => {
        if (result.code === api.success_code) {
          // 刷新评论
          this.getArticleCommentByPage(1);
          this.resetComment();
          this.$message.success(result.message);
          let commentList = document.getElementById('article-comment-list');
          // console.log(commentList);
          if (commentList) {
            commentList.scrollIntoView({
              block: 'start',
              behavior: 'auto'
            })
          }
        } else {
          this.$message.error(result.message);
        }
      })
    },
    onReplyClick(index, userName) {
      // console.log(index);
      let subInputBox = document.getElementById('sub_input_' + index);
      this.subComment = '';
      this.subCommentPlaceHolder = '回复@' + userName;
      if (subInputBox) {
        if (lastInputBox) {
          lastInputBox.style.display = 'none';
        }
        lastInputBox = subInputBox;
        subInputBox.style.display = 'block';
      }
    },
    doLoadMore() {
      this.currentPage++;
      api.getCommentByArticleId(this.articleRes.id, this.currentPage, this.pageSize).then(result => {
        if (result.code === api.success_code) {
          // 处理成功的结果
          this.commentList = this.commentList.concat(result.data.contents);
          // 处理是否还有更多
          this.isLastPage = result.data.last;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    checkLogin() {
      api.checkToken().then(result => {
        // console.log(result);
        if (result.code === api.failed_code) {
          // 跳转到登录页面
          location.href = "/login?redirect=" + location.href;
        }
      });
    },
    doComment() {
      // 检查是否登陆过 只检查token
      let blogTokenIndex = document.cookie.indexOf('blog_token');
      // console.log('blogTokenIndex' + blogTokenIndex);
      if (blogTokenIndex === -1) {
        location.href = "/login?redirect=" + location.href;
        return;
      }
      // 检查内容
      if (this.comment.content === '') {
        this.$message.error('您没有填写任何评论内容呢!');
        return;
      }
      // 补全数据
      this.comment.articleId = this.articleRes.id;
      // 提交数据
      // console.log(this.comment);
      api.postComment(this.comment).then(result => {
        if (result.code === api.success_code) {
          // 刷新评论
          this.getArticleCommentByPage(1);
          this.resetComment();
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      })
    },
    resetComment() {
      this.comment.content = '';
      this.comment.parentContent = '';
      this.subComment = '';
      if (lastInputBox) {
        lastInputBox.style.display = 'none';
      }
    },
    getArticleCommentByPage(page) {
      api.getCommentByArticleId(this.articleRes.id, page, this.pageSize).then(result => {
        this.commentList = result.data.contents;
        // 处理页码
        this.currentPage = page;
      })
    },
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
      let categoryBox = document.getElementById('article-content-category');
      let parentPart = document.getElementById('article-box');
      if (labelsBox) {
        let bottomOfSearch = labelsBox.offsetTop + labelsBox.offsetHeight;
        if (scrolledTop >= bottomOfSearch) {
          // console.log('显示内容');
          categoryBox.style.position = 'fixed';
          categoryBox.style.top = '20px';
          categoryBox.style.width = '280px';
        } else {
          // categoryBox.style.width = 'auto';
          // console.log('隐藏');
          categoryBox.style.position = '';
          categoryBox.style.marginLeft = '';
          categoryBox.style.top = '';
        }
        // 处理左右
        if (scrolledLeft < 0) {
          categoryBox.style.left = parentPart.offsetWidth
            + parentPart.offsetLeft
            + categoryBox.offsetWidth
            + 'px';
        } else {
          categoryBox.style.left = parentPart.offsetWidth
            + parentPart.offsetLeft
            - categoryBox.offsetWidth
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
.sub-comment-btn {
  line-height: 54px;
  margin-left: 10px;
}

.article-sub-comment-box {
  margin-top: 10px;
}

.sub-comment-input {
  width: 650px;
  margin-left: 40px;
}

.comment-submit-btn {
  margin-top: 10px;
  text-align: right;
}

.article-comment-input {
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
}

.loader-more-comment, .no-comment-content {
  text-align: center;
  padding: 10px;
  cursor: pointer;
  margin-top: 20px;
}

.item-reply-btn:hover, .loader-more-comment:hover {
  color: #A612FF;
}

.item-reply-btn {
  cursor: pointer;
}

.article-comment-reply {
  padding: 10px;
  background: #F5F5F5;
  margin-left: 30px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.article-comment-content {
  padding: 10px;
  margin-left: 30px;
}

.article-comment-action {
  color: #7f828b;
  margin-right: 20px;
  text-align: right;
}

.article-comment-item {
  padding: 10px 0;
  border-bottom: #F5F5F5 solid 1px;
}

.article-comment-user-info img {
  width: 30px;
  height: 30px;
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
}

#article-catalog-container {
  max-height: 500px;
  overflow: hidden;
}

.cl-link > span:hover {
  color: #A612FF;
}

.cl-link > span {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.cl-link-active > span {
  color: #A612FF !important;
  background: #F2F2F2;
  display: block;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

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

#article-content-category-box li > span, #article-catalog-container li > span {
  padding-left: 5px;
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

.comment-item-list {
  margin-top: 10px;
}

.article-comment-list {
  background: #fff;
  margin-bottom: 20px;
  padding: 20px;
}

.comment-input-header {
  padding: 0 0 20px;
}

.recommend-header-title, .comment-input-header, .comment-list-header {
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

.article-comment-user-info .user-name:hover {
  color: #A612FF;
}

.article-comment-user-info .user-name {
  font-weight: 600;
  margin-left: 5px;
  display: inline-block;
  line-height: 30px;
  font-size: 14px;
  color: #7f828b;
}

.article-comment-user-info {
  margin-bottom: 10px;
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
  max-width: 780px;
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
  width: 820px;
}

.article-right-part {
  width: 300px;
}

.article-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

</style>
