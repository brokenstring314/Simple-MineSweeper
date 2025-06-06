'use strict'

export let delta_x = [-1, 0, 1, -1, 0, 1, -1, 1]
export let delta_y = [0, 1, 0, -1, -1, -1, 1, 1]

let gameModeData: { [key: string]: ModeData } = {
    "beginner": {
        mineNumber: 10,
        xCellNumber: 9,
        yCellNumber: 9,
        modeName: "beginner"
    },
    "intermediate":{
        mineNumber: 40,
        xCellNumber: 16,
        yCellNumber: 16,
        modeName: "intermediate"
    },
    "expert":{
        mineNumber: 99,
        xCellNumber: 30,
        yCellNumber: 16,
        modeName: "expert"
    }
}

// 判断一个位置是否在安全区域内（第一次点击的位置及其周围）
const isInSafeArea = (x: number, y: number, safeX: number, safeY: number): boolean => {
    for (let i = 0; i < 8; i++) {
        if (x === safeX + delta_x[i] && y === safeY + delta_y[i]) {
            return true;
        }
    }
    return x === safeX && y === safeY;
}

// 重新生成雷区，确保安全区域内没有雷
export const regenerateMines = (game: Game, safeX: number, safeY: number): void => {
    const modeData = gameModeData[game.modeName];
    // const totalCells = modeData.xCellNumber * modeData.yCellNumber;
    const availableCells: number[] = [];

    // 收集所有可以放置雷的位置（排除安全区域）
    for (let i = 0; i < modeData.yCellNumber; i++) {
        for (let j = 0; j < modeData.xCellNumber; j++) {
            if (!isInSafeArea(j, i, safeX, safeY)) {
                availableCells.push(i * modeData.xCellNumber + j);
            }
        }
    }

    // 随机选择位置放置雷
    const randomMines = new Set<number>();
    while (randomMines.size < modeData.mineNumber) {
        const index = Math.floor(Math.random() * availableCells.length);
        const position = availableCells[index];
        randomMines.add(position);
        availableCells.splice(index, 1); // 移除已选择的位置
    }

    // 重置所有格子
    for (let i = 0; i < modeData.yCellNumber; i++) {
        for (let j = 0; j < modeData.xCellNumber; j++) {
            const cell = game.cell[i][j];
            cell.mine = randomMines.has(i * modeData.xCellNumber + j);
            cell.number = 0;
        }
    }

    // 重新计算数字
    for (let i = 0; i < modeData.yCellNumber; i++) {
        for (let j = 0; j < modeData.xCellNumber; j++) {
            if (game.cell[i][j].mine) {
                for (let k = 0; k < 8; k++) {
                    if (i + delta_y[k] >= 0 && i + delta_y[k] < modeData.yCellNumber && 
                        j + delta_x[k] >= 0 && j + delta_x[k] < modeData.xCellNumber) {
                        game.cell[i + delta_y[k]][j + delta_x[k]].number++;
                    }
                }
            }
        }
    }
}

export const newGame = (gameModeName: string):Game => {
    let cell: Cell[][] = []
    let modeData = gameModeData[gameModeName]
    let randomMine: any[] = getRandomNumber(modeData.xCellNumber * modeData.yCellNumber, modeData.mineNumber)
    for (let i = 0; i < modeData.yCellNumber; i++) {
        cell[i] = []
        for (let j = 0; j < modeData.xCellNumber; j++) {
            cell[i][j] = {
                x: j,
                y: i,
                mine: randomMine.includes(i * modeData.xCellNumber + j),
                open: false,
                number: 0,
                flag: false,
                wrongFlag: false
            }
        }
    }
    for (let i = 0; i < modeData.yCellNumber; i++) {
        for (let j = 0; j < modeData.xCellNumber; j++) {
            if (cell[i][j].mine) {
                for (let k = 0; k < 8; k++) {
                    if (i + delta_y[k] >= 0 && i + delta_y[k] < modeData.yCellNumber && j + delta_x[k] >= 0 && j + delta_x[k] < modeData.xCellNumber) {
                        cell[i + delta_y[k]][j + delta_x[k]].number++
                    }
                }
            }
        }
    }
    return {
        modeName: modeData.modeName,
        cell: cell,
        mine: modeData.mineNumber,
        xCellNumber: modeData.xCellNumber,
        yCellNumber: modeData.yCellNumber,
        openGridNumber:0,
        flag: 0,
        gameStatus:'NotStarted',
        gameStart: false,
        gameTime: 0,
        gameResult: 'NotFinished'
    }
}

const getRandomNumber = (max: number, num: number): any[] => {
    const mySet: Set<number> = new Set()
    while (mySet.size !== num) {
        mySet.add(Math.floor(Math.random() * max))
    }
    return Array.from(mySet)
}