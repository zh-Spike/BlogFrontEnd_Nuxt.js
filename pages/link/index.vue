<template>
  <div class="index-page-box">
    <div class="link-title">

    </div>
    <div class="link-list-box">
      <div class="link-item">

      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';

export default {
  asyncData() {
    api.getFriendLink();
  }
}
</script>

<style>

</style>
