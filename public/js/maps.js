mapboxgl.accessToken = 'pk.eyJ1IjoiZmFraHJ5MSIsImEiOiJja3dlZmFvYzYwNDljMnBub3MwcjBxM2pnIn0.1Vtxn4u-dlSL7nHoFpb3Cw';
const map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/light-v10',
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    // style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    minZoom: 9,
    maxZoom: 18,
    center: [109.331814, -0.026106],
    scrollZoom: true,
    // zoom: 1, // starting zoom
    // projection: 'globe' // display map as a 3D globe

});
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});
// Initialize the GeolocateControl.
const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});
// Add the control to the map.
map.addControl(geolocate);
// Set an event listener that fires
// when a geolocate event occurs.
geolocate.on('geolocate', () => {
    // console.log('A geolocate event has occurred.');
});
function rotate() {
    map.easeTo({
        bearing: 40,
        duration: 10000,
        pitch: 25,
        zoom: 15
    });
}

map.on('load', () => {

    rotate();
    geolocate.trigger();

});
function addMarkers(maker) {
    for (let a of maker) {
        console.log(a);
        var lat = a[0];
        var lng = a[1];
        var nama = "UMKM";
        // var alamat;
        const el = document.createElement('div');
        // var url = json[i].gmaps;
        //  = alamat"<a href='" + url + "'>Buka Maps</a>"

        el.className = 'marker';
        el.style.backgroundImage = `url(https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png)`;
        el.style.width = '35px';
        el.style.height = `35px`;
        el.style.backgroundSize = '100%';

        // el.addEventListener('click', () => {
        //     window.alert(marker.properties.message);
        // });


        // Add markers to the map.
        new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup({
                offset: 25
            })
                .setHTML(
                    "<b>" + nama + "</b>" + "<br />" + "UMKM" + "<br />" + "Jl. Raya Cempaka" + "<br/>"
                )) // sets a popup on this marker
            .addTo(map);
    }


};
let marker = [["-0.044597761869464465", "109.34004293252791"], ["0.9026325440796861", "108.98332074266503"]]

addMarkers(marker);