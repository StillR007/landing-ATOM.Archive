const burger = document.querySelector('.header-burger');
const menu = document.querySelector('.header-menu');
const formUrl = '/include/api/mail/sendForm.ajax.php';

burger.addEventListener('click', function () {
	burger.classList.toggle('active');
	menu.classList.toggle('active');
	body.classList.toggle('menu');
})

const menuLinksNode = document.querySelectorAll('.header-menu>a');
const menuLinks = [...menuLinksNode];
menuLinks.forEach((link) => {
	link.addEventListener('click', function () {
		burger.classList.remove('active');
		menu.classList.remove('active');
		body.classList.remove('menu');
	})
})



const popupSuccess = document.querySelector('#success');
const popupSuccessClose = document.querySelector('#success-close');

popupSuccessClose.addEventListener('click', () => {
	body.classList.remove('lock');
	popupSuccess.classList.remove('active');
})




const popupFail = document.querySelector('#fail');
const popupFailClose = document.querySelector('#fail-close');

popupFailClose.addEventListener('click', () => {
	body.classList.remove('lock');
	popupFail.classList.remove('active');
})