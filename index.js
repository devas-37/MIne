const COUNT = 30
const BOMBS = Math.floor(COUNT * COUNT * 0.10)
const BOMB_CHAR = String.fromCharCode(9635)
const CHAR = " "
const FILL_CHAR = String.fromCharCode(9672)

const arounds = [
    { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
    { x: -1, y: 0 }, { x: 1, y: 0 },
    { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
]

const arr = Array.from({ length: COUNT }).map((_) => Array.from({ length: COUNT }).map((_) => CHAR))

const getRandomCord = () => {
    return {
        x: Math.floor(Math.random() * COUNT),
        y: Math.floor(Math.random() * COUNT)
    }
}

const displayArea = () => {
    console.log("\n")
    console.log("     ╔" + "═".repeat(COUNT * 2), "\b╗")
    arr.forEach((row) => {
        console.log("     ║", row.join(" ") + "║")
    })
    console.log("     ╚" + "═".repeat(COUNT * 2), "\b╝")
}

const fillBomb = () => {
    let count = 0;
    const buff = {}
    while (count < BOMBS) {
        let cord = getRandomCord()
        if (!(`${cord.x}${cord.y}` in buff)) {
            buff[`${cord.x}${cord.y}`] = count
            count += 1
            arr[cord.y][cord.x] = BOMB_CHAR
        }
    }
}

const getCuntBombs = (x, y) => {
    let count = 0
    arounds.forEach((cord) => {
        if (arr[cord.x + x]?.[cord.y + y] === BOMB_CHAR) count += 1
    })
    return count
}

const fillNumbers = () => {
    for (let i = 0; i < COUNT; i++)
        for (let j = 0; j < COUNT; j++) {
            let counts = getCuntBombs(i, j)
            if (arr[i][j] !== BOMB_CHAR && counts > 0) arr[i][j] = counts
        }
    displayArea()

}

fillBomb()
fillNumbers()
