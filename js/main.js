'use strict'


const MINE = '💣'
const FLAG = '📍';
var isFirst = false;

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
    live: 3,
    flagOnBoard: 0
}



function init() {
    gBoard = createMat(gLevel.SIZE);
    console.table(gBoard);
    renderBoard();
    gGame.isOn = true;
    gGame.flagOnBoard = gBoard.MAINS;
}

function cellClicked(thi, i, j) {
    if (gBoard[i][j].isShown || !gGame.isOn) return;
    var CellContent = '';
    if (gBoard[i][j].isMine) {
        if (gGame.live === 0) {
            GameOver();
            return
        }
        CellContent = MINE;
        gGame.shownCount--
    } else {
        var mineAround = countMineAround(gBoard, i, j);
        if (!mineAround) mineAround = '';
        CellContent = mineAround;
    }
    gGame.shownCount++
    checkGameOvar();
    gBoard[i][j].isShown = true;
    renderCell(thi, CellContent);
    thi.style.backgroundColor = 'gray';
    isFirst = true;
}

function checkGameOvar() {
    console.log('gLevel.SIZE', gLevel.MAINS);
    if ((gLevel.SIZE ** 2) - gLevel.MAINS === gGame.shownCount) {
        console.log('win');
    }
    var correctFlag = 0;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine) correctFlag++
            if (correctFlag === gLevel.MAINS) console.log('win')
        }
    }
}



function reset(btn) {
    gGame.secsPassed = 0
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    isFirst = false
    init();
}

function markcell(elCell, i, j) {
    window.event.preventDefault();
    if (gGame.isShown) return;
    gGame.flagOnBoard--
    renderCell(elCell, FLAG);
    if (gGame.flagOnBoard === 0) checkGameOvar();
}



function countMineAround(mat, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = mat[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
}