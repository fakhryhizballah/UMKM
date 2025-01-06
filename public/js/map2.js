// Inisialisasi Peta

const map = L.map('map').setView([-0.04169758550253827, 109.3362421903293], 13);
// Mendapatkan Lokasi Sekarang
navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    map.setView([lat, lng], 18);
});

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
        console.log(a);
        let random = Math.floor(Math.random() * 1000000);
        let id64 = btoa(a.id);
        let key = btoa(random + "#" + id64 + "#" + btoa(Math.floor(Math.random() * 1000)));
        console.log(key);
        // window.location.href = "/admin/umkm/entity/" + key;
        const routeLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        const profileLink = `/admin/umkm/entity/${key}`;

        const popupContent = `
    <h3>${a.badanusaha}</h3><br>
    Kategori: ${a.kategoriusaha}<br><br>
<a href="${routeLink}" class="btn btn-info mx-1" target="_blank" style="padding: 8px 12px;">
    Lihat Lokasi
</a>
<a href="${profileLink}"class="btn btn-info mx-1" target="_blank" style="padding: 8px 12px;">
    Lihat Profile
</a>
`;

        let marker = L.marker([lat, lng]).bindPopup(popupContent);
        markers.addLayer(marker);
    }

    // el.addEventListener('click', () => { 

} 