const ROWS = 32;
const COLS = 32;
const BOMBS = Math.floor(ROWS * COLS * 0.2);
const BOMB_CHAR = "💣";
const SIZE = 40;

const zoneElement = document.getElementById("zone");
const FLAG = String.fromCharCode(9873);
const CELL_STATE = {
  BOMB: "b",
  NUMBER: "n",
  EMPTY: "e",
  FLAG: "f",
};
const classes = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "sex",
  "seven",
  "eight",
];
const { BOMB, EMPTY, FLAG: flat, NUMBER } = CELL_STATE;
const arounds = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];

let begin = false;

document.documentElement.style.setProperty("--rows", ROWS);
document.documentElement.style.setProperty("--cols", COLS);
document.documentElement.style.setProperty("--size", SIZE + "px");

const getId = (cord) => document.getElementById(`${cord.x}|${cord.y}`);
zoneElement.oncontextmenu = (e) => e.preventDefault();
console.time();
const cells = Array.from({ length: ROWS }).map((_, rowIndex) =>
  Array.from({ length: COLS }).map((_, cellIndex) => {
    const block = document.createElement("div");
    block.className = "block";
    block.oncontextmenu = () => {
      const cell = cells[rowIndex][cellIndex];
      if (cell.state !== CELL_STATE.FLAG) cell.state = CELL_STATE.FLAG;
    };
    block.addEventListener("click", (e) => {
      console.log(e);
      if (!begin) {
        begin = true;
        const buf = {
          [`${rowIndex}|${cellIndex}`]: 1,
        };
        arounds.forEach(({ x, y }) => {
          buf[`${rowIndex + x}|${cellIndex + y}`] = 1;
        });
        fillBomb(buf);
        fillNumbers();
      }
      openBlock({ x: rowIndex, y: cellIndex });
    });
    return {
      block,
      state: CELL_STATE.EMPTY,
      cord: {
        x: rowIndex,
        y: cellIndex,
      },
      number: 0,
      isOpened: false,
    };
  })
);
console.timeEnd();
const getRandomCord = () => {
  return {
    x: Math.floor(Math.random() * ROWS),
    y: Math.floor(Math.random() * COLS),
  };
};

const renderZone = () => {
  cells.forEach((row) => {
    row.forEach((cell) => {
      zoneElement.appendChild(cell.block);
      if (cell.state === CELL_STATE.NUMBER) {
        cell.block.innerText = cell.number;
        console.log("number ekan");
        cell.block.classList.add("one");
      }
    });
  });
};

const fillBomb = (buffer = {}) => {
  let count = 0;
  const buff = { ...buffer };
  while (count < BOMBS) {
    const cord = getRandomCord();
    if (!(`${cord.x}|${cord.y}` in buff)) {
      buff[`${cord.x}|${cord.y}`] = count;
      count += 1;
      cells[cord.x][cord.y].state = CELL_STATE.BOMB;
      cells[cord.x][cord.y].number = null;
    }
  }
  renderZone();
};

const getCuntBombs = ({ x, y }) => {
  let count = 0;
  arounds.forEach((cord) => {
    if (cells[cord.x + x]?.[cord.y + y]?.state === CELL_STATE.BOMB) count += 1;
  });
  return count;
};

const fillNumbers = () => {
  cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.state === CELL_STATE.EMPTY) {
        const count = getCuntBombs(cell.cord);
        cell.number = count;
        cell.state = count ? CELL_STATE.NUMBER : CELL_STATE.EMPTY;
      }
    });
  });
};

const openBlock = (cord) => {
  showBlock(cord);
  const emptyCells = Object.keys(getEmpty(cord)).map((key) => ({
    x: key.split("|")[0],
    y: key.split("|")[1],
  }));
  if (emptyCells.length > 0) {
    emptyCells.forEach(({ x, y }) => {
      showBlock({ x, y });
    });
  }
};
const showBlock = ({ x, y }) => {
  const cell = cells[x][y];
  switch (cell.state) {
    case CELL_STATE.BOMB: {
      let audio = new Audio("./explosion.wav");
      audio.play();
      cell.block.classList.add("bomb");
      drawBombs();
      break;
    }
    case CELL_STATE.EMPTY:
    case CELL_STATE.NUMBER:
      cells[+x][+y].block.classList.add("shower");
      if (cell.state === CELL_STATE.NUMBER)
        cell.block.classList.add(classes[cell.number - 1]);
      cell.block.innerText = cell.number || "";
      break;
  }
};

const getEmpty = ({ x, y }, buff = {}) => {
  const cell = cells[x]?.[y];
  if (cell != null && cell.state === CELL_STATE.EMPTY && !cell.isOpened) {
    cell.isOpened = true;
    buff[`${x}|${y}`] = 1;
    arounds.forEach(({ x: x1, y: y1 }) => {
      const cell = cells[x + x1]?.[y + y1];
      if (cell != null && cell.state === CELL_STATE.NUMBER && !cell?.isOpened) {
        buff[`${x + x1}|${y + y1}`] = 1;
        cell.isOpened = true;
      }
      getEmpty({ x: x + x1, y: y + y1 }, buff);
    });
  }
  return buff;
};

const drawBombs = () => {
  cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.state === CELL_STATE.BOMB) {
        cell.block.innerText = BOMB_CHAR;
      }
    });
  });
};
renderZone();
