<script setup lang="ts">
import GameBoard from "./GameBoard.vue";
import {provide, reactive, Ref, ref, watch} from "vue";
import OperatingPanel from "./OperatingPanel.vue";
import ScoreBoard from "./ScoreBoard.vue";
import {newGame} from "../utils/newGame.ts";
import {GameTimer} from "../utils/timer.ts";

const gameMode:Ref = ref(localStorage.getItem("mineSweeperGameMode")?localStorage.getItem("mineSweeperGameMode"):"beginner")
let currentGame: any = reactive(newGame(gameMode.value))
const properties = ['cell', 'mine', 'flag',"openGridNumber", 'xCellNumber', 'yCellNumber', 'gameStatus', 'gameStart', 'gameTime', 'gameResult'];

const gameTimer = new GameTimer();

let startNewGame = () => {
  console.log("startNewGame")
  let game = newGame(gameMode.value)
  for(let opr of properties){
    currentGame[opr] = game[opr]
  }
  gameTimer.resetTimer();
}

watch(() => currentGame.gameStatus, (newStatus) => {
  if (newStatus === 'InProgress') {
    gameTimer.startTimer((time) => {
      currentGame.gameTime = time;
    });
  } else if (newStatus === 'Finished') {
    gameTimer.stopTimer();
  }
});

watch(gameMode,(newValue)=>{
  localStorage.setItem("mineSweeperGameMode",newValue)
})

provide(/* 注入名 */ 'currentGame', /* 值 */ currentGame)
provide(/* 注入名 */ 'gameMode', /* 值 */gameMode)

</script>

<template>
  <div class="w-120 h-150 bg-gray-100 flex flex-col justify-between">
    <ScoreBoard @reGame="startNewGame">
    </ScoreBoard>
    <GameBoard></GameBoard>
    <OperatingPanel></OperatingPanel>
  </div>
</template>

<style scoped>

</style>