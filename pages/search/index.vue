<template>
  <div class="search-box ">
    <div class="search-input-box">

    </div>
    <div class="search-condition-box">

    </div>
    <div class="search-result-box clear-fix">
      <div class="search-left-box float-left">
        <!-- 1140 - 20 = 1120 == > 1120 - 300 == > 820 -->
        <div class="search-result-count-info">
          找到约 <span v-text="searchResult.totalCount"></span> 条结果
        </div>
        <div class="search-result-list-box">
          <div class="search-result-item" v-for="(item,index) in searchResult.contents" :key="index">
            <div class="result-item-title" v-html="item.blogTitle">

            </div>
            <div class="result-item-content" v-html="item.blogContent">

            </div>
            <div class="search-info-box">
              <span v-text="item.blogCreateTime">

              </span>
              <span v-text="item.blogViewCount">

              </span>
              <span v-text="blogLabels">

              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="search-right-box float-left">
        <!--300px-->

      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';

export default {
  asyncData({query}) {
    // console.log(query);
    let categoryId = query.categoryId ? query.categoryId : '';
    let keyword = query.keyword ? query.keyword : '';
    let page = query.page ? query.page : 1;
    let size = query.size ? query.size : 10;
    let sort = query.sort ? query : '';

    // 发起请求 获得搜索内容
    return api.getSearchContent(categoryId, keyword,
      page, size, sort).then(result => {
      console.log(result.data);
      return {
        searchResult: result.data,
      }
    });
  }
}
</script>

<style>
.search-condition-box {
  height: 80px;
  margin-bottom: 20px;
  background: greenyellow;
}

.search-input-box {
  height: 80px;
  background: #A612FF;
}

.search-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.search-left-box {
  width: 820px;
  margin-right: 20px;
  background-color: #fff;
}

.search-right-box {
  width: 300px;
  height: 600px;
  background-color: #409EFF;
}
</style>
