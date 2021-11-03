// Initial state
// Accumulating state
// Pending operation state

const MAX_INT_LENGTH = 12;
const VALID_OPERATORS = ['+','-','*','/','='];
const VALID_DIGITS = ['0','1','2','3','4','5','6','7','9','0'];

let workingValue = '';
let savedValue = '';
let savedOperator = '';

const display = document.getElementById('display');
const numButtons = Array.from(document.querySelectorAll('.number-button'));
const operatorButtons = Array.from(document.querySelectorAll('.operator-button'));
const decimalButton = document.querySelector('.decimal-button');
const backButton = document.getElementById('back-button');
const clearButton = document.getElementById('clear-button');
const equalButton = document.getElementById('equal-button');

// HELPER FUNCTIONS //
const operate = (a, b, operator) => {
    let num = null;
    a = Number(a);
    b = Number(b);
    switch(operator) {
        case '+':
            num = add(a,b);
            break;
        case '-':
            num = sub(a,b);
            break;
        case '*':
            num = mul(a,b);
            break;
        case '/':
            num = div(a,b);
            break;
    }
    return num.toString();
};

// FIX FLOATING POINT MATH! //
const add = (a,b) => (a+b);
const sub = (a,b) => (a-b);
const mul = (a,b) => (a*b);
const div = (a,b) => {
    if (b === 0) {
        return "No div zero!";
    }
    return (a/b);
}
/////////////////////////////

// Change an int string into scientific notiation
const intToScientific = (text) => {
    let overage = text.length - MAX_INT_LENGTH;
    let shortString;
    // Attempt to round the digit to a reasonable value
    do  {
        shortString = Number(text).toExponential(overage++);
    } while (shortString.length > MAX_INT_LENGTH)
    return shortString;
};

const clearDisplay = () => {
    renderDisplay('0');
};

const renderDisplay = (text) => {
    if (!text || text === '0' || text === '.') {
        display.textContent = '0';
    } else {
        if(text.length > MAX_INT_LENGTH) {
            text = intToScientific(text);
        }
        display.textContent = text;
    }
};

const accumulateNumber = num => {
    if(workingValue === '' && num === '0') return;
    if(workingValue.length < MAX_INT_LENGTH){
        workingValue = workingValue + num;
    }
};

const getNumberFromEvent = e => {
    if (e.type === 'click') {
        return e.target.dataset.value;
    } else if (e.type === 'keydown') {
        return e.key;
    }
};

const getOperatorFromEvent = e => {
    if (e.type === 'click') {
        return e.target.dataset.operator;
    } else if (e.type === 'keydown') {
        return e.key;
    }
};

const setOperator = (operator) => {
    clearOperator();
    savedOperator = operator;
    const button = operatorButtons.find(o=>o.dataset.operator === operator);
    button.classList.add('current-operator');
};

const clearOperator = () => {
    savedOperator = '';
    operatorButtons.forEach(button => {
        button.classList.remove('current-operator');
    });
};

// EVENTS //
const numberPressed = e => {
    let number = getNumberFromEvent(e);
    accumulateNumber(number);
    //If entering number with no prev operator, new equation / no saved data
    if(workingValue && !savedOperator) savedValue = '';
    renderDisplay(workingValue);
};

const operatorPressed = e => {
    const operator = getOperatorFromEvent(e);
    if(!operator) return;
    if(!savedValue && !workingValue || workingValue === '.') return;

    //Nothing saved and not hitting equals
    if(!savedValue && operator !== '=') {
        savedValue = workingValue;
        workingValue = '';
        setOperator(operator);
        renderDisplay(savedValue);
    //Data saved, no previous operation (hit equals previously)
    } else if (savedValue && !savedOperator){
        //but not hitting equals right after
        if (operator !== '=') setOperator(operator);
    //Data saved, previous operation
    } else if (savedValue && savedOperator) {
        //Just changing operators
        if(!workingValue) {
            setOperator(operator);
            return;
        }
        const result = operate(savedValue, workingValue, savedOperator);
        savedValue = result;
        workingValue = '';
        if(operator !== '=') {
            setOperator(operator)
        } else {
            clearOperator();
        }
        renderDisplay(savedValue);
    }
}

const backPressed = () => {
    if(workingValue.length) {
        workingValue = workingValue.slice(0,-1);
        renderDisplay(workingValue);
    }
};

const decimalPressed = () => {
    if(workingValue.indexOf('.') === -1){
        workingValue += '.';
        renderDisplay(workingValue);
    }
};

const clear = () => {
    clearDisplay();
    workingValue = '';
    savedValue = '';
    clearOperator();
};

// EVENT HOOKS //
numButtons.forEach( b => {
    b.addEventListener('click', numberPressed);
});

operatorButtons.forEach( b => {
    b.addEventListener('click', operatorPressed);
});

equalButton.addEventListener('click', operatorPressed);
backButton.addEventListener('click', backPressed);
decimalButton.addEventListener('click', decimalPressed);
clearButton.addEventListener('click', clear);

document.addEventListener('keydown', e => {
    const key = e.key;
    if(VALID_DIGITS.findIndex(d=>d===key) !== -1) {
        numberPressed(e);
    } else if (VALID_OPERATORS.findIndex(o=>o===key) !== -1) {
        operatorPressed(e);
    } else if (key === 'Backspace') {
        backPressed();
    } else if (key === '.') {
        decimalPressed();
    } else if (key === 'Enter') {
        operatorPressed({type:'keydown', key:'='});
    }
});