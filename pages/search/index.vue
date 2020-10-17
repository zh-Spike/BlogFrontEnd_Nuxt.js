<template>
  <div class="search-box ">
    <div class="default-boarder-radius search-input-service">
      <div class="search-input-box ">
        <div class="search-input-container  clear-fix">
          <div class="search-logo float-left">
            <span class="logo">Spike</span>
            <span> | </span>
            <span>搜索</span>
          </div>
          <div class="search-input float-left">
            <el-input @keyup.enter.native="toSearchPage" v-model="keyword" placeholder="您有什么想要搜索的嘛？(つд⊂)"></el-input>
          </div>
          <div class="search-btn float-left">
            <el-button type="primary" icon="el-icon-search" @click="toSearchPage">搜索</el-button>
          </div>
        </div>
      </div>
      <div class="search-condition-box ">
        <div class="select-item">
          <span :class="sort===''?'sort-active':''" @click="doSearchBySort('')">综合排序</span>
          <span @click="doSearchBySort('2')" :class="sort==='2'||sort==='1'?'sort-active':''">时间</span>
          <span @click="doSearchBySort('4')" :class="sort==='3'||sort==='4'?'sort-active':''">浏览量</span>
        </div>
        <div class="select-item">
          <span :class="categoryId===''?'category-active':''" @click="doSearchByCategory('')">全部分类</span>
          <span :class="categoryId===item.id?'category-active':''"
                v-for="item in categories" :key="item.id"
                @click="doSearchByCategory(item.id)">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <div class="search-result-box default-boarder-radius clear-fix">
      <div class="search-left-box float-left">
        <div class="search-result-list">
          <!-- 1140 - 20 = 1120 == > 1120 - 300 == > 820 -->
          <div class="search-result-count-info">
            找到约 <span v-text="searchResult.totalCount"></span> 条结果
          </div>
          <div class="search-result-list-box" v-if="searchResult.contents.length!==0">
            <div class="search-result-item" v-for="(item,index) in searchResult.contents" :key="index">
              <a :href="'/article/'+item.id">
                <div class="result-item-title" v-html="item.blogTitle">
                </div>
              </a>
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
          <div class="search-result-empty-box" v-else>
            <div class="empty-box">
              <div class="sob_blog sobemptybox"></div>
              <div class="empty-box">没有找到所求内容 (￣_,￣ )</div>
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
      <div class="search-right-box float-left">
        <!--300px-->
        <div class="search-hot-word default-boarder-radius">
          <div class="card-header">
            热门标签
          </div>
          <word-cloud></word-cloud>
        </div>
      </div>
      <div class="extend-box default-boarder-radius">

      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';

export default {
  async asyncData({query}) {
    // console.log(query);
    let categoryId = query.categoryId ? query.categoryId : '';
    let keyword = query.keyword ? query.keyword : '';
    let page = query.page ? query.page : 1;
    let size = query.size ? query.size : 10;
    let sort = query.sort ? query.sort : '';

    // 发起请求 获得搜索内容
    // 改为同步
    let result = await api.getSearchContent(categoryId, keyword,
      page, size, sort);
    let tempResult = result.data;
    let contents = tempResult.contents;
    contents.forEach(item => {
      item.blogLabels = item.blogLabels.split("-");
      // console.log(item.blogLabels);
    });
    // 获取分类
    let categoriesRes = await api.getCategories();
    // console.log(categoriesRes.data);
    return {
      categories: categoriesRes.data,
      categoryId: categoryId,
      keyword: keyword,
      page: parseInt(page),
      size: parseInt(size),
      sort: sort,
      isFirst: tempResult.first,
      isLast: tempResult.last,
      searchResult: tempResult,
    }
  },
  methods: {
    doSearchByCategory(categoryId) {
      location.href = "/search?keyword=" + encodeURIComponent(this.keyword) + '&sort=' + this.sort + '&categoryId=' + categoryId;
    },
    doSearchBySort(sort) {
      if (sort === '2' && this.sort === '2') {
        sort = '1';
      }
      if (sort === '4' && this.sort === '4') {
        // 浏览量的倒序顺序
        sort = '3';
      }
      // 时间的倒序顺序
      location.href = "/search?keyword=" + encodeURIComponent(this.keyword) + '&sort=' + sort + '&categoryId=' + this.categoryId;
    },
    toSearchPage() {
      location.href = "/search?keyword=" + encodeURIComponent(this.keyword);
    },
  },
  mounted() {
    this.$store.commit("setCurrentActivityTab", "index");
  }
}

</script>

<style>
.search-input-service {
  background: #FFffff;
}

.search-hot-word {
  padding: 20px;
  background: #FFffff;
  margin-bottom: 20px;
}

.card-header {
  color: #909399;
  padding-bottom: 15px;
  padding-top: 5px;
  border-bottom: 1px solid #d7d8db;
  font-weight: 600;
}

.search-result-empty-box .empty-text {
  font-size: 20px;
  line-height: 40px;
}

.search-result-empty-box {
  height: 400px;
  text-align: center;
  margin-top: 120px;
  color: #409EFF;
}

.search-result-empty-box .sobemptybox {
  font-size: 70px;
}

.category-active, .sort-active {
  background: #409EFF;
  border-radius: 4px;
  color: #FFffff !important;
}

.select-item span:hover {
  color: #409EFF;
}

.select-item span {
  color: #737F90;
  margin-right: 8px;
  margin-left: 8px;
  font-size: 13px;
  cursor: pointer;
  padding: 5px 15px;
}

.select-item {
  margin-top: 10px;
  line-height: 24px;
}

.search-input-container {
  display: inline-block;
  line-height: 40px;
}

.search-logo .logo {
  font-size: 30px;
}

.search-logo {
  color: #409EFF;
  font-size: 20px;
  font-weight: 600;
  margin-right: 20px;
}

.search-input .el-input__inner {
  border-width: 2px;
}

.search-input {
  width: 300px;
  margin-right: 20px;
}

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
  margin-left: 20px;
}

.search-condition-box {
  border-top: solid 1px #DCDFE6;
  margin-bottom: 20px;
  padding: 20px 20px 30px;
}

.search-input-box {
  padding: 20px;
  text-align: center;
}

.search-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.search-left-box {
  width: 820px;
  margin-right: 20px;
}

.search-hot-word .wordCloud {
  width: 100%;
}

.search-right-box {
  width: 300px;
}
</style>
