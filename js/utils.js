function createMat(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    board[2][3].isMine = true;
    board[1][2].isMine = true;
    return board;
}

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = gBoard[i][j];
            var className = (!gBoard[i][j].isShown)?'shown':'unShown';
            strHTML += `\t<td class="cell ${className}" 
                            onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="markcell(this, event, ${i}, ${j})">
                        </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)
    // console.log(gLevel.size)

    var elSeats = document.querySelector('tbody');
    elSeats.innerHTML = strHTML;
}

function renderCell(elCell, value) {
    elCell.innerHTML = value
}


// function renderBoard() {
//     var strHTML = '';
//     for (var i = 0; i < gLevel.SIZE; i++) {
//         strHTML += `<tr>\n`
//         for (var j = 0; j < gLevel.SIZE; j++) {
//             var cell = gBoard[i][j];

//             var className = '';
//             className = (cell.isShown) ? 'shown' : 'unshown';
//             strHTML += `\t<td class="cell ${className}" onclick="cellClicked(this,${i},${j})">
//                             </td>\n`
//         }
//         strHTML += `</tr>\n`
//     }
//     // console.log(strHTML)

//     var elcells = document.querySelector('tbody');
//     elcells.innerHTML = strHTML;
// }



/* <td class="cell ${className}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="markCell(this, ${i},${j})"></td> */