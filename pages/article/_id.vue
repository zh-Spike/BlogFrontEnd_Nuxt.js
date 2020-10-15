<template>
  <div class="article-box clear-fix">
    <div class="article-left-part default-board-radius float-left">
      <div class="article-title">
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
          {{ item }}
        </el-tag>
      </div>
      <div class="article-content" v-html="articleRes.content">

      </div>
    </div>
    <div class="article-right-part default-board-radius float-left">

    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';

export default {
  /*
  加载文章详情 需要传文章ID
   */
  asyncData({params}) {
    // console.log('test....');
    // console.log(params.id);
    return api.getArticleDetailById(params.id).then(result => {
      if (result.code === api.success_code) {
        console.log(result.data);
        return {
          articleRes: result.data
        };
      }
    })
  }
};
</script>

<style>
.article-content ul {
  margin-left: 20px;
}

.article-content p, .article-content ul {
  line-height: 24px;
  color: #7f828b;
  font-size: 16px;
  padding: 10px 0;
}

.article-content h1 {
  color: #000;
  line-height: 40px;
}

.article-title h1 {
  color: #000;
}

.article-content {
  margin-top: 20px;
}

.article-content img {
  max-width: 780px;
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

.article-left-part {
  margin-right: 20px;
  width: 780px;
  padding: 20px;
  height: 600px;
  background: #fff;
}

.article-right-part {
  width: 300px;
  height: 400px;
  background: #A612FF;
}

.article-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

</style>
