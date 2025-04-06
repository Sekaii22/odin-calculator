let operators = {
    "+": function(a, b) {return a + b;},
    "-": function(a, b) {return a - b;},
    "*": function(a, b) {return a * b;},
    "/": function(a, b) {return a / b;},
}

function operate(a, op, b) {
    if (op === "/" && b === 0) return "ERROR: divide by 0";
    if (!isFinite(a) || !isFinite(b)) return "ERROR: infinity";
    
    let result = operators[op](a, b);
    
    if (!isFinite(result)) return "ERROR: infinity";
    
    result = result.toFixed(8);       // at most 8 decimal place;
    console.log(result);

    // if (result.length > maxCharLength) {
    //     if (result.includes(".")) {
    //         // remove dp number from back until within max char length
    //         let dpIndex =  result.indexOf(".");
    //         for (let i = result.length - 1; i >= dpIndex; i--) {
    //             result = result.slice(0, -1);

    //             if (result.length <= maxCharLength) break;
    //         }

    //         // if after removal still > max char length
    //         if (result.length > maxCharLength) return "ERROR: too large";

    //         // remove it if last char is "."
    //         if (result.at(-1) === ".") result = result.slice(0, -1);
    //     }
    //     else {
    //         return "ERROR: too large";
    //     }
    // }

    return +result;
}

function clear() {
    display.textContent = "0";
    fullExpression.textContent = "";
    num1 = 0;
    num2 = null;
    op = null;
    error = false;

    num1Display.textContent = num1;
    opDisplay.textContent = String(op);
    num2Display.textContent = String(num2);
}

function numberPress(keyedNum) {
    if (lastProcessed === "=" || error) clear();

    // prepare display for 2nd number
    if (op !== null && num2 === null) {
        display.textContent = "0";
    }

    // check if number length is at max alr
    //if (display.textContent.length >= maxCharLength) return;

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
    if (error) return;
    
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
        
        num1 = result;
        num2 = null;
        
        // check for error
        if (typeof result !== "number") {
            error = true;                    // set error flag
            return;
        };
    }
    
    // at this point, num1 and op have values, num2 is null
    lastProcessed = keyOp;
}

function evalPress() {
    if (error) return;

    // dont allow eval before all numbers and operator has been inputted
    if (num1 !== null && op !== null && num2 !== null) {
        let result = operate(num1, op, num2);
        display.textContent = result;

        fullExpression.textContent += " " + num2 + " =";
        lastProcessed = "=";
    
        // check for error
        if (typeof result !== "number") {
            error = true
            return;
        }

        num1 = result;
        op = null;
        num2 = null;
    }
}

function dpPress() {
    if (lastProcessed === "=" || error) clear();

    // prepare display for 2nd number
    if (op !== null && num2 === null) {
        display.textContent = "0";
        num2 = 0;
    }

    if (!display.textContent.includes(".")) {
        //if (display.textContent.length >= maxCharLength) return;

        display.textContent += ".";
        lastProcessed = ".";
    }
}

function backspacePress() {
    // reset all if last process was an eval
    if (lastProcessed === "=" || error) clear();

    // only allow backspace if working on num1 or num2
    else if (op === null || (op !== null && num2 !== null)) {
        // reset to 0 if only 1 character
        

        display.textContent =  display.textContent.slice(0, -1);
        const tempParsed = parseFloat(display.textContent);

        // "-0." is allowed to skip this
        if (isNaN(tempParsed) || (tempParsed === 0 && display.textContent.at(-1) !== ".")) {
            display.textContent = "0";
        }
    
        // store current value depending if op is set
        if (op === null) {
            num1 = parseFloat(display.textContent);
            console.log(num1);
        }
        else {
            num2 = parseFloat(display.textContent);
            console.log(num1);
        }
    }
    
    lastProcessed = "Backspace";
}

function negatePress() {
    if (error) return;

    // only allow sign negate if working on num1 or num2
    if (op === null || (op !== null && num2 !== null)) {
        
        // store current value depending if op is set
        if (op === null) {
            // only allow positive to negative toggle at max length
            //if ((display.textContent.length >= maxCharLength) && (num1 > 0)) return;
            
            if (lastProcessed === "=") fullExpression.textContent = "";
            num1 *= -1;
            display.textContent = num1;
        }
        else {
            //if ((display.textContent.length >= maxCharLength) && (num2 > 0)) return;

            num2 *= -1;
            display.textContent = num2;
        }
        lastProcessed = "negate";
    }
}

function updateDebugDisplay() {
    num1Display.textContent = num1;
    opDisplay.textContent = String(op);
    num2Display.textContent = String(num2);
}

let display = document.querySelector("#display");
let fullExpression = document.querySelector('#full-expression');
let num1 = 0;
let num2 = null;
let op = null;

let lastProcessed = "";
let error = false;
let isOn = true;
//let maxCharLength = 14;

let debugTexts = document.querySelector(".debug-texts");
let num1Display = document.querySelector("#num1-text");
let opDisplay = document.querySelector("#op-text");
let num2Display = document.querySelector("#num2-text");
num1Display.textContent = num1;
opDisplay.textContent = String(op);
num2Display.textContent = String(num2);

// number btns
document.querySelectorAll(".number")
        .forEach((numBtn) => {
            numBtn.addEventListener("click", () => {
                if (isOn) numberPress(numBtn.textContent);
            });
        });

// operator btns
document.querySelectorAll(".op")
        .forEach((opBtn) => {
            opBtn.addEventListener("click", () => {
                if (isOn) operatorPress(opBtn.textContent);
            });
        });

// eval btn
document.querySelector(".eval").addEventListener("click", () => {
    if (isOn) evalPress();
});

// clear btn
document.querySelector(".clear").addEventListener("click", () => {
    if (isOn) clear();
});

// decimal point btn
document.querySelector(".dp").addEventListener("click", () => {
    if (isOn) dpPress();
});

// back btn
document.querySelector(".back").addEventListener("click", () => {
    if (isOn) backspacePress();
});

// negate sign btn
document.querySelector(".negate").addEventListener("click", () => {
    if (isOn) negatePress();
});

// keyboard support
document.addEventListener("keydown", (e) => {
    if (isOn) {
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
    }
});

// on off btn
document.querySelector(".on").addEventListener("click", () => {
    clear()
    isOn = !isOn;

    if (isOn === true) {
        console.log("ON calculator");
        debugTexts.style.visibility = "visible";
    }
    else {
        console.log("OFF calculator");
        debugTexts.style.visibility = "hidden";
        display.textContent = "";
    }
});

// update debug texts
document.querySelectorAll("button:not(.on)")
        .forEach((btn) => {
            btn.addEventListener("click", updateDebugDisplay);
        });

// BUG: chaining lots of operator or when digits entered is very long, display will stretch
// max is 14 char before display warps
// restrict value keyed to 14 char (DONE)
// when result after removing all decimal numbers are still more than 14 digits, show error: number too large (DONE)

// TODO: Add event for divide by zero error, 
// and for handling, disable all buttons except numbers, clear, and back.