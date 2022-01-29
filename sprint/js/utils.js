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
    return board;
}

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = gBoard[i][j];
            // var id = (gBoard[i][j].isMine) ? 'mine' : '';
            var calssName = `i${i}j${j}`;
            strHTML += `\t<td class="cell ${calssName}"  
                            onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="markcell(this, ${i}, ${j})">  
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
    elCell.innerText = value
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(items) {
    var randIdx, keep
    for (var i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);

        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}

