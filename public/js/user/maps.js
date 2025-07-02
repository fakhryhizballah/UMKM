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
fetch('https://api.spairum.my.id/api/cdn/file/geoBoundaries-IDN-ADM2_simplified.geojson')
    .then(res => res.json())
    .then(data => {
        const geoLayer = L.geoJSON(data, {
            filter: f => f.properties.shapeName === 'Kubu Raya',
            style: {
                color: 'red',
                weight: 3,
                fillColor: 'rgba(255,0,0,0.2)',
                fillOpacity: 0.2
            },
            onEachFeature: (feature, layer) => {
                layer.bindPopup(feature.properties.kabupaten);
            }
        }).addTo(map);
    });

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

$('#lat, #lng').on('change', function () {
    const lat = parseFloat($('#lat').val());
    const lng = parseFloat($('#lng').val());

    if (isNaN(lat) || isNaN(lng)) {
        return;
    }

    // Hapus marker sebelumnya
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Tambahkan marker di lokasi yang diinputkan
    L.marker([lat, lng]).addTo(map).bindPopup(`Lat: ${lat}, Lng: ${lng}`).openPopup();
    map.setView([lat, lng], 18);
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