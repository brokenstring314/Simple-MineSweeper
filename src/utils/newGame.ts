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

export const newGame = (gameModeName: string):Game => {
    let cell: Cell[][] = []
    let modeData = gameModeData[gameModeName]
    let randomMine: any[] = getRandomNumber(modeData.xCellNumber * modeData.yCellNumber, modeData.mineNumber)
    let delta_x = [-1, 0, 1, -1, 0, 1, -1, 1]
    let delta_y = [0, 1, 0, -1, -1, -1, 1, 1]
    for (let i = 0; i < modeData.yCellNumber; i++) {
        cell[i] = []
        for (let j = 0; j < modeData.xCellNumber; j++) {
            cell[i][j] = {
                x: j,
                y: i,
                mine: randomMine.includes(i * modeData.xCellNumber + j),
                open: false,
                number: 0,
                flag: false
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