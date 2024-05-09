<script setup lang="ts">
import {inject} from "vue";

let currentGame: Game = inject('currentGame')

const emit = defineEmits(["reGame"])

let optionButton = function () {
  emit("reGame")
}

</script>

<template>
  <div class="bg-blue-100 w-full h-16 grid grid-cols-3 items-center justify-items-center">
    <div class="text-lg">剩余红旗:{{currentGame.mine - currentGame.flag}}</div>
    <div class="w-30 h-full bg-green-200 flex flex-col items-center hover:cursor-pointer" @click="optionButton">
      <img v-if="currentGame.gameResult==='NotFinished'" src="/result/wu.png" class="w-8 h-8">
      <img v-if="currentGame.gameResult==='Victory' " src="/result/win.png" class="w-8 h-8">
      <img v-if="currentGame.gameResult==='Failed'" src="/result/fail.png" class="w-8 h-8">
      <div>
        <span v-if="currentGame.gameResult==='NotFinished'">你实力如何？</span>
        <span v-if="currentGame.gameResult==='Failed'">你输了，废物</span>
        <span v-if="currentGame.gameResult==='Victory'">你赢了，牛比</span>
      </div>
    </div>
<!--    <div class="text-lg">游戏时间:{{}}</div>-->
  </div>
</template>

<style scoped>

</style>