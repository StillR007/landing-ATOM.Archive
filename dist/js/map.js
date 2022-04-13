const apiKey = 'f977353b-1b8f-4f55-8030-ee5c4fd0ceeb';
const coordination = [56.831846, 60.616061];
const mapButton = document.querySelector('#map-button');
const mapPopup = document.querySelector('#archive-map');

mapButton.addEventListener('click', () => {
	document.querySelector('body').classList.add('locked');
	mapPopup.classList.add('active');
});

document.querySelector('#archive-map-close').addEventListener('click', () => {
	document.querySelector('body').classList.remove('locked');
	mapPopup.classList.remove('active');
});


function initMap() {
	let map = new google.maps.Map(document.querySelector("#archive-map__map"), {
		zoom: 12,
		center: { lat: Number(coordination[0]), lng: Number(coordination[1]) }
	});

	mark_position = new google.maps.LatLng(Number(coordination[0]), Number(coordination[1]));
	let marker = new google.maps.Marker({
		map: map,
		title: 'ул. Белинского, 39',
		position: mark_position,
	});
}
