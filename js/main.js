'use strict'


const MINE = '💣'
const FLAG = '🚩';
var isFirstClick = true;
var timerInterval;
var time = 0;
var gBoard;
var gLevel = {
    SIZE: 4,
    MAINS: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    live:2,
    flagOnBoard: 0
}



function init() {
    gBoard = createMat(gLevel.SIZE);
    // console.table(gBoard);
    renderBoard();
    gGame.isOn = true;
    gGame.flagOnBoard = gLevel.MAINS;
    // console.log(gLevel.MAINS);
    isFirstClick = true;
    gGame.live = 2;

}

function cellClicked(thi, i, j) {
    if (isFirstClick) {
        console.log(gLevel.MAINS);
        isFirstClick = false;
        setmines(thi, i, j);
        timerInterval = setInterval(timer, 1000);
    }
    if (gBoard[i][j].isShown || !gGame.isOn || gBoard[i][j].isMarked) return;
    var CellContent = '';
    if (gBoard[i][j].isMine) {
        var elBtn = document.querySelector('.reset');
        gGame.shownCount--
        gGame.live--
        if (gGame.live === 0) {
            mineReveal();
            elBtn.innerText = '☠';
            gameOver('');
            return
        }
        elBtn.innerText = '😥';
        CellContent = MINE;
    } else {
        var mineAround = countMineAround(i, j);
        if (mineAround === 0) revealNegs(i, j);
        if (!mineAround) mineAround = '';
        CellContent = mineAround;
    }
    thi.classList.add('shown');
    gGame.shownCount++
    checkGameOvar();
    gBoard[i][j].isShown = true;
    renderCell(thi, CellContent);
}

function checkGameOvar() {
    // console.log('gLevel.SIZE', gLevel.MAINS);
    if ((gLevel.SIZE ** 2) - gLevel.MAINS === gGame.shownCount) {
        gameOver('win');
    }
    var correctFlag = 0;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine) correctFlag++
        }
    }
    if (correctFlag === gLevel.MAINS) gameOver('win');
}



function reset(btn) {
    gGame.secsPassed = 0
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    btn.innerText = '😀';
    
    init();
}

function markcell(elCell, i, j) {
    window.event.preventDefault();
    if (gBoard[i][j].isShown || !gGame.isOn) return;
    var valoue;
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        checkGameOvar();
        gGame.flagOnBoard--
        valoue = FLAG
    } else {
        valoue = '';
        gBoard[i][j].isMarked = false;
    }
    renderCell(elCell, valoue);
    if (gGame.flagOnBoard === 0) checkGameOvar();
}



function countMineAround(rowIdx, colIdx) {
    // if(gBoard[rowIdx][colIdx].isShown||gBoard[rowIdx][colIdx].isMarked)return;
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j]
            if (currCell.isMine) count++
        }
    }
    // if (count === 0) revealNegs(rowIdx, colIdx);
    return count
}

function gameDifficulty(level) {
    var elCell = document.querySelector('.cell')
    if (level === gLevel.SIZE) return;
    if (level === 4) {
        gLevel.SIZE = 4;
        elCell.style.width = '25%';
        elCell.style.height = '25%';
        gLevel.MAINS = 4;
    }
    if (level === 8) {
        gLevel.SIZE = 8;
        elCell.style.width = '12.5';
        elCell.style.height = '12.5';
        gLevel.MAINS = 12;
    }
    if (level === 12) {
        gLevel.SIZE = 12;
        elCell.style.width = '8%';
        elCell.style.height = '8%';
        gLevel.MAINS = 30;
    }
    init();

    // elbtn.style.backgroundColor = 'black';
    // elbtn.style.color = 'white';
}

function mineReveal() {
    console.log(gBoard);
    var elCell = document.querySelectorAll('#mine');
    for (var i = 0; i < gLevel.MAINS; i++) {
        elCell[i].innerText = MINE;
        elCell[i].style.backgroundColor = 'red';
        // gGame.isOn = false;
    }
}

function setmines(lCell, idxRow, idxCol) {
    var cells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (i === idxRow && j === idxCol) continue;
            cells.push({ i: i, j: j });
        }
    }
    var mixCells = shuffle(cells)
    for (var f = 0; f < gLevel.MAINS; f++) {
        var minecell = mixCells[f];
        var x = minecell.i;
        var y = minecell.j;
        gBoard[x][y].isMine = true;
        var elMineCell = document.querySelector(`.i${x}j${y}`);
        elMineCell.id = 'mine';
    }
}

function revealNegs(rowIdx, colIdx) {
    var CellContent = '';
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j]
            if (currCell.isShown || currCell.isMarked) continue;
            var currCellcount = countMineAround(i, j);
            var elCell = document.querySelector(`.i${i}j${j}`);
            if (currCellcount === 0) currCellcount = '';

            console.log('p');

            gGame.shownCount++
            gBoard[i][j].isShown = true;
            elCell.classList.add('shown');
            renderCell(elCell, currCellcount);
        }
    }
}

function gameOver(bollian) {
    var elModal = document.querySelector('.modal');
    if (gGame.isOn) {
        
        gGame.isOn = false;
        var greet = (bollian) ? `victory you clean fiel!d` : 'You lost tap to Try again!';
        clearInterval(timerInterval);
        elModal.style.display = 'bock';
        var elsmodal = elModal.querySelector('.smodal');
        elsmodal.innerText = greet;
    }
    elModal.style.display = 'none'
    reset();
}

function timer() {
    var elTimer = document.querySelector('.timer');
    // var time = 0;
    console.log('time', time);
    elTimer.innerText = time;
    time++
}

// function setmines(lCell, idxRow, idxCol) {

//     for (var i = 0; i < gLevel.MAINS; i++) {
//         var x = getRandomInt(0, gLevel.SIZE - 1);
//         var y = getRandomInt(0, gLevel.SIZE - 1);
//         if (x === idxRow && y === idxRow) continue;
//         gBoard[x][y].isMine = true;
//         var elMineCell = document.querySelector(`.i${x}j${y}`);
//         elMineCell.id = 'mine';
//     }
// }