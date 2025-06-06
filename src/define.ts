interface ModeData {
    mineNumber: number,
    xCellNumber: number,
    yCellNumber: number,
    modeName: string
}

interface Game {
    modeName: string,
    cell: Cell[][],
    mine: number,
    flag: number,
    openGridNumber: number,
    xCellNumber: number,
    yCellNumber: number,
    gameStatus: 'NotStarted' | 'InProgress' | 'Finished',
    gameStart: boolean,
    gameTime: number,
    gameResult: 'Victory' | 'Failed' | 'NotFinished',

    [key: string]: any
}

interface Cell {
    x: number,
    y: number,
    mine: boolean,
    open: boolean,
    number: number,
    flag: boolean,
    wrongFlag?: boolean
}

interface GameTimer {
    timer:any
    startTimer:any
    stopTimer:any
}
