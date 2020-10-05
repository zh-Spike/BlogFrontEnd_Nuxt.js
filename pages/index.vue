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
    </div>

    <div class="index-center-part float-left">
      <div class="loop-box default-border-radius">
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item v-for="(item,index) in loop" :key="index">
            <img :src="item.imageUrl" style="object-fit: cover">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="top-article-box">
        <div class="top-article-item default-border-radius" v-for="(item,index) in topArticle" :key="index">
          <div class="top-article-cover">
            <img :src="'http://localhost:8082/portal/image/'+item.cover">
          </div>
          <div class="top-article-title">
            <span class="top-tips">置顶</span>
            <span class="top-title">{{ item.title }}</span>
          </div>
          <div class="top-article-summary">
            <p>
              {{ item.summary }}
              <span>...</span>
              <span class="read-more">读取全文</span>
            </p>
          </div>
          <div class="top-labels">
            <el-tag
              size="medium"
              v-for="(tag,tagIndex) in item.labels"
              :key="tagIndex">
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
    <div class="index-right-part float-left">

    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';

export default {
  async asyncData({params}) {
    let userInfoRes = await api.getAdminInfo();
    let categoriesRes = await api.getCategories();
    let loopRes = await api.getLoop();
    let topArticleRes = await api.getTopArticle();
    return {
      userInfo: userInfoRes.data,
      categories: categoriesRes.data,
      loop: loopRes.data,
      topArticle: topArticleRes.data,
    };
  }
}
</script>

<!--1140px 240px 660px 240px-->
<style>
.read-more:hover {
  border: #444444 solid 1px;
}

.top-labels .el-tag {
  margin-right: 10px;
  cursor: pointer;
}

.top-labels {
  margin-top: 20px;
}

.read-more {
  border: #999999 solid 1px;
  border-radius: 4px;
  cursor: pointer;
  padding: 3px 10px;
  font-size: 12px;
}

.top-article-summary {
  margin-top: 20px;
  color: #909399;
}

.top-article-title .top-tips {
  background: #ff4500;
  color: #FFffff;
  padding: 3px 10px;
  vertical-align: middle;
  border-radius: 4px;
}

.top-article-item {
  background: #FFffff;
  margin-bottom: 20px;
  padding: 10px;
}

.top-article-title .top-title {
  font-size: 24px;
  vertical-align: middle;
  color: #606266;
}

.top-article-box {
  margin-top: 20px;
}

.top-article-cover img {
  width: 100%;
  height: 300px;
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
  margin-top: 20px;
}

.left-user-self-links span:hover {
  color: #909090;
}

.left-user-self-links {
  text-align: center;
  margin-top: 20px;
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
  margin-top: 10px;
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

.index-right-part {
  margin-left: 10px;
}

.index-left-part {
  margin-right: 10px;
}

.index-left-part, .index-right-part {
  padding: 10px;
  width: 210px;
  background: #FFffff;
}

.index-center-part {
  width: 640px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
