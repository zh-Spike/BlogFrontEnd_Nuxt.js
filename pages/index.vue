<template>
  <div class="index-page-box clear-fix">
    <div class="index-left-part default-boarder-radius float-left">
      <div class="index-left-user-info">
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
      <div class="left-user-self-links">
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
    let categories = await api.getCategories();
    return {
      userInfo: userInfoRes.data,
      categories: categories.data
    };
  }
}
</script>

<!--1140px 240px 660px 240px-->
<style>

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
  width: 620px;
  padding: 10px;
  height: 300px;
  margin-left: 10px;
  margin-right: 10px;
  background: dodgerblue;
}
</style>
