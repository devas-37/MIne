const COUNT = 30
const BOMBS = Math.floor(COUNT * 0.3)
const CHAR = String.fromCharCode(9671)
const FILL_CHAR = String.fromCharCode(9672)

const arr = Array.from({ length: COUNT }).map((_) => Array.from({ length: 30 }).map((_) => CHAR))

const getRandomCord = () => {
    return {
        x: Math.floor(Math.random() * COUNT),
        y: Math.floor(Math.random() * COUNT)
    }
}
const fillBomb = () => {

}


for (let i = 0; i < COUNT; i++) {
    console.log(arr[i].join(" "))
}