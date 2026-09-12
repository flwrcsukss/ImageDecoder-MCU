xInput = document.querySelector(".table-width");
yInput = document.querySelector(".table-height");

paintArea = document.querySelector(".table-paint > table");

consoleArea = document.querySelector("textarea");
consoleExecuteButton = document.querySelector(".execute-button");

xInput.addEventListener("change", paintingTable);
yInput.addEventListener("change", paintingTable);
consoleExecuteButton.addEventListener("click", walkingOnDaString);

console.log(tftToRgb("0x0000"))

function paintingTable() {
    // console.log("input");
    // while (paintArea.firstChild) {
    //     paintArea.removeChild(paintArea.firstChild);
    // }

    paintArea.innerHTML = "";

    for (let y = 0; y < yInput.value; y += 1) {
        trY = document.createElement("tr");
        trY.setAttribute("class", `tr${y}`);
        paintArea.appendChild(trY);

        for (let x = 0; x < xInput.value; x += 1) {
            trX = document.createElement("td");
            trX.setAttribute("class", `td${x}`);
            paintArea.querySelector(`.tr${y}`).appendChild(trX);
        }
    }
}


function tftToRgb(hex) {
    // Убираем префикс 0x если есть
    const value = typeof hex === 'string' ? parseInt(hex, 16) : hex;

    const r5 = (value >> 11) & 0x1F;
    const g6 = (value >> 5) & 0x3F;
    const b5 = value & 0x1F;

    const r = Math.round((r5 / 31) * 255);
    const g = Math.round((g6 / 63) * 255);
    const b = Math.round((b5 / 31) * 255);

    return [r, g, b];
}

function walkingOnDaString() {
    let numOfStr = 1;
    let commands = consoleArea.value.split("\n");

    let startOfPar = 0;
    let endOfPar = 0;

    let numOfChar = 0;

    startOfPar = commands[0].indexOf("(");
    endOfPar = commands[0].indexOf(")");


    commands.forEach(element => {
        // let str = element.indexOf("{x}");
        let str = element.slice(startOfPar + 1, -1);
        str = str.split(", ")
        // let = [];
        let i = 0;
        console.log(str);

        try {
            let trtd = document.querySelector(`.tr${+str[1]} > .td${+str[0]}`);
            let color = tftToRgb(str[2]);
            console.log(color);
            console.log(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
            trtd.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        }
        catch (error) {
            console.log("пофек");
        }



        // (`background-color`, `rgb(${color[0]}, ${color[1]}, ${color[2]})`);

        // console.log(element.slice(startOfPar+1));
        // while (element[i].match("\d")) {

        // }
        // if (str == -1) {
        //     console.log(`Not enough parameters`);
        // }
        // else {
        //     console.log(element[startOfPar, endOfPar]);
        // }



        numOfStr += 1;
    });
}