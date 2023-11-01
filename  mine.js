
const CELL_STATE = {
    Empty: "e",
    Bomb: "b",
    Flag: "f",
    Marker: "m",
}

class Cell {
    cord = { x: 0, y: 0 }
    state = "EMPTY"
    element = null
    constructor(x, y, cb) {
        this.cord = { x, y }
        const div = document.createElement("div")
        div.className = "block"
        div.addEventListener("click", (e) => cb({ x, y }))
    }

}