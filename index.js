const COUNT = 16
const BOMBS = Math.floor(COUNT * COUNT * 0.16)
const BOMB_CHAR = "💣"
const CHAR = " "
const FILL_CHAR = String.fromCharCode(9672)
const SIZE = 76
const zoneElement = document.getElementById("zone")

const arounds = [
    { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
    { x: -1, y: 0 }, { x: 1, y: 0 },
    { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
]

let begin = false

document.documentElement.style.setProperty("--size", SIZE + "px")
document.documentElement.style.setProperty("--count", COUNT)
const getId = (cord) => document.getElementById(`${cord.x}|${cord.y}`)

const arr = Array.from({ length: COUNT }).map((_) => Array.from({ length: COUNT }).map((_) => CHAR))

const getRandomCord = () => {
    return {
        x: Math.floor(Math.random() * COUNT),
        y: Math.floor(Math.random() * COUNT)
    }
}

const renderZone = () => {
    for (let i = 0; i < COUNT; i++) {
        for (let j = 0; j < COUNT; j++) {
            let block = document.createElement("div")
            block.className = "block"
            block.id = `${i}|${j}`
            block.innerText = arr[i][j]
            block.addEventListener('click', () => {
                if (!begin) {
                    begin = true
                    const buf = {}
                    arounds.forEach((cord) => {
                        buf[`${cord.x}|${cord.y}`] = 1
                    })
                    fillBomb(buf)
                    fillNumbers()
                }
                openBlock({ x: i, y: j })
            })
            zoneElement.appendChild(block)
        }
    }
}

const fillBomb = (buffer = {}) => {
    let count = 0;
    const buff = buffer
    while (count < BOMBS) {
        let cord = getRandomCord()
        if (!(`${cord.x}|${cord.y}` in buff)) {
            buff[`${cord.x}|${cord.y}`] = count
            count += 1
            arr[cord.x][cord.y] = BOMB_CHAR
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
}

const openBlock = (cord) => {
    const emptyCells = Object.keys(getEmpty(cord)).map((key) => ({ x: key.split("|")[0], y: key.split("|")[1] }))
    console.log(emptyCells)
    let hi = 0
    if (emptyCells.length > 0) {
        let timer = setInterval(() => {
            if (hi === emptyCells.length - 1) clearInterval(timer)
            getId(emptyCells[hi]).classList.add("shower")
            hi += 1
        }, 10)
    }
}

const getEmpty = (cord, buff = {}) => {
    const { x, y } = cord
    if (arr[x]?.[y] === CHAR) {
        arr[x][y] = "*"
        buff[`${x}|${y}`] = 1
        arounds.forEach(({ x: x1, y: y1 }) => {
            const cord = { x: x + x1, y: y + y1 }
            if (/\b\d\b/.test(arr[cord.x]?.[cord.y])) {
                arr[cord.x][cord.y] = `a${arr[cord.x][cord.y]}`
                buff[`${cord.x}|${cord.y}`] = 1
            }
            getEmpty(cord, buff)
        })
    }
    return buff
}

renderZone()