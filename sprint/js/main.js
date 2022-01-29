'use strict'


const MINE = '💣'
const FLAG = '🚩';
var isFirstClick = true;
var timerInterval;
var hints = 3;
var isHints = false;
var gBoard;
var gLevel = {
    SIZE: 4,
    MAINS: 4
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    live: 2,
    flagOnBoard: 0
}

function init() {
    gBoard = createMat(gLevel.SIZE);
    // console.table(gBoard);
    renderBoard();
    gGame.isOn = true;
    gGame.flagOnBoard = gLevel.MAINS;
    isFirstClick = true;
    gGame.secsPassed = 0;
    gGame.live = 2;
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = gGame.secsPassed;
    var elLive = document.querySelector('.live')
    elLive.innerText = gGame.live
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
    var elFlag = document.querySelector('.flag');
    elFlag.innerText = gGame.flagOnBoard;
    hints = 3;
    var elBtn = document.querySelector('.hint');
    elBtn.innerText = `hint (${hints})`;
    elBtn.style.backgroundColor = 'rgb(240, 240, 240)';
}

function cellClicked(thi, i, j) {

    if (isFirstClick) {
        setmines(thi, i, j);
        isFirstClick = false;
        timerInterval = setInterval(timer, 1000);
        getAllCell();
    }
    if (isHints) {
        revealHint(i, j);
        setTimeout(function () {
            isHints = false;
            hints--
            revealHint(i, j);
        }, 1000)
        return;
    }
    if (gBoard[i][j].isShown || !gGame.isOn || gBoard[i][j].isMarked) return;
    var CellContent = '';
    if (gBoard[i][j].isMine) {
        var elBtn = document.querySelector('.reset');
        // gBoard[i][j].isMarked = true;
        gGame.flagOnBoard--
        gGame.shownCount--
        gGame.live--
        var elLive = document.querySelector('.live')
        elLive.innerText = gGame.live
        if (gGame.live === 0) {
            mineReveal();
            elBtn.innerText = '☠';
            gameOver('');
            return
        }
        elBtn.innerText = '😥';
        CellContent = MINE;
        renderCell(thi, CellContent);
    } else {
        if (gBoard[i][j].minesAroundCount === 0) revealNegs(i, j);
        CellContent = (gBoard[i][j].minesAroundCount !== 0) ? gBoard[i][j].minesAroundCount : '';
        renderCell(thi, CellContent);
    }
    thi.classList.add('shown');
    gGame.shownCount++
    checkGameOvar();
    gBoard[i][j].isShown = true;
    // renderCell(thi, CellContent);
    console.log('gGame.shownCount', gGame.shownCount);
}

function checkGameOvar() {
    var correctFlag = 0;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {

            if (gBoard[i][j].isMarked && gBoard[i][j].isMine || gBoard[i][j].isMine && gBoard[i][j].isShown) correctFlag++
            if (gBoard[i][j].isMarked && !gBoard[i][j].isMine) return;
        }
    }
    if (correctFlag === gLevel.MAINS) {
        gameOver('win');
        var elBtn = document.querySelector('.reset');
        elBtn.innerText = '😍';
        console.log('win flag');
    }
}

function reset(btn) {


    gGame.secsPassed = 0
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    btn.innerText = '😀';
    clearInterval(timerInterval);
    // gGame.live = 3;
    init();
}

function markcell(elCell, i, j) {
    window.event.preventDefault();
    var elFlag = document.querySelector('.flag');
    if (gBoard[i][j].isShown || !gGame.isOn) return;
    var valoue;
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        checkGameOvar();
        gGame.flagOnBoard--
        valoue = FLAG
        elFlag.innerText = gGame.flagOnBoard;
    } else {
        gGame.flagOnBoard++
        elFlag.innerText = gGame.flagOnBoard;
        valoue = '';
        gBoard[i][j].isMarked = false;
    }
    renderCell(elCell, valoue);
    if (gGame.flagOnBoard === 0) checkGameOvar();
}

function getAllCell() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) continue;
            countMineAround(i, j);
        }
    }
}

function countMineAround(rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j]
            if (currCell.isMine) count++
            gBoard[rowIdx][colIdx].minesAroundCount = count;
        }
    }
    gBoard.minesAroundCount = count;

    // return count
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
        elCell.style.width = '12.5%';
        elCell.style.height = '12.5%';
        gLevel.MAINS = 12;
    }
    if (level === 12) {
        gLevel.SIZE = 12;
        elCell.style.width = '8%';
        elCell.style.height = '8%';
        gLevel.MAINS = 30;

    }
    init();
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
            // var currCellcount = countMineAround(i, j);
            var currCellcount = gBoard[i][j].minesAroundCount;
            var elCell = document.querySelector(`.i${i}j${j}`);
            gBoard[i][j].minesAroundCount = currCellcount
            if (currCellcount === 0) {
                currCellcount = '';
            }


            gGame.shownCount++
            gBoard[i][j].isShown = true;
            elCell.classList.add('shown');
            renderCell(elCell, currCellcount);
            if (gBoard[i][j].minesAroundCount === 0) revealNegs(i, j);
        }
    }
}

function gameOver(bollian) {
    if (gGame.isOn) {
        gGame.isOn = false;
        clearInterval(timerInterval);
        var elModal = document.querySelector('.modal');
        elModal.style.display = 'block';
    }
    var elSmodal = document.querySelector('.smodal');
    var msg = (bollian) ? `VICTORY you clean up the field` : `You blew up yourself<br/>try again`
    elSmodal.innerHTML = msg;
    // var msg = (bollian) ? `VICTORY you clean up the field` : `You blew up yourself  ${<br/>}  try`
    // elSmodal.innerText = msg;


}

function timer() {
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = gGame.secsPassed;
    gGame.secsPassed++
}

function hint(elBtn) {
    if (hints === 0) return;
    if (!isHints) {
        elBtn.style.backgroundColor = 'red';
        isHints = true;
    } else {
        elBtn.style.backgroundColor = 'rgb(240, 240, 240)';
        isHints = false;
    }
}

function revealHint(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            var currCell = gBoard[i][j]
            if (currCell.isShown || currCell.isMarked) continue;
            // var currCellcount = countMineAround(i, j);
            var currCellcount = gBoard[i][j].minesAroundCount;
            var elCell = document.querySelector(`.i${i}j${j}`);
            gBoard[i][j].minesAroundCount = currCellcount
            if (currCell.isMine) currCellcount = MINE;
            if (isHints) {
                // elCell.style.backgroundColor = 'blue';
                elCell.classList.add('hint');
                renderCell(elCell, currCellcount);
            } else {
                elCell.classList.remove('hint');
                // elCell.style.backgroundColor = 'lightslategray';
                currCellcount = ''
                renderCell(elCell, currCellcount);
                var elBtn = document.querySelector('.hint');
                elBtn.innerText = `hint (${hints})`;
                elBtn.style.backgroundColor = 'rgb(240, 240, 240)';
            }


        }
    }
}






// function countMineAround(rowIdx, colIdx) {
//     // if(gBoard[rowIdx][colIdx].isShown||gBoard[rowIdx][colIdx].isMarked)return;
//     var count = 0;
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i > gBoard.length - 1) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j > gBoard[0].length - 1) continue
//             if (i === rowIdx && j === colIdx||gBoard[i][j].isShown||gBoard[i][j].isMarked) continue
//             var currCell = gBoard[i][j]
//             if (currCell.isMine) count++
//             gBoard[i][j].minesAroundCount = count;
//         }
//     }
//     return count
// }