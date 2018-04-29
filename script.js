
// DECLARATION OF GLOBAL VARIABLES
let processes = [];
let holes = [];
let processCounter = 0;
let holeCounter = 0;
const ratio = 1.75;

initSelectMethod();


// Get Select Box
var select = document.getElementById('method');
// select.addEventListener('change', function (e) {
//     // TODO: Draw Function
//     draw();
// });


let memoryCanvas = document.getElementById('memoryCanvas');
let ctx = memoryCanvas.getContext("2d");



function sortArrayBy(prop) {
    return function (a, b) {
        return Number(a[prop]) > Number(b[prop]);
    }
}


function drawRect(type, from, size, processName) {

    // ctx.fillRect(0, Math.floor(from / ratio), memoryCanvas.width, Math.floor(size / ratio));
    // drawBorder(from,size);


    // Another Method For Drawing
    ctx.beginPath();
    ctx.rect(0, Math.floor(from / ratio), memoryCanvas.width, Math.floor(size / ratio));
    if (type === 'process') {
        ctx.fillStyle = "rgb(42,204,113)";
    } else {
        ctx.fillStyle = "rgb(231,70,69)";
    }
    ctx.strokeStyle = "#333";
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    if (type === 'process') {
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#222";
        let center =  (((Math.floor(from / ratio) + Math.floor(size / ratio))  - Math.floor(from / ratio)) / 2) + Math.floor(from / ratio);
        ctx.fillText(processName, memoryCanvas.width / 2, center);
    }


}

function drawBorder(from, size) {
    let rectangle = new Path2D();
    rectangle.rect(0, Math.floor(from / ratio), memoryCanvas.width, Math.floor(size / ratio));
    ctx.stroke(rectangle);
}





function clearTables() {
    let processesTable = document.getElementById('processes__table');
    let holesTable = document.getElementById('holes__table');
    let processName = document.getElementById("processName");
    let processSize = document.getElementById("processSize");
    let holeSize = document.getElementById("holeSize");
    let holeStart = document.getElementById("holeStart");
    processesTable.innerHTML = '';
    holesTable.innerHTML = '';
    processName.value = '';
    processSize.value = '';
    holeSize.value = '';
    holeStart.value = '';
    processCounter = 0;
    holeCounter = 0;

}
function clearMemory() {
    processes = [];
    holes = [];
    // TODO: Complete Empty the Inputs
    clearTables();
    clearCanvas();
}


function clearCanvas() {
    ctx.clearRect(0, 0, memoryCanvas.width, memoryCanvas.height);
}


function initSelectMethod() {
    var select = document.getElementById('method');
    var methods = [
        { value: "FF", name: "First Fit" },
        { value: "BF", name: "Best Fit" },
        { value: "WF", name: "Worst Fit" },
    ];
    let methodOption = '';
    for (let method of methods) {
        methodOption += `<option value='${method['value']}'>${method['name']}</options>`;
    }
    select.innerHTML += methodOption;
    select.value = methods[0].value;
}

function draw(process) {

    if (select.value === 'FF') {
        // TODO: First Fit Algorithm
        FirstFit(process);
    } else if (select.value === 'BF') {
        // TODO: Best Fit Algorithm
        BestFit(process);
    } else if (select.value === 'WF') {
        // TODO: Worst Fit Algorithm
        WorstFit(process);
    }


}


/*
    [ Function Name ] : FirstFit()
    [ Functionality ] : Add Process To Hole By First Fit Algorithm
    [ Used Fucntions ] : JavaScript DOM Elemenets ==> Catch By ID  
*/

function FirstFit(process) {

    let fit = false;
    let ProcessFrom;
    for (let i = 0; i < holes.length; i++) {
        let memorySize = holes[i].size;
        let memoryFrom = holes[i].start;
        if (process.mem <= memorySize) {
            fit = true;
            // Insert process
            ProcessFrom = holes[i].start;
            process.from = ProcessFrom;
            process.to = ProcessFrom + process.mem;

            processes.push(process);
            processCounter++;
            drawRect('process', process.from, process.mem, process.name);
            printNewitem('processes', processes);
            // Update Memory
            memorySize -= process.mem;
            memoryFrom += process.mem;
            holes[i].size = memorySize;
            holes[i].start = memoryFrom;

            if (holes[i].size === 0) {
                holes.splice(i, 1);
                holeCounter--;
                printAllItems('holes', holes);
            }

            break;
        }
    }
    printAllItems('holes', holes);
    if (fit == false) {
        alert("No Suitable Hole");
    }

}

/*
    [ Function Name ] : BestFit()
    [ Functionality ] : Add Process To Hole By Best Fit Algorithm
    [ Used Fucntions ] : JavaScript DOM Elemenets ==> Catch By ID  
*/

function BestFit(process) {
    let ProcessFrom;
    let myBest = -1;
    let diff = 1000000;
    for (let i = 0; i < holes.size; i++) {
        // get BestFit
        let memorySize = holes[i].size;
        if ((memorySize - process.mem) >= 0 && (memorySize - process.mem) < diff) {
            diff = memorySize - process.mem;
            myBest = i;
        }
    }
    if (myBest == -1) {
        alert("No Suitable Hole");
    }
    // Insert Process
    else {
        // Inset Process
        let memoryFrom, memorySize;
        ProcessFrom = holes[myBest].start;
        process.from = ProcessFrom;
        process.to = ProcessFrom + process.mem;
        processes.push(process);
        drawRect('process', process.from, process.mem, process.name);
        processCounter++;
        printNewitem('processes', processes);
        // Update Memory
        memorySize -= process.mem;
        memoryFrom += process.mem;
        holes[myBest].size = memorySize;
        holes[myBest].start = memoryFrom;


        if (holes[myBest].size === 0) {
            holes.splice(myBest, 1);
            holeCounter--;
            printAllItems('holes', holes);
        }

        printAllItems('holes', holes);
    }

}


/*
    [ Function Name ] : WorstFit()
    [ Functionality ] : Add Process To Hole By Worst Fit Algorithm
    [ Used Fucntions ] : JavaScript DOM Elemenets ==> Catch By ID  
*/

function WorstFit(process) {
    let myWorst = -1;
    let diff = 0;
    let ProcessFrom;
    for (let i = 0; i < holes.length; i++) {
        // get WorstFit
        let memorySize;
        memorySize = holes[i].size;
        if ((memorySize - process.mem) >= 0 && (memorySize - process.mem) > diff) {
            diff = memorySize - process.mem;
            myWorst = i;
        }
    }
    if (myWorst == -1) {
        alert("No Suitable Hole");
    }
    // Insert Process
    else {
        ProcessFrom = holes[myWorst].start;
        process.from = ProcessFrom;
        process.to = ProcessFrom + process.mem;

        processes.push(process);
        drawRect('process', process.from, process.mem, process.name);
        processCounter++;
        printNewitem('processes', processes);

        // Update Memory
        let memorySize = holes[myWorst].size;
        let memoryTo = holes[myWorst].end;
        memorySize -= process.mem;
        memoryTo -= process.mem;
        holes[i].size = memorySize;
        holes[i].end = memoryTo;
        if (holes[myWorst].size === 0) {
            dataGridView_Memory.Rows.RemoveAt(myWorst);
        }
        if (holes[myWorst].size === 0) {
            holes.splice(myWorst, 1);
            holeCounter--;
            printAllItems('holes', holes);
        }
        printAllItems('holes', holes);
    }

}



/*
    [ Function Name ] : printAllItems()
    [ Functionality ] : Print All Items In Table
    [ Used Fucntions ] : JavaScript DOM Elemenets ==> Catch By ID  
*/
function printAllItems(type, items) {
    let itemsTBody = document.getElementById(type + "__table");
    itemsTBody.innerHTML = '';
    for (let i = 0; i < items.length; i++) {
        let itemsHtml;
        if (type === 'processes') {
            itemsHtml = `<tr ondblclick="removeProcess(${i})">`;
        } else {
            itemsHtml = '<tr>';
        }
        let item = items[i];
        for (key in item) {
            if (key !== 'mem') {
                itemsHtml += `<td>${item[key]}</td>`
            }
        }
        itemsHtml += '</tr>';
        itemsTBody.innerHTML += itemsHtml;
    }
}



/*
    [ Function Name ] : printNewItem()
    [ Functionality ] : Print New Item In Table
    [ Used Fucntions ] : JavaScript DOM Elemenets ==> Catch By ID  
*/


function printNewitem(type, items) {
    let itemsTBody = document.getElementById(type + "__table");
    let itemsHtml = '';
    let counter = type === 'processes' ? processCounter : holeCounter;
    for (let i = counter - 1; i < items.length; i++) {
        if (type === 'processes') {
            itemsHtml = `<tr ondblclick="removeProcess(${i})">`;
        } else {
            itemsHtml = '<tr>';
        }
        let item = items[i];
        for (key in item) {
            if (key !== 'mem') {
                itemsHtml += `<td>${item[key]}</td>`

            }
        }
        itemsHtml += '</tr>';
        itemsTBody.innerHTML += itemsHtml;
    }
}






/*
    [ Function Name ] : addHole()
    [ Functionality ] : Add Hole By the Inputs From User
    [ Used Fucntions ] : JavaScript DOM Elemenets ==> Catch By ID  
*/
function addHole(holeParam) {
    if (holeParam) {
        let holeSize = holeParam.mem;
        let holeStart = holeParam.from;
        let holeEnd = holeParam.to;
        let hole = {
            size: Number(holeSize),
            start: Number(holeStart),
            end: Number(holeEnd)
        };
        holes.unshift(hole);
        drawRect('hole', hole.start, hole.size);
        holeCounter++;
        holes.sort(sortArrayBy('start'))
        printAllItems('holes', holes);

    } else {
        let holeSize = document.getElementById("holeSize");
        let holeStart = document.getElementById("holeStart");
        let holeEnd = Number(holeSize.value) + Number(holeStart.value);
        let hole = {
            size: Number(holeSize.value),
            start: Number(holeStart.value),
            end: Number(holeEnd)
        };
        holes.unshift(hole);
        drawRect('hole', hole.start, hole.size);
        holeCounter++;
        holes.sort(sortArrayBy('start'))
        printAllItems('holes', holes);

    }


}


/*
[ Function Name ] : addProcess()
[ Functionality ] : Add Processe By the Inputs From User
[ Used Fucntions ] : JavaScript DOM Elemenets ==> Catch By ID  
*/
function addProcess() {
    let processName = document.getElementById("processName");
    let processSize = document.getElementById("processSize");
    let process = {
        name: processName.value.toLowerCase(),
        mem: Number(processSize.value)
    };
    draw(process);
}




/*
[ Function Name ] : removeProcess()
[ Functionality ] : Remove Processe By the Inputs From User
[ Used Fucntions ] : JavaScript DOM Elemenets ==> Catch By ID  
*/
function removeProcess(i) {
    let process = processes[i];
    processes.splice(i, 1);
    processCounter--;
    addHole(process);
    printAllItems('processes', processes);
}