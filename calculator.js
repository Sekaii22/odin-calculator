let operators = {
    "+": function(a, b) {return a + b;},
    "-": function(a, b) {return a - b;},
    "*": function(a, b) {return a * b;},
    "/": function(a, b) {return a / b;},
}

function operate(a, op, b) {
    if (op === "/" && b === 0) return "ERROR: divide by 0";
    let result = operators[op](a, b);
    console.log(result);

    return +result.toFixed(8);       // at most 8 decimal place;
}

function clear() {
    display.textContent = "0";
    fullExpression.textContent = "";
    num1 = 0;
    num2 = null;
    op = null;
}

function numberPress(keyedNum) {
    if (lastProcessed === "=") clear();

    // prepare display for 2nd number
    if (op !== null && num2 === null) {
        display.textContent = "0";
    }

    // append to display
    display.textContent = (display.textContent === "0") ? keyedNum : display.textContent + keyedNum;
    
    // store current value depending if op is set
    if (op === null) {
        num1 = parseFloat(display.textContent);
    }
    else {
        num2 = parseFloat(display.textContent);
    }

    lastProcessed = keyedNum
}

function operatorPress(keyOp) {
    if (num1 !== null) {

        // if no current op or if consecutive op btn is pressed, set to last entered
        if (op === null || (op !== null && num2 === null)) {
            op = keyOp;
            fullExpression.textContent = num1 + " " + op;
        }

        // num1, op, num2 already have values when op btn is pressed,
        // evaluate the result first, before assigning the next op
        else {
            let result = operate(num1, op, num2);
            display.textContent = result;
            op = keyOp;  
            fullExpression.textContent += " " + num2 + " " + op;
            
            // check for error
            if (typeof result !== "number") {
                num1 = null;                     // stop any further operators or eval
                lastProcessed = "=";             // set clear flag
                return;
            };
            
            num1 = result;
            num2 = null;
        }
        
        // at this point, num1 and op have values, num2 is null
        lastProcessed = keyOp;
    }
}

function evalPress() {
    // dont allow eval before all numbers and operator has been inputted
    if (num1 !== null && op !== null && num2 !== null) {
        let result = operate(num1, op, num2);
        display.textContent = result;

        fullExpression.textContent += " " + num2 + " =";
        lastProcessed = "=";
    
        // check for error
        if (typeof result !== "number") {
            num1 = null;                          // stop further calculations
            return;
        }

        num1 = result;
        op = null;
        num2 = null;
    }
}

function dpPress() {
    if (lastProcessed === "=") clear();

    // prepare display for 2nd number
    if (op !== null && num2 === null) {
        display.textContent = "0";
        num2 = 0;
    }

    if (!display.textContent.includes(".")) {
        display.textContent += ".";
        lastProcessed = ".";
    }
}

function backspacePress() {
    // reset all if last process was an eval
    if (lastProcessed === "=") clear();

    // only allow backspace if working on num1 or num2
    else if (op === null || (op !== null && num2 !== null)) {
        // reset to 0 if only 1 digit
        if (display.textContent.length <= 1) {
            display.textContent = "0";
        }
        else {
            display.textContent =  display.textContent.slice(0, -1);
        }
    
        // store current value depending if op is set
        if (op === null) {
            num1 = parseFloat(display.textContent);
        }
        else {
            num2 = parseFloat(display.textContent);
        }
    }
    
    lastProcessed = "Backspace";
}

let display = document.querySelector("#display");
let fullExpression = document.querySelector('#full-expression');
let num1 = 0;
let num2 = null;
let op = null;
let lastProcessed = "";

// number btns
document.querySelectorAll(".number")
        .forEach((numBtn) => {
            numBtn.addEventListener("click", () => {
                numberPress(numBtn.textContent);
            });
        });

// operator btns
document.querySelectorAll(".op")
        .forEach((opBtn) => {
            opBtn.addEventListener("click", () => {
                operatorPress(opBtn.textContent);
            });
        });

// eval btn
document.querySelector(".eval").addEventListener("click", evalPress);

// clear btn
document.querySelector(".clear").addEventListener("click", clear);

// decimal point btn
document.querySelector(".dp").addEventListener("click", dpPress);

// back btn
document.querySelector(".back").addEventListener("click", backspacePress);

// keyboard support
document.addEventListener("keydown", (e) => {
    let keyPressed = e.key;
    console.log(keyPressed);

    if (isNaN(keyPressed) === false) {
        // number key pressed
        numberPress(keyPressed);
    }
    else if (Object.keys(operators).includes(keyPressed)) {
        // operator key pressed
        operatorPress(keyPressed);
    }
    else if (keyPressed === "=") {
        // eval
        evalPress();
    }
    else if (keyPressed === "Escape") {
        // clear
        clear();
    }
    else if (keyPressed === ".") {
        //decimal point pressed
        dpPress();
    }
    else if (keyPressed === "Backspace") {
        backspacePress();
    }
});

// WORKING: Add negative toggle -/+ 

// TODO: Add event for divide by zero error, 
// and for handling, disable all buttons except numbers, clear, and back.