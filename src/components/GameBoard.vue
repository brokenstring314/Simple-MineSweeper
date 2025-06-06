<script setup lang="ts">
import { inject } from "vue";
import { delta_x, delta_y, regenerateMines } from "../utils/newGame.ts";

let currentGame: Game = inject('currentGame')!

const showAllMines = () => {
  for (let i = 0; i < currentGame.yCellNumber; i++) {
    for (let j = 0; j < currentGame.xCellNumber; j++) {
      const cell = currentGame.cell[i][j];
      if (cell.mine) {
        cell.open = true;
      }
      // 标记错误的旗子（有旗子但没有雷的格子）
      if (cell.flag && !cell.mine) {
        cell.wrongFlag = true;
      }
    }
  }
}

const judgeResult = (): boolean => {
  if (currentGame.openGridNumber == currentGame.xCellNumber * currentGame.yCellNumber - currentGame.mine) {
    currentGame.gameStatus = 'Finished'
    currentGame.gameResult = 'Victory'
    return true;
  }
  return false;
}

const leftClickCell = (cell: Cell) => {
  if (currentGame.gameStatus == 'Finished') return
  if (cell.open == true) return
  if (cell.flag) {
    cell.flag = false;
    currentGame.flag--;
    return
  }//旗子不能再直接点开，直接点时消除旗子

  // 第一次点击时重新生成雷区
  if (currentGame.gameStatus === 'NotStarted') {
    regenerateMines(currentGame, cell.x, cell.y);
  }

  cell.open = true
  currentGame.openGridNumber++;
  //点击的格子本身也要计入
  if (cell.mine) {
    currentGame.gameStatus = 'Finished'
    currentGame.gameResult = 'Failed'
    showAllMines();
    return
  }
  //游戏未进行时，点开格子开始游戏
  if (currentGame.gameStatus !== 'InProgress')
    currentGame.gameStatus = 'InProgress'
  if (judgeResult()) return
  //judgeResult对了就赢了
  let cellQueue: Cell[] = [];
  cellQueue.push(cell);
  while (cellQueue.length !== 0) {
    let opr = cellQueue.shift();
    if (typeof opr === 'undefined') continue
    //下面是因为某个合法加入队列的元素同时有两个不同父元素
    //也就是说从其父元素遍历此元素会重复遍历到此处
    //所以计算开过格子的数量必须检查格子是否开过
    if (opr.flag) continue;
    //旗子不能再间接点开，而是保留旗子
    if (!opr.open) {
      currentGame.openGridNumber++;
      opr.open = true;
    }
    if (opr.number) continue
    for (let i = 0; i < 8; i++) {
      if (opr.y + delta_y[i] >= 0 && opr.y + delta_y[i] < currentGame.yCellNumber && opr.x + delta_x[i] >= 0 && opr.x + delta_x[i] < currentGame.xCellNumber) {
        let nextCell = currentGame.cell[opr.y + delta_y[i]][opr.x + delta_x[i]]
        if (!nextCell.mine && !nextCell.open) {
          cellQueue.push(nextCell)
        }
      }
    }
  }
}
let rightClickCell = (cell: Cell, event: any) => {
  // 事件处理逻辑
  console.log('Right click detected!');
  if (cell.open) return;
  if (currentGame.gameStatus == 'Finished') return;
  if (!cell.flag && (currentGame.mine - currentGame.flag > 0)) {
    cell.flag = true;
    currentGame.flag++;
  } else if (cell.flag) {
    cell.flag = false;
    currentGame.flag--;
  }
  event.preventDefault();
  // 阻止浏览器的默认上下文菜单显示
}

// let longPressTimer: number = 0;
// let touchNow:Ref<boolean> = ref(false)
// 默认长按就是替代右键菜单，所以不用单独设置长按事件
// const TouchStart = (cell: Cell) => {
//   longPressTimer = setTimeout(() => {
//     if (cell.open) return
//     if (touchNow.value) return
//     touchNow.value = true
//     console.log(1)
//     if (!cell.flag  && (currentGame.mine - currentGame.flag > 0)) {
//       console.log(2)
//       cell.flag = true;
//       currentGame.flag++;
//     } else if (cell.flag) {
//       console.log(3)
//       cell.flag = false;
//       currentGame.flag--;
//     }
//     console.log('长按事件触发');
//   }, 600);
// };
//
// const TouchEnd = () => {
//   touchNow.value = false
//   clearTimeout(longPressTimer);
// };

</script>

<template>
  <div class="w-full flex flex-col items-center">
    <div id="board" class="grid" :class="`grid-cols-${currentGame.xCellNumber}`"
      :style="`width:${currentGame.xCellNumber * 29.76}px`">
      <!-- 0 - 8 是扫雷格子的编号，bg-base 是基础背景色，border 是边框，p-2 是内边距 -->
      <div v-for="currentLine in currentGame.cell" class="p-0 m-0 w-4">
        <div v-for="n in currentLine" :class="{ 'wrong-flag': n.wrongFlag }" :id="n.open ? 'blankCell' : 'cell'"
          class="p-1 text-center no-select" @click="leftClickCell(n)" @contextmenu="rightClickCell(n, $event)">
          <div v-if="n.open && n.number && !n.mine" class="flex justify-center no-select">
            <img class="h-4 w-4 no-select" :src="`/number/${n.number}.png`">
          </div>
          <div v-if="n.open && n.mine" class="flex justify-center no-select">
            <img class="h-5 w-5 no-select" src="/mark/mine.svg">
          </div>
          <div v-if="!n.open && n.flag" class="flex justify-center no-select">
            <img class="h-5 w-5 no-select" src="/mark/flag.svg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-select {
  -webkit-touch-callout: none;
  /* 禁用iOS的长按弹出菜单 */
  -webkit-user-select: none;
  /* 禁用webkit浏览器的选择功能 */
  -moz-user-select: none;
  /* 火狐浏览器选择功能 */
  -ms-user-select: none;
  /* IE10选择功能 */
  user-select: none;
  /* 标准CSS选择功能 */
}

#cell {
  height: 1rem;
  width: 1rem;
  background-color: rgb(192, 192, 193);
  /* 元素本身的颜色 */
  border-top: 3px solid rgb(255, 255, 255);
  /* 上边的边框 */
  border-left: 3px solid rgb(255, 255, 255);
  /* 左边的边框 */
  border-bottom: 3px solid rgb(128, 128, 128);
  /* 下边的边框 */
  border-right: 3px solid rgb(128, 128, 128);
  /* 右边的边框 */
}

#blankCell {
  height: 1.0rem;
  width: 1.0rem;
  background-color: rgb(190, 190, 190);
  /* 元素本身的颜色 */
  border: 3px solid rgb(138, 138, 138);
  /* 上边的边框 */
}

#cell:hover {
  background-color: rgb(175, 175, 175);
}

.wrong-flag {
  background-color: rgb(255, 200, 200) !important;
  /* 浅红色背景 */
}

.grid-cols-9 {
  grid-template-columns: repeat(9, minmax(0, 1fr));
}

.grid-cols-10 {
  grid-template-columns: repeat(10, minmax(0, 1fr));
}

.grid-cols-11 {
  grid-template-columns: repeat(11, minmax(0, 1fr));
}

.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.grid-cols-13 {
  grid-template-columns: repeat(13, minmax(0, 1fr));
}

.grid-cols-14 {
  grid-template-columns: repeat(14, minmax(0, 1fr));
}

.grid-cols-15 {
  grid-template-columns: repeat(15, minmax(0, 1fr));
}

.grid-cols-16 {
  grid-template-columns: repeat(16, minmax(0, 1fr));
}

.grid-cols-17 {
  grid-template-columns: repeat(17, minmax(0, 1fr));
}

.grid-cols-18 {
  grid-template-columns: repeat(18, minmax(0, 1fr));
}

.grid-cols-19 {
  grid-template-columns: repeat(19, minmax(0, 1fr));
}

.grid-cols-20 {
  grid-template-columns: repeat(20, minmax(0, 1fr));
}

.grid-cols-21 {
  grid-template-columns: repeat(21, minmax(0, 1fr));
}

.grid-cols-22 {
  grid-template-columns: repeat(22, minmax(0, 1fr));
}

.grid-cols-23 {
  grid-template-columns: repeat(23, minmax(0, 1fr));
}

.grid-cols-24 {
  grid-template-columns: repeat(24, minmax(0, 1fr));
}

.grid-cols-25 {
  grid-template-columns: repeat(25, minmax(0, 1fr));
}

.grid-cols-26 {
  grid-template-columns: repeat(26, minmax(0, 1fr));
}

.grid-cols-27 {
  grid-template-columns: repeat(27, minmax(0, 1fr));
}

.grid-cols-28 {
  grid-template-columns: repeat(28, minmax(0, 1fr));
}

.grid-cols-29 {
  grid-template-columns: repeat(29, minmax(0, 1fr));
}

.grid-cols-30 {
  grid-template-columns: repeat(30, minmax(0, 1fr));
}
</style>