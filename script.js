// Initial state
// Accumulating state
// Pending operation state

const MAX_INT_LENGTH = 12;

let workingValue = '';
let savedValue = '';
let savedOperator = '';

const display = document.getElementById('display');
const numButtons = document.querySelectorAll('.number-button');
const operatorButtons = document.querySelectorAll('.operator-button');
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
    //Check For Overflow and Round
    return num.toString();
    //////////////////////////////
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
// 6803335609 -- 6.803356e9
const intToScientific = (text) => {
    //Determine how much larger the int value is than the display max
    let overage = text.length - MAX_INT_LENGTH;
    let shortString;
    // Attempt to round the digit to a reasonable value
    do  {
        shortString = Number(text).toExponential(overage++);
    } while (shortString.length > MAX_INT_LENGTH)
    console.log(`String: ${text} Shortstring: ${shortString}`)
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
        const k = e.key;
        const validDigit = [0,1,2,3,4,5,6,7,8,9].find(i => k===i);
        if(validDigit !== undefined) return k;
    }
};

const getOperatorFromEvent = e => {
    if (e.type === 'click') {
        return e.target.dataset.operator;
    } else if (e.type === 'keydown') {
        const k = e.key;
        const validOperator = ['*', '/', '-', '+', '='].find(o => k===o);
        if(validOperator !== undefined) return k;
    }
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
        savedOperator = operator;
        renderDisplay(savedValue);
    //Data saved, no previous operation (hit equals previously)
    } else if (savedValue && !savedOperator){
        //but not hitting equals right after
        if (operator !== '=') savedOperator = operator;
    //Data saved, previous operation
    } else if (savedValue && savedOperator) {
        const result = operate(savedValue, workingValue, savedOperator);
        savedValue = result;
        workingValue = '';
        if(operator !== '=') {
            savedOperator = operator;
        } else {
            savedOperator = '';
        }
        renderDisplay(savedValue);
    }
}

const backPressed = e => {
    if(workingValue.length) {
        workingValue = workingValue.slice(0,-1);
        renderDisplay(workingValue);
    }
};

const decimalPressed = e => {
    if(workingValue.indexOf('.') === -1){
        workingValue += '.';
        renderDisplay(workingValue);
    }
};

const clear = e => {
    clearDisplay();
    workingValue = '';
    savedValue = '';
    savedOperator = '';
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

// document.addEventListener('click', _ => {
//     console.log(`workingValue: ` + workingValue);
//     console.log('savedValue: ' + savedValue);
//     console.log('savedOperator: ' + savedOperator);
// });