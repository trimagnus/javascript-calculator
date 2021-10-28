const MAX_INT_LENGTH = 9;

let savedValue = null;
let savedOperator = null;
let enteringNumber = false;

const display = document.getElementById('display');
const numButtons = document.querySelectorAll('.number-button');
const operatorButtons = document.querySelectorAll('.operator-button');
const backButton = document.getElementById('back-button');
const clearButton = document.getElementById('clear-button');
const equalButton = document.getElementById('equal-button');

// HELPER FUNCTIONS //
const operate = (a, b, operator) => {
    switch(operator) {
        case '+':
            return add(a,b);
        case '-':
            return sub(a,b);
        case '*':
            return mul(a,b);
        case '/':
            return div(a,b);
    }
};

const add = (a,b) => a+b;
const sub = (a,b) => a-b;
const mul = (a,b) => a*b;
const div = (a,b) => a/b;


// EVENTS //
const numberPressed = e => {
    let displayVal  = display.textContent;
    if(displayVal.length >= MAX_INT_LENGTH) return;

    if(!enteringNumber) {
        if(!savedOperator) savedValue = null;
        displayVal = '';
        enteringNumber = true;
    }
    displayVal += e.target.dataset.value;
    display.textContent = displayVal;
};

const operatorPressed = e => {
    if (savedValue === null) {
        savedValue = Number(display.textContent);
    } else if (savedOperator !== null) {
        let currentValue = Number(display.textContent);
        savedValue = operate(savedValue, currentValue, savedOperator);
        //Check saved value for overflow here
        //checkForOverflow(savedValue);
        //round if overflow
        //
        display.textContent = savedValue;
    }
    savedOperator = e.target.dataset.operator;
    enteringNumber = false;
}

const equalsPressed = e => {
    if (!savedOperator) return;
    let currentValue = Number(display.textContent);
    savedValue = operate(savedValue, currentValue, savedOperator);
    display.textContent = savedValue;
    savedOperator = null;
    enteringNumber = false;
};

const backPressed = e => {
    if (!enteringNumber) return;
    if (display.textContent.length === 1) {
        display.textContent = '0';
        enteringNumber = false;
    } else {
        display.textContent = display.textContent.slice(0,-1)
    }
};

const clear = e => {
    display.textContent = '0';
    savedValue = null;
    savedOperator = null;
    enteringNumber = false;
};

// EVENT HOOKS //
numButtons.forEach( b => {
    b.addEventListener('click', numberPressed);
});

operatorButtons.forEach( b => {
    b.addEventListener('click', operatorPressed);
});

equalButton.addEventListener('click', equalsPressed);
backButton.addEventListener('click', backPressed);
clearButton.addEventListener('click', clear);