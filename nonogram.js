function activateCell(cell, grid){
    cell.style.background = "gray";
    grid[cell.dataset.row][cell.dataset.col].dataset.state = '1';
    state_grid[cell.dataset.row][cell.dataset.col] = 1;
}


function deactivateCell(cell, grid){
    cell.style.background = "rgb(250, 250, 250)";
    grid[cell.dataset.row][cell.dataset.col].dataset.state = '0';
    state_grid[cell.dataset.row][cell.dataset.col] = 0;
}


function strikeCell(cell, grid){
    cell.style.backgroundImage = "url('images/strikeout.png')"
    grid[cell.dataset.row][cell.dataset.col].dataset.state = '-1';
    state_grid[cell.dataset.row][cell.dataset.col] = -1;
}


function arraySum(a){
    let sum = 0;
    a.forEach(num => {sum += num;})
    return sum;
}


function arraysEqual(a, b){
    if(a === b) return true;
    if(a == null || b == null) return false;
    if(a.length !== b.length) return false;

    for(let i = 0; i < a.length; i++){
        if(a[i] !== b[i]) return false;
    }
    return true;
}


function showSolved(grid){
    for(let i = 0; i < n; i++){
        top_label_element[i].style.opacity = 0.3;
        left_label_element[i].style.opacity = 0.3;

        for(let j = 0; j < n; j++){
            let cell = grid[i][j];

            cell.style.border = "none";
            cell.style.gap = "0px";

            if(cell.dataset.state === '-1'){
                deactivateCell(cell, grid);
            }
            else if(cell.dataset.state === '1'){
                cell.style.background = "green";

            }
        }
    }
}


function isWin(grid, puzzle){
    for (let i = 0; i < n; i++){
        for(let j = 0; j < n; j++){
            if(((parseInt(grid[i][j].dataset.state)) === 0 && puzzle[i][j] === 1) || ((parseInt(grid[i][j].dataset.state)) === 1 && puzzle[i][j] === 0)){
                return false;
            }
        }
    }
    return true;
}


// Determine if current row fits given the hints.
function isRowOK(grid, row){
    let row_active = getRowActive(grid, row);
    return arraysEqual(row_active, left_labels[row]);
}


function isColOK(grid, col){
    let col_active = getColActive(grid, col);
    return arraysEqual(col_active, top_labels[col]);
}


function cellLeftClick(event){
    let cell = event.target;
    if(cell.nodeName == "LABEL") return;
    if(cell.dataset.state == '-1'){
        return;
    }

    if (cell.dataset.state != '1'){
        activateCell(cell, grid);
    }
    else{
        deactivateCell(cell, grid);
    }

    if(checkBoard(document.getElementById("autostrike-checkbox").checked)){
        showSolved(grid);
    }

    else{
        if(isRowOK(state_grid, cell.dataset.row)){
            left_label_element[cell.dataset.row].style.opacity = 0.3;
        }
        else{
            left_label_element[cell.dataset.row].style.opacity = 1;
        }

        if(isColOK(state_grid, cell.dataset.col)){
            top_label_element[cell.dataset.col].style.opacity = 0.3;
        }
        else{
            top_label_element[cell.dataset.col].style.opacity = 1;
        }
    }
}


function cellRightClick(event){
    event.preventDefault();
    let cell = event.target;
    if(cell.nodeName == "LABEL") return;
    if(cell.dataset.state == '1'){
        return;
    }

    if(cell.dataset.state != '-1'){
        strikeCell(cell, grid);
    }
    else{
        deactivateCell(cell, grid);
    }
    
}


function getRowActive(grid, row){
    let row_active = [];
    let active_count = 0;
    for(let j = 0; j < n; j++){
        if(grid[row][j] == 1){
           active_count += 1;
        }
        else{
            if(active_count > 0){
                row_active.push(active_count);
                active_count = 0;
            }
        }
    }

    if(active_count > 0){
        row_active.push(active_count);
    }
    if(row_active.length == 0){
        row_active = [0];
    }

    return row_active;
}


function getColActive(grid, col){
    let col_active = [];
    let active_count = 0;
    for(let i = 0; i < n; i++){
        if(grid[i][col] == 1){
           active_count += 1;
        }
        else{
            if(active_count > 0){
                col_active.push(active_count);
                active_count = 0;
            }
        }
    }

    if(active_count > 0){
        col_active.push(active_count);
    }
    if(col_active.length == 0){
        col_active = [0];
    }
    return col_active;
}


function getLabels(puzzle, asString, label_group){
    let labels = [];
    for(let i = 0; i < n; i++){
        let label = [];
        let active_count = 0;
        for(let j = 0; j < n; j++){
            let cell = (label_group == "left") ? puzzle[i][j] : puzzle [j][i];
            if(cell == 1){
                active_count += 1;
            }
            else{
                if(active_count > 0){
                    label.push(active_count);
                    active_count = 0;
                }
            }
        }
        if(active_count > 0){
            label.push(active_count);
        }
        if(label.length == 0){
            label = [0];
        }
        if(asString){
            labels.push(label.toString().replace(/,/g, (label_group == "left" ? " " : "<br>")));
        }
        else{
            labels.push(label);
        }
        
    }
    return labels;
}


function randomPuzzle(n){
    let puzzle = []
    for(let i = 0; i < n; i++){
        let row = []
        for(let j = 0; j < n; j++){
            let value = Math.random() < 0.70 ? 1 : 0;
            row.push(value)
        }
        puzzle.push(row);
    }
    return puzzle;
}


function print2DGrid(grid){
    let grid_string = "";
    for(let i = 0; i < grid[0].length; i++){
        for(let j = 0; j < grid[1].length; j++){
            grid_string += grid[i][j] + " ";
        }
        grid_string += "\n";
    }
    console.log(grid_string);
}


function checkRowOrCol(row_col, auto_strike){
    let isSolution = true;
    if(isRowOK(state_grid, row_col)){
        left_label_element[row_col].style.opacity = 0.3;
        if(auto_strike){
            strikeRemainingRow(grid, row_col);
        }
    }
    else{
        left_label_element[row_col].style.opacity = 1;
        isSolution = false;
    }

    if(isColOK(state_grid, row_col)){
        top_label_element[row_col].style.opacity = 0.3;
        if(auto_strike){
            strikeRemainingCol(grid, row_col);
        }
    }
    else{
        top_label_element[row_col].style.opacity = 1;
        isSolution = false;
    }

    return isSolution;
}


function checkBoard(auto_strike){
    let isSolution = true;
    for(let i = 0; i < n; i ++){
        if(!checkRowOrCol(i, auto_strike)){
            isSolution = false;
        }
    }

    return isSolution;
}


function strikeRemainingRow(grid, row){
    for(let j = 0; j < n; j++){
        if(state_grid[row][j] == 0){
            strikeCell(grid[row][j], grid);
        }
    }
}


function strikeRemainingCol(grid, col){
    for(let i = 0; i < n; i++){
        if(state_grid[i][col] == 0){
            strikeCell(grid[i][col], grid);
        }
    }
}


async function fillRow(grid, row, active){
    let cell_num = 0;
    for(let i = 0; i < active.length; i++){
        for(let s = 0; s < active[i]; s++){
            activateCell(grid[row][cell_num], grid);
            cell_num += 1;
        }
        if(i < active.length - 1){
            strikeCell(grid[row][cell_num], grid);
            cell_num += 1;
        }
    }
}


function fillCol(grid, col, active){
    let cell_num = 0;
    for(let i = 0; i < active.length; i++){
        for(let s = 0; s < active[i]; s++){
            activateCell(grid[cell_num][col], grid);
            cell_num += 1;
        }
        if(i < active.length - 1){
            strikeCell(grid[cell_num][col], grid);
            cell_num += 1;
        }
        
    }
}


function strikeRow(grid, row){
    for(let j = 0; j < n; j++){
        strikeCell(grid[row][j], grid);
    }
}


function strikeCol(grid, col){
    for(let i = 0; i < n; i++){
        strikeCell(grid[i][col], grid);
    }
}


function fillRowOverlaps(grid, row, labels){
    for(let j = n - 1; j >= n - labels[0]; j--){
        if(j < labels[0]){
            activateCell(grid[row][j], grid);
        }
    }
    return
}


function fillColOverlaps(grid, col, labels){
    for(let i = n - 1; i >= n - labels[0]; i--){
        if(i < labels[0]){
            activateCell(grid[i][col], grid);
        }
    }
    return
}


function algorithmicSolve(){
    for(let i = 0; i < n; i++){
        let left_label_sum = arraySum(left_labels[i]);
        let top_label_sum = arraySum(top_labels[i]);
        
        if(left_label_sum + (left_labels[i].length - 1) == n){
            fillRow(grid, i, left_labels[i]);
        }
        else if(left_label_sum == 0){
            strikeRow(grid, i);
        }
        if(top_label_sum + (top_labels[i].length - 1) == n){
            fillCol(grid, i, top_labels[i]);
        }
        else if(top_label_sum == 0){
            strikeCol(grid, i);
        }

        if(left_labels[i].length == 1 && left_labels[i][0] >= Math.round(n / 2) + 1){
            fillRowOverlaps(grid, i, left_labels[i]);
        }
        if(top_labels[i].length == 1 && top_labels[i][0] >= Math.round(n / 2) + 1){
            fillColOverlaps(grid, i, top_labels[i]);
        }
    }

    if(checkBoard(true)){
        showSolved(grid);
    }
}


function reset(){
    let dim = parseInt(document.getElementById("dim-input").value);
    localStorage.setItem("nono_dimensions", dim);

    let auto_strike = document.getElementById("autostrike-checkbox").checked;
    localStorage.setItem("nono_autostrike", auto_strike);
    location.reload();
}

 
// Initialization
const grid_container = document.getElementById("grid-container");

let n;
if(localStorage.getItem("nono_dimensions")){
    n = localStorage.getItem("nono_dimensions");
    document.getElementById("dim-input").value = n;
}
else{
    n = 5;
}

let auto_strike;
if(localStorage.getItem("nono_autostrike")){
    auto_strike = localStorage.getItem("nono_autostrike");
    document.getElementById("autostrike-checkbox").checked = auto_strike === "true" ? true : false;
}


grid_container.style.gridTemplateColumns = "repeat(" + n + ", 1fr)";
let grid = [];
let puzzle = randomPuzzle(n);

console.log("SOLUTION:");
print2DGrid(puzzle);


// Labels as strings
let top_labels_string = getLabels(puzzle, true, "top");
let left_labels_string = getLabels(puzzle, true, "left");

// Labels as arrays
let top_labels = getLabels(puzzle, false, "top");
let left_labels = getLabels(puzzle, false, "left");


// Generate visual grid and array representation
let state_grid = [];         
for(let i = 0; i < n; i++){
    let row = []
    let state_row = [];
    for(let j = 0; j < n; j++){
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.dataset.state = 0;
        cell.addEventListener("click", cellLeftClick);
        cell.addEventListener("contextmenu", cellRightClick);
        if(i == 0){
            let label = document.createElement("label")
            label.classList.add("top-label");
            label.innerHTML = top_labels_string[j];
            cell.appendChild(label);
        }
        if(j == 0){
            let label = document.createElement("label");
            label.classList.add("left-label");
            label.innerHTML = left_labels_string[i];
            cell.appendChild(label);
        }
        grid_container.appendChild(cell);
        row.push(cell);
        state_row.push(0);
    }
    grid.push(row);
    state_grid.push(state_row);
}


const top_label_element = document.getElementsByClassName("top-label");
const left_label_element = document.getElementsByClassName("left-label");