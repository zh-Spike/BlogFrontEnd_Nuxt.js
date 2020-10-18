<template>
  <div class="about-box clear-fix" id="about-box">
    <div class="about-left-part float-left" id="about-left-part">
      <el-tabs tab-position="left" v-model="target" @tab-click="onLeftItemClick">
        <el-tab-pane label="关于zh-spike(about)" name="about"></el-tab-pane>
        <el-tab-pane label="我们的使命(mission)" name="mission"></el-tab-pane>
        <el-tab-pane label="我们的期望(vision)" name="vision"></el-tab-pane>
        <el-tab-pane label="旗下网站(websites)" name="websites"></el-tab-pane>
        <el-tab-pane label="联系我们(contacts)" name="contacts"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="about-right-part float-left" id="about-right-part">
      <div class="about-item">
        <h1 id="about">
          关于zh-spike
        </h1>
        <p>
          zh-spike HDU通信学生
          VegetableTechnology
          摊牌了 有点好
        </p>
      </div>
      <div class="about-item">
        <h1 id="mission">
          我们的使命
        </h1>
        <p>
          恰个饭
          You’ve been added to the VegetableTechnology organization!
          Here are some quick tips for a first-time organization member.

          Use the switch context button in the upper left corner of this page to switch between your personal context
          (zh-Spike) and organizations you are a member of.
          After you switch contexts you’ll see an organization-focused dashboard that lists out organization
          repositories and activities.
        </p>
      </div>
      <div class="about-item">
        <h1 id="vision">
          我们的愿景
        </h1>
        <p>
          找个java厂上班

          N皇后 II 384 81.8% 困难
          两数之和 7152 49.7% 简单
          外观数列 1455 56.6% 简单
          移动零 1418 62.5% 简单
          环形链表 1417 50.3% 简单
          买卖股票的最佳时机 II 1188 63.6% 简单
        </p>
      </div>
      <div class="about-item">
        <h1 id="websites">
          旗下网站
        </h1>
        <div class="websites">
          <ul>
            <li><a href="https://github.com/zh-Spike?tab=repositories/" target="_blank">zh-spike</a></li>
            <li><a href="https://github.com/VegetableTechnology" target="_blank">蔬菜科技(VT)</a></li>
            <li><a href="https://github.com/orgs/VegetableTechnology/teams/vt_touchfish/" target="_blank">VT摸鱼事业群</a>
            </li>
          </ul>
          <div class="about-img">
            <img src="https://img.nga.178.com/attachments/mon_201807/13/-421abQ5-dj5oZ17T3cS18g-m8.jpg">
          </div>
        </div>
      </div>
      <div class="about-item">
        <h1 id="contacts">
          联系我们
        </h1>
        <div class="about-img">
          <img src="https://img.nga.178.com/attachments/mon_201807/20/h4Q5-aeqlXgZ4bT3cSqe-hy.png">
        </div>
        <p class="contact">
          github
          <br>
          邮箱1 zh-bebop@outlook.com
          <br>
          邮箱2 zh.bebop@gmail.com
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'zh-spike系统-关于',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'zh-spike系统-关于页面'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: '杭州电子科技大学, HDU, 项目, 实验室, 系统'
        }
      ]
    }
  },
  data() {
    return {
      target: 'about',
      contentHeaders: [],
      isClickLeftSwitch: false
    }
  },
  methods: {
    onLeftItemClick() {
      this.isClickLeftSwitch = true;
      this.$router.push({
        path: '/about#' + this.target
      });
    },
    onWindowScroll() {
      let dy = document.documentElement.scrollTop;
      let dx = document.documentElement.scrollLeft;
      let leftBox = document.getElementById('about-left-part');
      let parentBox = document.getElementById('about-box');
      if (leftBox && parentBox) {
        let parentBoxTop = parentBox.offsetTop;
        // console.log(parentBoxTop);
        if (dy > parentBoxTop) {
          leftBox.style.top = '0px';
        } else {
          leftBox.style.top = (parentBoxTop - dy) + 'px';
        }
        // 处理横向滑动
        if (dx > 0) {
          leftBox.style.left = -dx + 'px';
        } else {
          leftBox.style.left = parentBox.offsetLeft + 'px';
        }
      }
      if (!this.isClickLeftSwitch) {
        // 处理标签滚动的范围
        for (let i = 0; i < this.contentHeaders.length - 1; i++) {
          let first = this.contentHeaders[i];
          let second = this.contentHeaders[i + 1];
          // 关于padding做了一些优化
          if (dy >= first.offTop - 40 && dy < second.offTop - 40) {
            this.target = first.id;
            // console.log(this.target);
            break;
          }
        }
      } else {
        this.isClickLeftSwitch = false;
      }
      // console.log("scroll...");
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  },
  mounted() {
    // 处理内容部分的H1标签距离 从后台获取数据
    // 在mounted去完后 处理数据
    let rightContent = document.getElementById('about-right-part');
    let h1List = rightContent.querySelectorAll('h1');
    h1List.forEach(item => {
      this.contentHeaders.push({
        offTop: item.offsetTop,
        id: item.id
      });
    });

    let that = this;
    window.onresize = function () {
      that.onWindowScroll();
    }
    window.addEventListener("scroll", this.onWindowScroll);
    this.$store.commit("setCurrentActivityTab", "about");
    this.onWindowScroll();
  },
}
</script>

<style>
#about-left-part {
  position: fixed;
  top: 91px;
}

.about-left-part .el-tabs--left .el-tabs__header.is-left {
  margin-right: 0;
}

.about-left-part .el-tabs__item {
  border-right: 1px dashed #e0e0e0;
  height: fit-content;
  color: #666;
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 16px;
  transition: all .3s;
}

.about-left-part .el-tabs__nav {
  padding-right: 30px;
}

.about-left-part .el-tabs__item.is-active {
  color: #A612FF;
  font-size: 18px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-weight: 600;
  transition: all .3s;
}

.about-left-part .el-tabs__item.is-active::after {
  content: " ";
  display: inline-block;
  position: absolute;
  right: -20px;
  width: 27px;
  height: 27px;
  border: 6px solid #A612FF;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  background-color: #fff;
  -webkit-transform: scale(.5);
  -moz-transform: scale(.5);
  -ms-transform: scale(.5);
  transform: scale(.5);
}

.about-left-part .el-tabs__nav-wrap::after {
  display: none;
}

.about-left-part .el-tabs__active-bar {
  width: 0 !important;
}

.about-left-part .el-tabs {
  text-align: right;
}

.about-left-part .el-tabs--left .el-tabs__header.is-left {
  float: none;
}

.about-box {
  background: #fff;
  margin-top: 20px;
  margin-bottom: 20px;
}

.about-left-part {
  /*
  1140-300=840px
  */
  width: 300px;
  padding-top: 20px;
  min-height: 300px;
}

.about-right-part {
  width: 710px;
  padding: 40px 110px 20px 20px;
  margin-left: 300px;
  /*height: 1900px;*/
}

.about-item {
  padding-top: 5px;
  padding-bottom: 80px;
  line-height: 30px;
  font-size: 16px;
}

.about-right-part .about-img {
  margin-bottom: 100px;
}

.about-right-part .about-img img {
  width: 100%;
}

.websites a {
  padding-right: 10px;
  color: #7f828b;
}

.websites {
  margin-left: 20px;
}

.about-item p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

h1 {
  color: #737f90;
  font-size: 24px;
  font-weight: 600;
}

.about-right-part h1 {
  margin-bottom: 20px;
}

.about-item .contact {
  color: #7f828b;
}

</style>
