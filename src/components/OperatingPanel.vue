<script setup lang="ts">

import {inject} from "vue";

let selectedDifficulty = inject('gameMode')


</script>

<template>
<div class="bg-violet-100 h-10 flex justify-between">
  <div>
    游戏难度:
    <select class="select select-bordered w-24 max-w-xs" v-model="selectedDifficulty">
      <option disabled selected>Choose the game difficulty</option>
      <option>beginner</option>
      <option>intermediate</option>
    </select>
  </div>
  <div>
    点击顶部表情即可重开
  </div>
</div>
</template>

<style scoped>

</style>