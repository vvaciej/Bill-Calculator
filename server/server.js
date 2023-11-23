const tips = {
  tip5: document.querySelector('.tip-5'),
  tip10: document.querySelector('.tip-10'),
  tip15: document.querySelector('.tip-15'),
  tip25: document.querySelector('.tip-25'),
  tip50: document.querySelector('.tip-50'),
}

const allInputs = document.querySelectorAll('.input');
const allErrors = document.querySelectorAll('.null-error');
let isValidValue;

const inputs = {
	bill: allInputs[0],
	customTip: allInputs[1],
	numberPeople: allInputs[2],
};

let totalAmount = 0;
let tipAmount = 0;
let selectedIndex = null;

let totalText = document.querySelector('.total-text');
let tipText = document.querySelector('.tip-text');

const allInputsFiltered = document.querySelectorAll('.input-error');

function nullValueInputError () {
  isValidValue = true;
  
  allInputs.forEach((element) => {
    const inputValue = element.value.trim();
    const checkIsValid = inputValue == '0' || parseFloat(inputValue) < 1 || inputValue.startsWith('0');

    if (checkIsValid) {
			element.style.borderColor = 'hsl(0, 100%, 80%)';
			isValidValue = false;
		} else {
			element.style.borderColor = '';
		}
  })

  allErrors.forEach((element, index) => {
    const inputValue = allInputsFiltered[index].value.trim();
    const checkIsValid = inputValue == '0' || parseFloat(inputValue) < 1 || inputValue.startsWith('0');

    if (checkIsValid) {
			element.classList.add('active');
		} else {
			element.classList.remove('active');
		}
  })
}

function calculateTotalAmount() {
  if (isValidValue) {
    totalAmount = parseFloat((inputs.bill.value / inputs.numberPeople.value).toFixed(2));
  } else {
    totalAmount = 0;
  }
}

function updateCustomTip() {
	const customTipValue = parseFloat(inputs.customTip.value);

	if (!isNaN(totalAmount) && customTipValue > 0) {
		tipAmount = ((customTipValue / 100) * totalAmount);
	} else {
		tipAmount = 0;
	}
}

function calcBtnTipAmount () {
  for (const tip in tips) {
    if (tips[tip].classList.contains('selected')) {
      const tipPercentage = parseInt(tip.slice(3));
      tipAmount = (tipPercentage / 100) * totalAmount;
    }
  }
}

function displayAmount () {
  const billInputLength = inputs.bill.value.length;
  const peopleNumberInputLength = inputs.numberPeople.value.length;
  const checkLengthNumberPeopleAndBill = billInputLength > 0 && peopleNumberInputLength > 0 && isValidValue;

  let formattedTipAmount = '$0.00';
	let formattedTotalAmount = '$0.00';

  if (tipAmount > 0 && isFinite(tipAmount)) {
    formattedTipAmount = '$' + tipAmount.toFixed(2);
  }

  if (checkLengthNumberPeopleAndBill && isFinite(totalAmount)) {
    formattedTotalAmount = '$' + totalAmount.toFixed(2);
  }

  tipText.textContent = formattedTipAmount;
  totalText.textContent = formattedTotalAmount;
}

function changeBtnColorsWhenClicked (e) {
  inputs.customTip.value = '';
  if (selectedIndex !== null) {
    allTipBts[selectedIndex].classList.remove('selected');
  }
  
  const clickedIndex = Array.from(allTipBts).indexOf(e.target);
  
  if (clickedIndex != selectedIndex) {
    e.target.classList.add('selected');
    selectedIndex = clickedIndex;
    calcBtnTipAmount();
    displayAmount();
  } else {
    tipAmount = 0;
    displayAmount();
    selectedIndex = null;
  }
}

const allTipBts = document.querySelectorAll('.tipBtn');

allTipBts.forEach(element => {
	element.addEventListener('click', changeBtnColorsWhenClicked);
});

// Activate functions on typing and disable type more text than allowed
allInputs.forEach(element => {
  element.addEventListener('input', () => {
    nullValueInputError();
    calculateTotalAmount();
    updateCustomTip();
    calcBtnTipAmount();
    displayAmount();
  });

  element.addEventListener('keydown', function (e) {
    const inputValue = element.value.trim();
    const maxLength = 4;

    if (!(e.key === 'Backspace' || e.key === 'Delete' || e.key.includes('Arrow')) && inputValue.length >= maxLength) {
      e.preventDefault();
    }
  });

  inputs.customTip.addEventListener('keydown', function (e) {
    const inputValue = inputs.customTip.value.trim();
		const maxLength = 2;

		if (!(e.key === 'Backspace' || e.key === 'Delete' || e.key.includes('Arrow')) && inputValue.length >= maxLength) {
			e.preventDefault();
		}
  })
});

const resetBtn = document.querySelector('.reset-btn');

function resetAll () {
  allInputs.forEach(element => {
    element.value = '';
  })
  tipText.textContent = '$0.00';
  totalText.textContent = '$0.00';
  tipAmount = 0;
  allTipBts.forEach(button => {
    button.classList.remove('selected');
  })
  selectedIndex = null;
}

resetBtn.addEventListener('click', resetAll);

function resetTipBtnByCustomTip () {
  displayAmount();
  allTipBts.forEach(button => {
    button.classList.remove('selected');
	});
  selectedIndex = null;
} 

inputs.customTip.addEventListener('input', resetTipBtnByCustomTip);