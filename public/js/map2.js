// Inisialisasi Peta
const map = L.map('map').setView([-0.04169758550253827, 109.3362421903293], 10);
// Mendapatkan Lokasi Sekarang
// navigator.geolocation.getCurrentPosition(function (position) {
//     const lat = position.coords.latitude;
//     const lng = position.coords.longitude;
//     map.setView([lat, lng], 18);
// });
console.log('Search Plugin:', L.Control.Search);
fetch('https://api.spairum.my.id/api/cdn/file/geoBoundaries-IDN-ADM2_simplified.geojson')
    .then(res => res.json())
    .then(data => {
        console.log(data.features);
        const geoLayer = L.geoJSON(data, {
            // filter: f => f.properties.shapeName === 'Kubu Raya',
            // filter: f => f.properties.shapeName === 'Kota Pontianak',
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

        // Search Control
        const searchControl = new L.Control.Search({
            layer: geoLayer,
            propertyName: 'shapeName',
            marker: false,
            moveToLocation: (latlng, title, map) => {
                map.setView(latlng, 12);
            }
        });

        map.addControl(searchControl);
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

// function addMarkers(maker) {
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
//         else if (a.kategoriusaha === 'Pakaian') {
//             icon.iconUrl = '/asset/img/marker/clothing-shop.png';
//         }
//         else if (a.kategoriusaha === 'Elektronik') {
//             icon.iconUrl = '/asset/img/marker/elektonik.png';
//         }
//         else if (a.kategoriusaha === 'Kerajinan') {
//             icon.iconUrl = '/asset/img/marker/Craft.png';
//         }
//         else if (a.kategoriusaha === 'Aksesoris') {
//             icon.iconUrl = '/asset/img/marker/Accessories.png';
//         }
//         else if (a.kategoriusaha === 'Kosmetik') {
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
        'Minuman': '/asset/img/marker/location-pink.png',
        'Makanan': '/asset/img/marker/location-purple.png',
        'Pakaian': '/asset/img/marker/location-red.png',
        'Elektronik': '/asset/img/marker/location-yellow.png',
        'Kerajinan': '/asset/img/marker/location-blue.png',
        'Aksesoris': '/asset/img/marker/location-sea.png',
        'Kosmetik': '/asset/img/marker/location-green.png',
        'Furniture': '/asset/img/marker/location-orange.png'
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

        const routeLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        const profileLink = `/umkm/entity/${btoa(a.id)}`;

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
            case 'Minuman': iconUrl = '/asset/img/marker/location-pink.png'; break;
            case 'Makanan': iconUrl = '/asset/img/marker/location-purple.png'; break;
            case 'Pakaian': iconUrl = '/asset/img/marker/location-red.png'; break;
            case 'Elektronik': iconUrl = '/asset/img/marker/location-yellow.png'; break;
            case 'Kerajinan': iconUrl = '/asset/img/marker/location-blue.png'; break;
            case 'Aksesoris': iconUrl = '/asset/img/marker/location-sea.png'; break;
            case 'Kosmetik': iconUrl = '/asset/img/marker/location-green.png'; break;
            case 'Furniture': iconUrl = '/asset/img/marker/location-orange.png'; break;
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