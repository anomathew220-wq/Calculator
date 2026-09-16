const valueEl = document.getElementById('value');
const historyEl = document.getElementById('history');

let current = '0';
let previous = null;
let operator = null;
let justEvaluated = false;

function updateDisplay() {
  valueEl.textContent = current;
  historyEl.textContent = previous !== null && operator ? `${previous} ${operator}` : '';
}

function inputNumber(num) {
  if (justEvaluated) {
    current = num === '.' ? '0.' : num;
    justEvaluated = false;
    updateDisplay();
    return;
  }
  if (num === '.' && current.includes('.')) return;
  current = current === '0' && num !== '.' ? num : current + num;
  updateDisplay();
}

function chooseOperator(op) {
  if (operator !== null && !justEvaluated) {
    evaluate();
  }
  previous = current;
  operator = op;
  current = '0';
  justEvaluated = false;
  updateDisplay();
}

function evaluate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case 'add': result = a + b; break;
    case 'subtract': result = a - b; break;
    case 'multiply': result = a * b; break;
    case 'divide': result = b === 0 ? NaN : a / b; break;
    default: return;
  }

  current = Number.isNaN(result) ? 'Error' : trimResult(result);
  previous = null;
  operator = null;
  justEvaluated = true;
  updateDisplay();
}

function trimResult(num) {
  return parseFloat(num.toFixed(10)).toString();
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  justEvaluated = false;
  updateDisplay();
}

function backspace() {
  if (justEvaluated) return;
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay();
}

function percent() {
  current = trimResult(parseFloat(current) / 100);
  updateDisplay();
}

document.querySelectorAll('[data-number]').forEach(btn => {
  btn.addEventListener('click', () => inputNumber(btn.dataset.number));
});

document.querySelectorAll('[data-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    if (action === 'clear') clearAll();
    else if (action === 'backspace') backspace();
    else if (action === 'percent') percent();
    else if (action === 'equals') evaluate();
    else chooseOperator(action);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  else if (e.key === '.') inputNumber('.');
  else if (e.key === '+') chooseOperator('add');
  else if (e.key === '-') chooseOperator('subtract');
  else if (e.key === '*') chooseOperator('multiply');
  else if (e.key === '/') { e.preventDefault(); chooseOperator('divide'); }
  else if (e.key === 'Enter' || e.key === '=') evaluate();
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape') clearAll();
});

updateDisplay();
