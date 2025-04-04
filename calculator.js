let operators = {
    "+": function(a, b) {return a + b;},
    "-": function(a, b) {return a - b;},
    "*": function(a, b) {return a * b;},
    "/": function(a, b) {return a / b;},
}

function operate(a, op, b) {
    return operators[op](a, b);
}

let display = document.querySelector("#display");
let fullExpression = document.querySelector('#full-expression');
let num1, num2, op;

// number btns
document.querySelectorAll(".number")
        .forEach((numBtn) => {
            numBtn.addEventListener("click", () => {
                // append to display
                display.textContent = display.textContent + numBtn.textContent;

                // store current value depending if op is set
                if (!op) num1 = +display.textContent;
                else num2 = +display.textContent;
            });
        });

// operator btns
document.querySelectorAll(".op")
        .forEach((opBtn) => {
            opBtn.addEventListener("click", () => {
                if (!op) {
                    op = opBtn.textContent;
                }
                else {
                    // evaluate the result first
                    let result = operate(num1, op, num2);
                    num1 = result;
                    num2 = null;
                    
                    op = opBtn.textContent;          
                }

                display.textContent = "";
                fullExpression.textContent = num1 + " " + op;
            });
        });

// eval btn
document.querySelector(".eval").addEventListener("click", () => {
    // dont allow eval before all numbers and operator has been inputted
    if (num1 && op && num2) {
        let result = operate(num1, op, num2);
        display.textContent = result;
        fullExpression.textContent = fullExpression.textContent + " " + num2 + " =";
    
        num1 = result;
        num2 = null;
        op = null;
    }
})

// clear btn
document.querySelector(".clear").addEventListener("click", () => {
    display.textContent = "";
    fullExpression.textContent = "";
    num1 = null;
    num2 = null;
    op = null;
})