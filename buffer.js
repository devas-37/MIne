const COUNT = 50
const BOMBS = Math.floor(COUNT * COUNT * 0.16)
const BOMB_CHAR = "💣"
const CHAR = " "
const FILL_CHAR = String.fromCharCode(9672)
const SIZE = 20
const zoneElement = document.getElementById("zone")
const CELL_STATE = {
    BOMB: "b",
    NUMBER: "n",
    EMPTY: "e",
}

const arounds = [
    { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
    { x: -1, y: 0 }, { x: 1, y: 0 },
    { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
]

let begin = false

document.documentElement.style.setProperty("--size", SIZE + "px")
document.documentElement.style.setProperty("--count", COUNT)
const getId = (cord) => document.getElementById(`${cord.x}|${cord.y}`)

const cells = Array.from({ length: COUNT }).map((_, rowIndex) => Array.from({ length: COUNT }).map((_, cellIndex) => {
    const block = document.createElement("div")
    block.className = "block"
    block.addEventListener("click", () => {
        if (!begin) {
            begin = true
            let buf = {
                [`${rowIndex}|${cellIndex}`]: 1
            }
            arounds.forEach(({ x, y }) => {
                buf[`${rowIndex + x}|${cellIndex + y}`] = 1
            })
            fillBomb(buf)
            fillNumbers()
        }
        openBlock({ x: rowIndex, y: cellIndex })
    })
    return {
        block,
        state: CELL_STATE.EMPTY,
        cord: {
            x: rowIndex,
            y: cellIndex
        },
        number: 0,
        isOpened: false
    }
}))

const getRandomCord = () => {
    return {
        x: Math.floor(Math.random() * COUNT),
        y: Math.floor(Math.random() * COUNT)
    }
}

const renderZone = () => {
    cells.forEach((row) => {
        row.forEach((cell) => {
            zoneElement.appendChild(cell.block)
            // if (cell.state === CELL_STATE.BOMB) cell.block.innerText = BOMB_CHAR
            if (cell.state === CELL_STATE.NUMBER) cell.block.innerText = cell.number
        })
    })
}

const fillBomb = (buffer = {}) => {
    let count = 0;
    const buff = { ...buffer }
    while (count < BOMBS) {
        const cord = getRandomCord()
        if (!(`${cord.x}|${cord.y}` in buff)) {
            buff[`${cord.x}|${cord.y}`] = count
            count += 1
            cells[cord.x][cord.y].state = CELL_STATE.BOMB
            cells[cord.x][cord.y].number = null
        }
    }
    renderZone()
}

const getCuntBombs = ({ x, y }) => {
    let count = 0
    arounds.forEach((cord) => {
        if (cells[cord.x + x]?.[cord.y + y]?.state === CELL_STATE.BOMB) count += 1
    })
    return count
}

const fillNumbers = () => {
    cells.forEach((row) => {
        row.forEach((cell) => {
            if (cell.state === CELL_STATE.EMPTY) {
                const count = getCuntBombs(cell.cord)
                cell.number = count
                cell.state = count ? CELL_STATE.NUMBER : CELL_STATE.EMPTY
            }
        })
    })
}

const openBlock = (cord) => {
    if (cells[cord.x][cord.y].state === CELL_STATE.NUMBER) {
        cells[cord.x][cord.y].block.classList.add("shower")
        cells[cord.x][cord.y].block.innerText = cells[cord.x][cord.y].number
        return
    }
    if (cells[cord.x][cord.y].state === CELL_STATE.BOMB) {
        drawBombs()
        return
    }
    const emptyCells = Object.keys(getEmpty(cord)).map((key) => ({ x: key.split("|")[0], y: key.split("|")[1] }))
    if (emptyCells.length > 0) {
        emptyCells.forEach(({ x, y }) => {
            cells[+x][+y].block.classList.add("shower")
            cells[+x][+y].block.innerText = cells[+x][+y].number || ""
        })
    }
}

const getEmpty = ({ x, y }, buff = {}) => {
    const cell = cells[x]?.[y]
    if (cell != null && cell.state === CELL_STATE.EMPTY && !cell.isOpened) {
        cell.isOpened = true
        buff[`${x}|${y}`] = 1
        arounds.forEach(({ x: x1, y: y1 }) => {
            const cell = cells[x + x1]?.[y + y1]
            if (cell != null && cell.state === CELL_STATE.NUMBER && !cell?.isOpened) {
                buff[`${x + x1}|${y + y1}`] = 1
                cell.isOpened = true
            }
            getEmpty({ x: x + x1, y: y + y1 }, buff)
        })
    }
    return buff
}

const drawBombs = () => {
    cells.forEach((row) => {
        row.forEach((cell) => {
            if (cell.state === CELL_STATE.BOMB) {
                cell.block.innerText = BOMB_CHAR
            }
        })
    })
}
renderZone()