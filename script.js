let inputElem = document.querySelector(".input");
let equationElem = document.querySelector(".equation");
let inputValue = "0";
let equation = "";
let historyList = document.querySelector(".history ul");
let historyArr;
/*
    TODO: Use last result as first operand for a new operation
    TODO: Implement feature of the C button
    TODO: Implement feature of the +/- button
    TODO: Implement feature of the % button
    TODO: Register service worker and cache files
*/

document.addEventListener("keyup", validateInput);
document.addEventListener("touchend", (e) => {
    e.preventDefault();
    validateInput({ key: e.target.dataset.key });
});
document.addEventListener("click", (e) => {
    validateInput({ key: e.target.dataset.key });
})

function validateInput(e) {
    // Test for valid characters
    if (/[0-9]|\+|\-|\/|\*|%|=|Backspace|Enter|\./.test(e.key)) {

        if (inputValue.length < 12) {
            // Only allow these operations when max input length is not exceeded

            if (!isNaN(e.key) && inputValue.length < 12) {
                // As long as input is a number less that 12 digits
                inputValue = (inputValue === "0" || !inputValue) ? e.key : inputValue + e.key;
                updateInputValue();

            } else if (e.key === ".") {
                // Only include decimal point if there's no other point in input
                if (!/\./.test(inputValue)) {
                    inputValue = inputValue + e.key;
                    updateInputValue();
                }

            }
        }

        if (e.key === "Backspace") {
            inputValue = inputValue.slice(0, inputValue.length - 1);
            if (!inputValue) inputValue = "0";
            updateInputValue();

        } else if (e.key === "Enter" || e.key === "=") {
            equation = equation + inputValue;

            // Pop off any trailing operator
            if (isNaN(equation[equation.length - 1]))
                equation = equation.slice(0, equation.length - 1)
            let result = String(solve());

            updateInputValue(result);
            inputValue = "0";

            updateHistory(equation, result);
            equation = "";

            equationElem.innerHTML = equation; // Clear equation display

        } else if (isNaN(e.key)) {
            // Any other input has to be an operator (+ - / * %)

            // First decide whether to pop of last operator in order to change it, 
            // or append new number to the existing equation
            if (inputValue) equation = equation + inputValue;
            else if (isNaN(equation[equation.length - 1])) {
                equation = equation.slice(0, equation.length - 1);
            }

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
                    // if (isNaN(equation[equation.length - 1]))
                    //     equation = equation.slice(0, equation.length - 1)
                    let result = String(solve() / 100);
                    updateInputValue(result);
                    break;
                }

                default: {
                    break;
                }

            }

            equationElem.innerHTML = equation; // Update equation display
        }

    }


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

// Initial render of history
if (!localStorage['history']) localStorage.setItem('history', JSON.stringify([]));
historyArr = JSON.parse(localStorage.getItem('history'));
displayHistory();

function updateHistory(question, answer) {
    historyArr.push({ question, answer })
    if (historyArr.length > 10) historyArr.shift();
    localStorage.setItem('history', JSON.stringify(historyArr));
    displayHistory();
}

function displayHistory() {
    historyList.innerHTML = "";

    for (let i = historyArr.length - 1; i >= 0; i--) {
        let html = `<li> 
            <span class="question"> ${historyArr[i]['question']} </span> 
            = <span class="answer"> ${historyArr[i]['answer']} </span>
        </li>`

        historyList.innerHTML += html;
    }

}
// Rules
// Not more than 1 . in current input
// Pop off last operator if another operator is selected
// Keep a 0 at the beginning of the equation stack in case