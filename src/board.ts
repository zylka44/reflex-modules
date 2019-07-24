//tworzenie planszy o wymiarach zapisanych w boardDimension
let board = '';

export const makeBoard = dimension => {
    board = '';
    for (let i = 0; i < dimension; i++) {
        let row = '<div class="row">';
        for (let j = 0; j < dimension; j++) {
            let numer = dimension * i + j;
            row += `<div id="sq${numer}" class="square"></div>`;
        };
        row = row + '</div>';
        board += row;
    };
    document.getElementById('board').innerHTML = board;
};