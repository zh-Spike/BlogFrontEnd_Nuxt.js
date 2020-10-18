<template>
  <div class="link-page-box">
    <div class="link-title">
      友链
    </div>
    <div class="link-list-box clear-fix">
      <div :title="item.name" class="link-item float-left" v-for="(item,index) in linksList" :key="index">
        <a :href="item.url" target="_blank"><!--ref="nofollow"-->
          <img :src="'http://localhost:8082/portal/image/'+item.logo">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';

export default {
  head() {
    return {
      title: 'zh-spike系统-友情链接',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'zh-spike系统-友情链接'
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
    this.$store.commit("setCurrentActivityTab", "link");
  },
  asyncData() {
    return api.getLinkList().then(result => {
      console.log(result.data);
      return {
        linksList: result.data
      }
    });
  },
}
</script>

<style>
.link-title {
  text-align: center;
  font-size: 40px;
  color: #737F90;
  margin-top: 20px;
  margin-bottom: 20px;
  font-weight: 600;
}

.link-page-box {
  margin-top: 20px;
  margin-bottom: 20px;
  background: #FFffff;
  padding: 20px;
}

.link-item img {
  width: 150px;
  height: 57px;
  vertical-align: middle;
}

.link-item:hover {
  border: #A612FF 1px solid;
}

.link-item {
  padding: 10px;
  margin: 10px;
  width: 233px;
  text-align: center;
  border: #dfdfdf 1px solid;
  cursor: pointer;
}
</style>
