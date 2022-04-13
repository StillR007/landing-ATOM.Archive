const advicePopup = document.querySelector('#advice-popup');
const adviceForm = document.querySelector('#advice-popup-form');
const adviceSubmit = document.querySelector('#advice-form-submit');
const adviceNode = document.querySelectorAll('.advice');
const advices = [...adviceNode];
advices.forEach((advice) => {
	advice.addEventListener('click', () => {
		body.classList.add('lock');
		advicePopup.classList.add('active');
		if (userPhone.length > 0 && userName.length > 0) {
			if (isEmailValid(userMail) && userMail.length > 0) {
				adviceMail.value = userMail;
			}
			adviceName.value = userName;
			advicePhone.value = userPhone;
			adviceFormValidate(event);
			return
		} else if (isEmailValid(userMail) && userMail.length > 0) {
			adviceMail.value = userMail;
		} else if (userName.length > 0) {
			adviceName.value = userName;
		} else if (userPhone.length > 0) {
			advicePhone.value = userPhone;
		}
	});
})

document.querySelector('#advice-popup-close').addEventListener('click', function () {
	body.classList.remove('lock');
	advicePopup.classList.remove('active');
})

const advicePhone = document.querySelector('#advice-phone');
const advicePhoneError = document.querySelector('#advice-phone-error');

function advicePhoneShowError() {
	if (advicePhone.validity.valueMissing) {
		advicePhoneError.textContent = 'Введите телефон';
		advicePhone.style.borderBottom = "1px solid red";
		return false
	}
	if (advicePhone.value.length < 18) {
		advicePhone.style.borderBottom = "1px solid red";
		advicePhoneError.textContent = 'Поле заполнено не полностью';
		return false
	} else {
		advicePhone.style.borderBottom = "1px solid #D1D3D4";
		advicePhoneError.textContent = '';
		userPhone = advicePhone.value;
		advicePhone.blur();
		return true
	}
}
advicePhone.addEventListener("input", mask, false);
advicePhone.addEventListener("focus", mask, false);
advicePhone.addEventListener("blur", mask, false);
advicePhone.addEventListener("keydown", mask, false);
advicePhone.addEventListener("keyup", mask, false);

advicePhone.addEventListener("input", advicePhoneShowError, false);
advicePhone.addEventListener("focus", advicePhoneShowError, false);
advicePhone.addEventListener("blur", advicePhoneShowError, false);
advicePhone.addEventListener("keydown", advicePhoneShowError, false);
advicePhone.addEventListener("keyup", advicePhoneShowError, false);



const adviceMail = document.querySelector('#advice-mail');
const adviceMailError = document.querySelector('#advice-mail-error');
function adviceMailShowError() {
	if (!isEmailValid(adviceMail.value)) {
		adviceMailError.textContent = 'Введите корректный адрес';
		adviceMail.style.borderBottom = "1px solid red";
		return false
	} else if (adviceMail.validity.rangeOverflow) {
		adviceMail.style.borderBottom = "1px solid red";
		adviceMailError.textContent = 'Превышен лимит символов';
		return false
	} else {
		userMail = adviceMail.value;
		return true
	}
}
adviceMail.addEventListener('input', function () {
	if (isEmailValid(adviceMail.value)) {
		adviceMailError.textContent = '';
		adviceMail.style.borderBottom = "1px solid #D1D3D4";
		return true
	} else {
		adviceMailShowError();
	}
});


const adviceName = document.querySelector('#advice-name');
const adviceNameError = document.querySelector('#advice-name-error');
function adviceNameShowError() {
	if (adviceName.validity.valueMissing) {
		adviceNameError.textContent = 'Введите имя';
	} else if (adviceName.validity.typeMismatch) {
		adviceNameError.textContent = 'Введите имя корректно';
	} else if (adviceName.validity.rangeOverflow) {
		adviceNameError.textContent = 'Превышен лимит симолов';
	} else {
		userName = adviceName.value;
		console.log(userName)
	}
}
adviceName.addEventListener('input', function () {
	if (adviceName.validity.valid) {
		userName = adviceName.value;
		adviceNameError.textContent = '';
		adviceName.style.borderBottom = "1px solid #D1D3D4";
	} else {
		adviceNameShowError();
	}
});
function adviceFormValidate(event) {
	event.preventDefault();

	adviceName.validity.valid ? adviceNameError.textContent = '' : adviceNameShowError();
	advicePhone.validity.valid ? advicePhoneError.textContent = '' : advicePhoneShowError();
	isEmailValid(adviceMail.value) ? adviceMailError.textContent = '' : adviceMailShowError();

	if (adviceName.validity.valid && advicePhone.validity.valid) {
		adviceSubmit.removeAttribute("disabled");
		adviceSubmit.addEventListener('click', sendAdviceForm);
	} else {
		adviceSubmit.setAttribute("disabled", "disabled");
	}
}

adviceForm.addEventListener('change', function (event) {
	adviceFormValidate(event);
});

function sendAdviceForm() {
	let sendName = adviceName.value;
	let sendMail = adviceMail.value;
	let sendPhone = advicePhone.value;

	const dataAdvice = {
		fun: '2',
		name: sendName,
		phone: sendPhone,
		email: sendMail,
		//session: BX.bitrix_sessid()
	};
	console.log(dataAdvice);
	postAdvice(formUrl, dataAdvice);

	function postAdvice(url, data) {
		BX.showWait();
		$.ajax({
			type: "POST",
			url: url,
			data: data,
			dataType: 'json',
			success: function (res) {
				console.log(res.code);
				if (res.code && res.code == "200") {
					advicePopup.classList.remove('active');
					popupSuccess.classList.add('active');
				} else {
					advicePopup.classList.remove('active');
					popupFail.classList.add('active');
				}
			},
			error: function (err) {
				console.log(err);
				advicePopup.classList.remove('active');
				popupFail.classList.add('active');
			},
			complete: function () {
				BX.closeWait();
			}
		});
	}
}