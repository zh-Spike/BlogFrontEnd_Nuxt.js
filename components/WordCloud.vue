<template>
  <div class="word-cloud">
    <client-only>
      <wordcloud
        :margin="margin"
        :rotate="rotate"
        :wordPadding="wordPadding"
        :fontSize="fontSize"
        :data="defaultWords"
        nameKey="name"
        valueKey="count"
        :showTooltip="false"
        :wordClick="wordClickHandler">
      </wordcloud>
    </client-only>
  </div>
</template>

<script>
import * as api from "@/api/api";

export default {
  mounted() {
    this.listLabels();
  },
  data() {
    return {
      margin: {top: 0, right: 0, bottom: 0, left: 0},
      rotate: {from: -30, to: 30, numOfOrientation: 20},
      fontSize: [30, 50],
      wordPadding: 4,
      defaultWords: [],
    }
  },
  methods: {
    wordClickHandler(name, value, vm) {
      // console.log(value);
      // name就关键字 直接跳转
      location.href = '/search?keyword' + encodeURIComponent(name);
    },
    listLabels() {
      api.getLabels(20).then(result => {
        if (result.code === api.success_code) {
          this.defaultWords = result.data.content;
        }
      });
    },
  },
}
</script>

<style>

</style>
