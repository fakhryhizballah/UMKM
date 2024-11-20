const map = L.map('map').setView([-0.04169758550253827, 109.3362421903293], 13);
navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    map.setView([lat, lng], 18);
});

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ''
}).addTo(map);

map.on('click', function (e) {
    // Mendapatkan LatLng
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // Tampilkan hasil di console atau di peta
    // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    $('#lat').val(lat);
    $('#lng').val(lng);

    // Hapus marker sebelumnya
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    // Tambahkan marker di lokasi klik
    L.marker([lat, lng]).addTo(map).bindPopup(`Lat: ${lat}, Lng: ${lng}`).openPopup();
});
// map.on('click', function (e) {
//     var lat = e.latlng.lat;
//     var lng = e.latlng.lng;
//     console.log(lat, lng);

//     // Tambahkan marker pada lokasi klik
//     L.marker([lat, lng]).addTo(map)
//         .bindPopup("Latitude: " + lat + "<br>Longitude: " + lng)
//         .openPopup();
// });