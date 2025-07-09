// Inisialisasi Peta
const map = L.map('map').setView([-0.04169758550253827, 109.3362421903293], 10);
// Mendapatkan Lokasi Sekarang
// navigator.geolocation.getCurrentPosition(function (position) {
//     const lat = position.coords.latitude;
//     const lng = position.coords.longitude;
//     map.setView([lat, lng], 18);
// });
const kalbarRegions = [
    "Bengkayang",
    "Kapuas Hulu",
    "Kayong Utara",
    "Ketapang",
    "Kubu Raya",
    "Landak",
    "Melawi",
    "Mempawah",
    "Sambas",
    "Sanggau",
    "Sekadau",
    "Sintang",
    "Kota Pontianak",
    "Kota Singkawang"
];
console.log('Search Plugin:', L.Control.Search);
fetch('https://api.spairum.my.id/api/cdn/file/geoBoundaries-IDN-ADM2_simplified.geojson')
    .then(res => res.json())
    .then(data => {
        const geoLayer = L.geoJSON(data, {
            filter: f => f.properties.shapeName === 'Kubu Raya',
            // filter: f => kalbarRegions.includes(f.properties.shapeName),
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

// Tambahkan Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ''
}).addTo(map);
// Membuat Marker Cluster Group
const markers = L.markerClusterGroup();

map.addLayer(markers);

const dataUMKM = [];
$.ajax({
    url: '/api/maps',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
        addMarkers(data.data);
        dataUMKM.push(...data.data);
    }
});

//     for (let a of maker) {
//         let lat = a.Location.lat;
//         let lng = a.Location.lng;
//         console.log(a);
//         let random = Math.floor(Math.random() * 1000000);
//         let id64 = btoa(a.id);
//         let key = btoa(random + "#" + id64 + "#" + btoa(Math.floor(Math.random() * 1000)));
//         console.log(key);
//         // window.location.href = "/admin/umkm/entity/" + key;
//         const routeLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
//         const profileLink = `/umkm/entity/${key}`;

//         const popupContent = `
//     <h3>${a.badanusaha}</h3><br>
//     Kategori: ${a.kategoriusaha}<br><br>
// <a href="${routeLink}" class="btn btn-info mx-1" target="_blank" style="padding: 8px 12px;">
//     Lihat Lokasi
// </a>
// <a href="${profileLink}"class="btn btn-info mx-1" target="_blank" style="padding: 8px 12px;">
//     Lihat Profile
// </a>
// `;
//         let icon = {
//             iconUrl: '/asset/img/marker/location-pin.png',
//             iconSize: [41, 41],
//             iconAnchor: [12, 41],
//             popupAnchor: [1, -34],
//         }
//         if (a.kategoriusaha === 'Minuman') {
//             icon.iconUrl = '/asset/img/marker/miuman.png';
//         }
//         else if (a.kategoriusaha === 'Makanan') {
//             icon.iconUrl = '/asset/img/marker/restaurant.png';
//         }
//         else if (a.kategoriusaha === 'Fashion') {
//             icon.iconUrl = '/asset/img/marker/clothing-shop.png';
//         }
//         else if (a.kategoriusaha === 'Agribisnis') {
//             icon.iconUrl = '/asset/img/marker/elektonik.png';
//         }
//         else if (a.kategoriusaha === 'Kerajinan') {
//             icon.iconUrl = '/asset/img/marker/Craft.png';
//         }
//         else if (a.kategoriusaha === 'Jasa') {
//             icon.iconUrl = '/asset/img/marker/Accessories.png';
//         }
//         else if (a.kategoriusaha === 'Perdagangan') {
//             icon.iconUrl = '/asset/img/marker/salon.png';
//         }
//         else if (a.kategoriusaha === 'Furniture') {
//             icon.iconUrl = '/asset/img/marker/furniture-store.png';
//         }
//         let marker = L.marker([lat, lng]).bindPopup(popupContent);
//         marker.setIcon(L.icon(icon));
//         markers.addLayer(marker);
//     }

//     // el.addEventListener('click', () => { 

// }
// Buat container filter
const filterContainer = L.control({ position: 'topright' });

filterContainer.onAdd = function () {
    const div = L.DomUtil.create('div', 'filter-container leaflet-bar');
    const icons = {
        'Minuman': '/asset/img/marker/miuman.png',
        'Makanan': '/asset/img/marker/restaurant.png',
        'Fashion': '/asset/img/marker/clothing-shop.png',
        'Agribisnis': '/asset/img/marker/glasshouse.png',
        'Kerajinan': '/asset/img/marker/Craft.png',
        'Jasa': '/asset/img/marker/customer-service.png',
        'Perdagangan': '/asset/img/marker/trade.png',
    };

    div.innerHTML = `
    <div style="
      background: white;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      font-size: 14px;
      max-height: 300px;
      overflow-y: auto;
    ">
      <strong style="display:block; margin-bottom:8px;">Filter UMKM:</strong>
      ${Object.entries(icons).map(([kategori, icon]) => `
        <label style="display: flex; align-items: center; margin-bottom: 6px;">
          <input type="checkbox" value="${kategori}" checked style="margin-right:6px;">
          <img src="${icon}" style="width:20px; height:20px; margin-right:6px;" />
          ${kategori}
        </label>
      `).join('')}
    </div>
  `;

    // Mencegah map dari drag saat mouse di atas filter
    L.DomEvent.disableClickPropagation(div);

    return div;
};

filterContainer.addTo(map);
const kategoriMarkers = {};
function addMarkers(maker) {
    for (let a of maker) {
        const lat = a.Location.lat;
        const lng = a.Location.lng;
        const kategori = a.kategoriusaha;
        let random = Math.floor(Math.random() * 1000000);
        let id64 = btoa(a.id);
        let key = btoa(random + "#" + id64 + "#" + btoa(Math.floor(Math.random() * 1000)));
        console.log(key);

        const routeLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        const profileLink = `/umkm/entity/${key}`;

        const popupContent = `
      <h3>${a.badanusaha}</h3><br>
      Kategori: ${kategori}<br><br>
      <a href="${routeLink}" class="btn btn-info mx-1" target="_blank" style="padding: 8px 12px;">
          Lihat Lokasi
      </a>
      <a href="${profileLink}" class="btn btn-info mx-1" target="_blank" style="padding: 8px 12px;">
          Lihat Profile
      </a>
    `;

        let iconUrl = '/asset/img/marker/location-pin.png';
        switch (kategori) {
            case 'Minuman': iconUrl = '/asset/img/marker/miuman.png'; break;
            case 'Makanan': iconUrl = '/asset/img/marker/restaurant.png'; break;
            case 'Fashion': iconUrl = '/asset/img/marker/clothing-shop.png'; break;
            case 'Agribisnis': iconUrl = '/asset/img/marker/glasshouse.png'; break;
            case 'Kerajinan': iconUrl = '/asset/img/marker/Craft.png'; break;
            case 'Jasa': iconUrl = '/asset/img/marker/customer-service.png'; break;
            case 'Perdagangan': iconUrl = '/asset/img/marker/trade.png'; break;
        }

        const marker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl,
                iconSize: [25, 25],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            })
        }).bindPopup(popupContent);

        // if (!kategoriMarkers[kategori]) {
        //     kategoriMarkers[kategori] = L.layerGroup().addTo(map);
        // }

        // kategoriMarkers[kategori].addLayer(marker);
        if (!kategoriMarkers[kategori]) {
            kategoriMarkers[kategori] = L.layerGroup(); // Tidak langsung addTo(map)
        }

        kategoriMarkers[kategori].addLayer(marker);
        markers.addLayer(marker); // Tambahkan ke cluster utama
    }
}
setTimeout(() => {
    document.querySelectorAll('.filter-container input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function () {
            const kategori = this.value;
            if (kategoriMarkers[kategori]) {
                if (this.checked) {
                    kategoriMarkers[kategori].addTo(map);
                } else {
                    map.removeLayer(kategoriMarkers[kategori]);
                }
            }
        });
    });
}, 500);

const searchControl = L.control({ position: 'topleft' });
searchControl.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

    div.innerHTML = `
    <div style="
        background: white;
        padding: 8px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        width: 220px;
    ">
        <input type="text" id="locationInput" placeholder="Cari lokasi umkm / kategori" style="
            width: 100%;
            padding: 6px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 4px;
        "/>
        <button id="searchBtn" style="
            margin-top: 6px;
            width: 100%;
            padding: 6px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        ">Cari</button>
    </div>
    `;

    // Agar map tidak ikut di-drag saat klik input
    L.DomEvent.disableClickPropagation(div);

    return div;
};

searchControl.addTo(map);

setTimeout(() => {
    const searchBtn = document.getElementById('searchBtn');
    const locationInput = document.getElementById('locationInput');
    console.log(dataUMKM);
    let i = 0;
    let maxI = 0;
    if (searchBtn && locationInput) {
        searchBtn.addEventListener('click', () => {
            const query = locationInput.value;

            // if (!query) return;
            let locationFound = dataUMKM.filter(umkm =>
                umkm.badanusaha.toLowerCase().includes(query.toLowerCase()) ||
                umkm.kategoriusaha.toLowerCase().includes(query.toLowerCase())
            );
            if (locationFound.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Lokasi tidak ditemukan.',
                });
                return;
            }
            console.log(locationFound.length);
            if (locationFound.length > 1) {
                i += 1;
                if (i >= locationFound.length) {
                    i = 0;
                }
            } else {
                i = 0;
            }
            console.log(i);
            console.log(locationFound[i]);
            let lat = locationFound[i].Location.lat;
            let lng = locationFound[i].Location.lng;
            map.setView([lat, lng], 18);
        });
    }
}, 500); // Tunggu form masuk ke DOM