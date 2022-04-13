const appealPopup = document.querySelector('#appeal-popup');

const appealsNode = document.querySelectorAll('.appeal');
const appeals = [...appealsNode];
appeals.forEach((appeal) => {
	appeal.addEventListener('click', () => {
		if (menu.classList.contains('active')) {
			burger.click();
		}
		body.classList.add('lock');
		appealPopup.classList.add('active');
		if (userPhone.length > 0 && userName.length > 0) {
			if (isEmailValid(userMail) && userMail.length > 0) {
				appealMail.value = userMail;
			}
			appealName.value = userName;
			appealPhone.value = userPhone;
			formValidate(event);
			return
		} else if (isEmailValid(userMail) && userMail.length > 0) {
			appealMail.value = userMail;
		} else if (userName.length > 0) {
			appealName.value = userName;
		} else if (userPhone.length > 0) {
			appealPhone.value = userPhone;
		}
	});
})

document.querySelector('#appeal-popup-close').addEventListener('click', function () {
	body.classList.remove('lock');
	appealPopup.classList.remove('active');
})

const appealForm = document.querySelector('#appeal-popup-form');
const appealMail = document.querySelector('#appeal-mail');
const appealMailError = document.querySelector('#appeal-mail-error');
const appealNextStep = document.querySelector('#appeal-form-next');

const appealName = document.querySelector('#appeal-name');
const appealNameError = document.querySelector('#appeal-name-error');

const appealPhone = document.querySelector('#appeal-phone');
const appealPhoneError = document.querySelector('#appeal-phone-error');

function appealMailShowError() {
	if (!isEmailValid(appealMail.value)) {
		appealMailError.textContent = 'Введите корректный адрес';
		appealMail.style.borderBottom = "1px solid red";
	} else if (appealMail.validity.rangeOverflow) {
		appealMail.style.borderBottom = "1px solid red";
		appealMailError.textContent = 'Превышен лимит символов';
	} else {
		userMail = appealMail.value;
	}
}
appealMail.addEventListener('input', function () {
	if (isEmailValid(appealMail.value)) {
		userMail = appealMail.value;
		appealMailError.textContent = '';
		appealMail.style.borderBottom = "1px solid #D1D3D4";
	} else {
		appealMailShowError();
	}
});
function appealNameShowError() {
	if (appealName.validity.valueMissing) {
		appealNameError.textContent = 'Введите имя';
	} else if (appealName.validity.typeMismatch) {
		appealNameError.textContent = 'Введите имя корректно';
	} else if (appealName.validity.rangeOverflow) {
		appealNameError.textContent = 'Превышен лимит симолов';
	} else {
		userName = appealName.value;
	}
}
appealName.addEventListener('input', function () {
	if (appealName.validity.valid) {
		userName = appealName.value;
		appealNameError.textContent = '';
		appealName.style.borderBottom = "1px solid #D1D3D4";
	} else {
		appealNameShowError();
	}
});
function appealPhoneShowError() {
	if (appealPhone.validity.valueMissing) {
		appealPhoneError.textContent = 'Введите телефон';
		appealPhone.style.borderBottom = "1px solid red";
		return false
	}
	if (appealPhone.value.length < 18) {
		appealPhone.style.borderBottom = "1px solid red";
		appealPhoneError.textContent = 'Поле заполнено не полностью';
		return false
	} else {
		appealPhone.style.borderBottom = "1px solid #D1D3D4";
		appealPhoneError.textContent = '';
		userPhone = appealPhone.value;
		appealPhone.blur();
		return true
	}
}
appealPhone.addEventListener("input", mask, false);
appealPhone.addEventListener("focus", mask, false);
appealPhone.addEventListener("blur", mask, false);
appealPhone.addEventListener("keydown", mask, false);
appealPhone.addEventListener("keyup", mask, false);

appealPhone.addEventListener("input", appealPhoneShowError, false);
appealPhone.addEventListener("focus", appealPhoneShowError, false);
appealPhone.addEventListener("blur", appealPhoneShowError, false);
appealPhone.addEventListener("keydown", appealPhoneShowError, false);
appealPhone.addEventListener("keyup", appealPhoneShowError, false);


function nextStep() {
	document.querySelector('#appeal-form-step-1').classList.add('done');
	document.querySelector('#appeal-popup-progress-1').classList.add('done');
	document.querySelector('#appeal-form-step-2').classList.add('active');
	document.querySelector('#appeal-popup-progress-2').classList.add('active');
}


function formValidate(event) {
	event.preventDefault();

	appealName.validity.valid ? appealNameError.textContent = '' : appealNameShowError();
	appealPhone.validity.valid ? appealPhoneError.textContent = '' : appealPhoneShowError();
	isEmailValid(appealMail.value) ? appealMailError.textContent = '' : appealMailShowError();

	if (appealName.validity.valid && appealPhone.validity.valid && isEmailValid(appealMail.value)) {
		appealNextStep.removeAttribute("disabled");
		appealNextStep.addEventListener('click', nextStep);
	} else {
		appealNextStep.setAttribute("disabled", "disabled");
	}
}

appealForm.addEventListener('change', function (event) {
	formValidate(event);
});


function sendAppealForm() {
	let sendName = appealName.value;
	let sendMail = appealMail.value;
	let sendPhone = appealPhone.value;
	let sendType = dropInput.value;

	const dataAppeal = {
		fun: '1',
		name: sendName,
		phone: sendPhone,
		email: sendMail,
		type: sendType,
		//session: BX.bitrix_sessid()
	};
	console.log(dataAppeal);
	postAppeal(formUrl, dataAppeal)

	function postAppeal(url, data) {
		BX.showWait();
		$.ajax({
			type: "POST",
			url: url,
			data: data,
			dataType: 'json',
			success: function (res) {
				console.log(res.code);
				if (res.code && res.code == "200") {
					appealPopup.classList.remove('active');
					popupSuccess.classList.add('active');
				} else {
					appealPopup.classList.remove('active');
					popupFail.classList.add('active');
				}
			},
			error: function (err) {
				console.log(err);
				appealPopup.classList.remove('active');
				popupFail.classList.add('active');
			},
			complete: function () {
				BX.closeWait();
			}
		});
	}
}



const dropdown = document.querySelector('#appeal-dropdown');
const dropContent = document.querySelector('#appeal-dropdown-inner');
const dropInput = document.querySelector('#appeal-type');
const formSubmit = document.querySelector('#appeal-form-submit');
const dropItemsNode = dropContent.querySelectorAll('p');
const dropItems = [...dropItemsNode];
dropdown.addEventListener('click', function () {
	dropContent.classList.add('active');
})
dropItems.forEach((item) => {
	item.addEventListener('click', function () {
		if (dropContent.classList.contains('active')) {
			dropContent.classList.remove('active');
		}
		dropdown.innerText = item.innerText;
		dropInput.value = item.innerText;

		if (formSubmit.hasAttribute('disabled')) {
			formSubmit.removeAttribute('disabled');
		}

		formSubmit.addEventListener('click', sendAppealForm);
	})
})