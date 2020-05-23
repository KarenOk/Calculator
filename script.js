let inputElem = document.querySelector(".input");
let equationElem = document.querySelector(".equation");
let inputValue = "0";
let equation = "";
/*
    TODO: Fix input value bug after initial solution of an equation

*/

document.addEventListener("keyup", validateInput);

function validateInput(e) {
    // Test for valid characters
    if (/[0-9]|\+|\-|\\|\*|%|=|Backspace|Enter|\./.test(e.key)) {

        if (!isNaN(e.key) && inputValue.length < 12) {
            // As long as input is a number less that 12 digits
            console.log("entered", inputValue)
            inputValue = (inputValue === "0" || !inputValue) ? e.key : inputValue + e.key;
            updateInputValue();
        } else if (e.key === ".") {
            // Only include decimal point if there's no other point in input
            if (!/\./.test(inputValue)) {
                inputValue = inputValue + e.key;
                updateInputValue();
            }
        } else if (e.key === "Backspace") {
            inputValue = inputValue.slice(0, inputValue.length - 1);
            if (!inputValue) inputValue = "0";
            updateInputValue();
        } else {
            equation = equation + inputValue;

            // Any other input has to be an operator
            switch (e.key) {
                case "+": {
                    console.log("+ is a valid operation");
                    equation = equation + "+";
                    updateInputValue("0");
                    break;
                }
                case "-": {
                    console.log("- is a valid operation");
                    equation = equation + "-";
                    updateInputValue("0");

                    break;
                }
                case "/": {
                    console.log("/ is a valid operation");
                    equation = equation + "/";
                    updateInputValue("0");
                    break;
                }
                case "*": {
                    console.log("* is a valid operation");
                    equation = equation + "*";
                    updateInputValue("0");

                    break;
                }
                case "%": {
                    console.log("% is a valid operation")
                    if (isNaN(equation[equation.length - 1]))
                        equation = equation.slice(0, equation.length - 1)
                    let result = solve();
                    updateInputValue(result / 100);
                    break;
                }
                case "=": {
                    console.log("= is a valid operation");
                    // Pop off any trailing operator
                    if (isNaN(equation[equation.length - 1]))
                        equation = equation.slice(0, equation.length - 1)
                    let result = solve();
                    updateInputValue(result);
                    break;
                }
                case "Enter": {
                    console.log("Enter is a valid operation");
                    // Pop off any trailing operator
                    if (isNaN(equation[equation.length - 1]))
                        equation = equation.slice(0, equation.length - 1)
                    let result = solve();
                    updateInputValue(result);
                    break;
                }

                default: {
                    break;
                }

            }
        }

    }

    equationElem.innerHTML = equation;

}

function updateInputValue(value) {
    if (!value) inputElem.innerHTML = inputValue;
    else {
        inputElem.innerHTML = value;
        inputValue = value;
    }
}

function solve() {
    // Evaluate equation
    return Function(`return ${equation}`)();
}

// Rules
// Not more than 1 . in current input
// Pop off last operator if another operator is selected
// Keep a 0 at the beginning of the equation stack in case