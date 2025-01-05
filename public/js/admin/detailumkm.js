console.log("test");
console.log("id" + id);
$.ajax({
    url: '/admin/umkm/getEntity/' + id,
    type: "GET",
    success: function (data) {
        data = data.data;
        for (let x of data.Products) {
            $('#fotoProduk').append(`<div class="carousel-item active">
<img src="${x.url}" class="d-block w-100"
alt="Foto Produk 1" style="height: 200px; object-fit: cover;"
id="fotoProduk${x.id}" name="fotoProduk${x.id}">
</div>`);
        }
        $('#logoUsaha').attr('src', data.logousaha);
        $('#namaUsaha').text(data.badanusaha);
        $('#levelusaha').text(data.levelusaha);
        $('#usernameValue').text(data.username);
        $('#namaValue').text(data.name);
        $('#noWaValue').text(data.nowa);
        $('#emailValue').text(data.email);
        $('#omzetValue').text(data.omzet);
        $('#alamatValue').text(data.Location.address);
        $('#alamatValue').text(data.Location.address);
        $('#deskripsiUsahaValue').text(data.deskripsiusaha);
        $('#deskripsiProdukValue').text(data.deskripsiproduk);
        $('#lokasiUsahaLabel').text(data.Location.vill.name + ', ' + data.Location.dist.name + ', ' + data.Location.regen.name + ', ' + data.Location.prov.name);
        let lat = parseFloat(data.Location.lat);
        let lng = parseFloat(data.Location.lng);
        map.setView([data.Location.lat, data.Location.lng], 17);
        L.marker([lat, lng]).addTo(map)
        switch (data.status) {
            case 'rejected':
                $('#rejectedButton').removeClass('btn-outline-danger').addClass('btn-danger');
                break;
            case 'accepted':
                $('#acceptedButton').removeClass('btn-outline-success').addClass('btn-success');
                break;
            case 'pending':
                $('#pendingButton').removeClass('btn-outline-warning').addClass('btn-warning');
                break;
        }

    },
    error: function (xhr, status, error) {

        console.log(error);
        Swal.fire({
            icon: 'error',
            title: '404',
            text: 'Halaman tidak ditemukan',
        }).then(() => {
            // Redirect ke halaman setelah login berhasil
            window.location.href = '/admin/umkm';
        });
    }
});

const map = L.map('map').setView([-0.04169758550253827, 109.3362421903293], 13);
// navigator.geolocation.getCurrentPosition(function (position) {
//     const lat = position.coords.latitude;
//     const lng = position.coords.longitude;
//     map.setView([lat, lng], 18);
// });

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ''
}).addTo(map);

function handleAction(action) {
    let message = '';
    switch (action) {
        case 'rejected':
            $('#rejectedButton').removeClass('btn-outline-danger').addClass('btn-danger');
            $('#acceptedButton').removeClass('btn-success').addClass('btn-outline-success');
            $('#pendingButton').removeClass('btn-warning').addClass('btn-outline-warning');
            console.log("rejected");
            $('#modalAlasan').modal('show');
            break;
        case 'accepted':
            $('#acceptedButton').removeClass('btn-outline-success').addClass('btn-success');
            $('#rejectedButton').removeClass('btn-danger').addClass('btn-outline-danger');
            $('#pendingButton').removeClass('btn-warning').addClass('btn-outline-warning');
            message = 'Data UKM disetujui';
            break;
        case 'pending':
            $('#pendingButton').removeClass('btn-outline-warning').addClass('btn-warning');
            $('#rejectedButton').removeClass('btn-danger').addClass('btn-outline-danger');
            $('#acceptedButton').removeClass('btn-success').addClass('btn-outline-success');
            message = 'Data UKM ditunda';
            break;
    }
    if (action != 'rejected') {
        $.ajax({
            url: '/admin/umkm/getEntity/' + id,
            type: 'PUT',
            dataType: 'json',
            data: {
                status: action,
                message: message
            },
            success: function (response) {
                console.log(response);
                $('#rejectedButton').prop('disabled', true)
                $('#acceptedButton').prop('disabled', true)
                $('#pendingButton').prop('disabled', true)
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message,
                })
            }
        })
    }
}
function handleActionRejected() {
    let alasan = $('#alasan').val();
    $.ajax({
        url: '/admin/umkm/getEntity/' + id,
        type: 'PUT',
        dataType: 'json',
        data: {
            status: 'rejected',
            message: alasan
        },
        success: function (response) {
            console.log(response);
            $('#rejectedButton').prop('disabled', true)
            $('#acceptedButton').prop('disabled', true)
            $('#pendingButton').prop('disabled', true)
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.message,
            })
        }
    })
}