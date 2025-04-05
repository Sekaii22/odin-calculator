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
                if (lastProcessed === "=") clear();

                // prepare display for 2nd number
                if (op !== null && num2 === null) {
                    display.textContent = "";
                }

                // append to display
                display.textContent = (display.textContent === "0") ? numBtn.textContent : display.textContent + numBtn.textContent;
                lastProcessed = numBtn.textContent
                
                // store current value depending if op is set
                if (op === null) {
                    num1 = parseFloat(display.textContent);
                }
                else {
                    num2 = parseFloat(display.textContent);
                }
            });
        });

// operator btns
document.querySelectorAll(".op")
        .forEach((opBtn) => {
            opBtn.addEventListener("click", () => {
                if (num1 !== null) {
                    if (op === null || (op !== null && num2 === null)) {
                        // if no op or if consecutive op btn is pressed, set to last op entered
                        op = opBtn.textContent;
                        fullExpression.textContent = num1 + " " + op;
                    }
                    else {
                        // if num1, op, num2 already have values when op btn is pressed,
                        // evaluate the result first, before assigning the next op
                        let result = operate(num1, op, num2);
                        display.textContent = result;
                        op = opBtn.textContent;  
                        fullExpression.textContent += " " + num2 + " " + op;
                        
                        // check for error
                        if (typeof result !== "number") {
                            num1 = null;                     // set num1 to null to stop any further operators or eval
                            lastProcessed = "=";
                            return;
                        };
                        
                        num1 = result;
                        num2 = null;
                    }
    
                    lastProcessed = opBtn.textContent;
                }
            });
        });

// eval btn
document.querySelector(".eval").addEventListener("click", (e) => {
    // dont allow eval before all numbers and operator has been inputted
    if (num1 !== null && op !== null && num2 !== null) {
        let result = operate(num1, op, num2);
        display.textContent = result;

        fullExpression.textContent += " " + num2 + " =";
        lastProcessed = e.target.textContent;
    
        // check for error
        if (typeof result !== "number") {
            num1 = null;                                    // prevents further calculations
            return;
        }

        num1 = result;
        op = null;
        num2 = null;
    }
})

// clear btn
document.querySelector(".clear").addEventListener("click", clear);

// decimal point btn
document.querySelector(".dp").addEventListener("click", (e) => {
    if (lastProcessed === "=") clear();

    if (!display.textContent.includes(".")) {
        if (op !== null && num2 === null) {
            display.textContent = "0";
            num2 = 0;
        }

        display.textContent += ".";
        lastProcessed = e.target.textContent;
    }
});

// back btn
document.querySelector(".back").addEventListener("click", (e) => {
    if (lastProcessed === "=") clear();
    else if (op === null) {
        display.textContent = (display.textContent === "0") ? 0 : display.textContent.slice(0, -1);
    
        // store current value depending if op is set
        if (op === null) {
            num1 = parseFloat(display.textContent);
        }
        else {
            num2 = parseFloat(display.textContent);
        }
    }
    
    lastProcessed = e.target.textContent;
});

// WORKING: backspace
// BUG: can add a "." to the result from chaining operators

// TODO: Add event for divide by zero error, 
// and for handling, disable all buttons except numbers, clear, and back.