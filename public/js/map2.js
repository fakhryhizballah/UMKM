// Inisialisasi Peta
const map = L.map('map').setView([-0.04169758550253827, 109.3362421903293], 13);

// Tambahkan Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ''
}).addTo(map);
// Membuat Marker Cluster Group
const markers = L.markerClusterGroup();

map.addLayer(markers);

$.ajax({
    url: '/api/maps',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
        addMarkers(data.data);
    }
});

function addMarkers(maker) {
    for (let a of maker) {
        let lat = a.Location.lat;
        let lng = a.Location.lng;

        let marker = L.marker([lat, lng]).bindPopup(`Lat: ${lat}, Lng: ${lng}`);
        markers.addLayer(marker);
    }

    // el.addEventListener('click', () => { 

} 