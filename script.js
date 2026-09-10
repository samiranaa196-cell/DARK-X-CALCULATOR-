const display = document.getElementById("expression");
const historyDisplay = document.getElementById("history");

const buttons = document.querySelectorAll(".btn");

let current = "0";
let previous = "";
let operator = null;
let resetDisplay = false;


function updateDisplay() {

    display.textContent = current;

    if (previous && operator) {
        historyDisplay.textContent =
            `${previous} ${operator}`;
    } else {
        historyDisplay.textContent = "";
    }
}


function inputNumber(number) {

    if (current === "Error") {
        current = "0";
    }

    if (resetDisplay) {
        current = number;
        resetDisplay = false;
    }

    else if (current === "0") {
        current = number;
    }

    else {

        if (current.length >= 15) {
            return;
        }

        current += number;
    }

    updateDisplay();
}


function inputDecimal() {

    if (resetDisplay) {
        current = "0.";
        resetDisplay = false;

        updateDisplay();

        return;
    }

    if (!current.includes(".")) {
        current += ".";
    }

    updateDisplay();
}


function chooseOperator(newOperator) {

    if (current === "Error") {
        return;
    }

    if (operator && !resetDisplay) {
        calculate();
    }

    previous = current;

    operator = newOperator;

    resetDisplay = true;

    updateDisplay();
}


function calculate() {

    if (!operator || previous === "") {
        return;
    }

    const first = parseFloat(previous);
    const second = parseFloat(current);

    let result;


    switch (operator) {

        case "+":
            result = first + second;
            break;

        case "−":
            result = first - second;
            break;

        case "×":
            result = first * second;
            break;

        case "÷":

            if (second === 0) {

                current = "Error";

                previous = "";
                operator = null;

                resetDisplay = true;

                updateDisplay();

                return;
            }

            result = first / second;

            break;
    }


    if (!Number.isFinite(result)) {
        current = "Error";
    }

    else {
        current = formatNumber(result);
    }


    previous = "";
    operator = null;

    resetDisplay = true;

    updateDisplay();
}


function formatNumber(number) {

    if (Number.isInteger(number)) {
        return number.toString();
    }

    return parseFloat(
        number.toFixed(10)
    ).toString();
}


function clearCalculator() {

    current = "0";

    previous = "";

    operator = null;

    resetDisplay = false;

    updateDisplay();
}


function deleteNumber() {

    if (
        resetDisplay ||
        current === "Error"
    ) {

        current = "0";

        resetDisplay = false;

        updateDisplay();

        return;
    }


    if (current.length <= 1) {
        current = "0";
    }

    else {
        current = current.slice(0, -1);
    }

    updateDisplay();
}


function percentage() {

    if (current === "Error") {
        return;
    }

    const number = parseFloat(current);

    if (isNaN(number)) {
        return;
    }

    current = formatNumber(number / 100);

    updateDisplay();
}


buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;


        if (value !== undefined) {

            if (
                value === "÷" ||
                value === "×" ||
                value === "−" ||
                value === "+"
            ) {

                chooseOperator(value);

            }

            else if (value === ".") {

                inputDecimal();

            }

            else {

                inputNumber(value);
            }

            return;
        }


        if (action === "clear") {
            clearCalculator();
        }

        else if (action === "delete") {
            deleteNumber();
        }

        else if (action === "percent") {
            percentage();
        }

        else if (action === "calculate") {
            calculate();
        }

    });

});


document.addEventListener("keydown", event => {

    const key = event.key;


    if (key >= "0" && key <= "9") {
        inputNumber(key);
    }

    else if (key === ".") {
        inputDecimal();
    }

    else if (key === "+") {
        chooseOperator("+");
    }

    else if (key === "-") {
        chooseOperator("−");
    }

    else if (key === "*") {
        chooseOperator("×");
    }

    else if (key === "/") {

        event.preventDefault();

        chooseOperator("÷");
    }

    else if (key === "%") {
        percentage();
    }

    else if (
        key === "Enter" ||
        key === "="
    ) {
        calculate();
    }

    else if (key === "Backspace") {
        deleteNumber();
    }

    else if (key === "Escape") {
        clearCalculator();
    }

});


updateDisplay();
