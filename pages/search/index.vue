<template>
  <div class="search-box ">
    <div class="search-input-box">

    </div>
    <div class="search-condition-box">

    </div>
    <div class="search-result-box clear-fix">
      <div class="search-left-box float-left">
        <div class="search-result-list">
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
              <span class="sob_blog sobicon">
                {{ item.blogCreateTime |formatDate("yyyy-MM-dd hh:mm:ss") }}
              </span>
                <span class="sob_blog sobview">
               {{ item.blogViewCount }}
              </span>
              </div>
              <div class="search-info-box">
              <span>
                <el-tag
                  size="mini"
                  v-for="(tag,tagIndex) in item.blogLabels"
                  :key="tagIndex"
                  type="info">
                  {{ tag }}
                </el-tag>
              </span>
              </div>
            </div>
          </div>
        </div>
        <div class="search-result-page-navigation-box clear-fix">
          <div class="search-pre float-left">
            <el-link disabled v-if="isFirst">
              &lt;&lt; 上一页
            </el-link>
            <el-link v-else :href="'search?keyword='+keyword
                                  +'&page='+(page-1)
                                  +'&sort='+sort
                                  +'&categoryId='+categoryId">
              &lt;&lt; 上一页
            </el-link>
          </div>
          <div class="search-next float-right">
            <el-link disabled v-if="isLast">
              下一页 &gt;&gt;
            </el-link>
            <el-link v-else :href="'search?keyword='+keyword
                                  +'&page='+(page+1)
                                  +'&sort='+sort
                                  +'&categoryId='+categoryId">
              下一页 &gt;&gt;
            </el-link>
          </div>
        </div>
      </div>
      <div class=" search-right-box float-left">
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
      // console.log(result.data);
      // 处理一下标签
      let tempResult = result.data;
      let contents = tempResult.contents;
      contents.forEach(item => {
        item.blogLabels = item.blogLabels.split("-");
        // console.log(item.blogLabels);
      });
      return {
        categoryId: categoryId,
        keyword: keyword,
        page: parseInt(page),
        size: parseInt(size),
        sort: sort,
        isFirst: tempResult.first,
        isLast: tempResult.last,
        searchResult: tempResult,
      }
    });
  }
}
</script>

<style>
.search-pre, .search-next {
  cursor: pointer;
}

.search-pre:hover, .search-next:hover {
  color: #409EFF;
}

.search-pre-disabled, .search-next-disabled {
  cursor: not-allowed;
}

.search-result-list {
  padding-top: 20px;
  background: #fff;
}

.search-result-page-navigation-box {
  background: #fff;
  margin-top: 20px;
  padding: 20px;
}

.search-info-box span {
  margin-right: 10px;
}

.search-info-box {
  color: #999;
  margin-bottom: 5px;
  font-size: 14px;
}

.result-item-content {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #4d5156;
  font-size: 16px;
  display: -webkit-box;
  line-height: 20px;
  height: 40px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.search-result-item {
  margin-bottom: 20px;
}

.result-item-title {
  color: #409EFF;
  margin-top: 10px;
  margin-bottom: 10px;
  display: -webkit-box;
  cursor: pointer;
  line-height: 26px;
  height: 26px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  font-size: 20px;
}

.search-result-list-box {
  padding: 20px;
}

.search-result-count-info {
  color: #70757a;
  line-height: 20px;
  font-size: 16px;
  padding: 10px;
  margin-left: 20px;
}

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
}

.search-right-box {
  width: 300px;
  height: 600px;
  background-color: #409EFF;
}
</style>
