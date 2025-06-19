
$.ajax({
    url: 'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
        let data = response;
        // prov.push(...data);

        for (let x of data) {
            $('#provinsi').append(`<option value="${x.id}">${x.name}</option>`);
        }
    }
})

fetch("/api/user/profile", {
    method: "GET",
})
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.data != null) {
            data = data.data;
            $('#user-NIK').text(data.nik);
            $('#user-nama').text(data.fullName);
            $('#user-email').text(data.email);
            $('#user-NoWa').text(data.nowa);
            $('#user-modal').text(data.modal);
            $('#user-alamat').text(data.alamat);
            $('#user-betuk_usaha').text(data.betuk_usaha);
            $('#user-ukuran_pasar').text(data.ukuran_pasar);
            $('#user-tahun_berdiri').text(data.tahun_berdiri);
            $('#alamat').val(data.alamat);

            if (data.provinsi != null) {
                $('#provinsi').empty();
                // $('#kabupaten').prop('disabled', false);
                $.ajax({
                    url: 'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json',
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        // let data = response;
                        // prov.push(...data);

                        for (let x of response) {
                            if (x.id == data.provinsi) {
                                $('#provinsi').append(`<option selected value="${x.id}">${x.name}</option>`);
                            } else {
                                $('#provinsi').append(`<option value="${x.id}">${x.name}</option>`);
                            }

                        }
                    }
                })
            }
            if (data.kota != null) {
                $('#kabupaten').prop('disabled', false);
                $('#kabupaten').empty();
                $.ajax({
                    url: 'https://www.emsifa.com/api-wilayah-indonesia/api/regencies/' + data.provinsi + '.json',
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        for (let x of response) {
                            if (x.id == data.kota) {
                                $('#kabupaten').append(`<option selected value="${x.id}">${x.name}</option>`);
                            } else {
                                $('#kabupaten').append(`<option value="${x.id}">${x.name}</option>`);
                            }
                        }
                    }
                })
            }
            if (data.kecamatan != null) {
                $('#kecamatan').prop('disabled', false);
                $('#kecamatan').empty();
                $.ajax({
                    url: 'https://www.emsifa.com/api-wilayah-indonesia/api/districts/' + data.kota + '.json',
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        for (let x of response) {
                            if (x.id == data.kecamatan) {
                                $('#kecamatan').append(`<option selected value="${x.id}">${x.name}</option>`);
                            } else {
                                $('#kecamatan').append(`<option value="${x.id}">${x.name}</option>`);
                            }
                        }
                    }
                })
            }
            if (data.kelurahan != null) {
                $('#kelurahan').prop('disabled', false);
                $('#kelurahan').empty();
                $.ajax({
                    url: 'https://www.emsifa.com/api-wilayah-indonesia/api/villages/' + data.kecamatan + '.json',
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        for (let x of response) {
                            if (x.id == data.kelurahan) {
                                $('#kelurahan').append(`<option selected value="${x.id}">${x.name}</option>`);
                            } else {
                                $('#kelurahan').append(`<option value="${x.id}">${x.name}</option>`);
                            }
                        }
                    }
                })
            }

        }
    })
    .catch(err => {
        console.error(err);
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: err.message || 'Terjadi kesalahan saat mengunggah foto.',
        });
    });

function editField(field) {
    Swal.fire({
        title: `Edit ${field}`,
        input: 'text',
        inputValue: document.getElementById(`user-${field}`).textContent,
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        preConfirm: (value) => {
            if (!value) return Swal.showValidationMessage("Tidak boleh kosong");

            // Simpan nilai baru ke UI (bisa juga kirim ke server via fetch)
            document.getElementById(`user-${field}`).textContent = value;

            if (field == 'NIK' || field == 'NoWa' || field == 'modal' || field == 'tahun_berdiri') {
                if (isNaN(value)) {
                    return Swal.showValidationMessage(field + " harus berupa angka");
                }
            }
            if (field == 'email') {
                if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
                    return Swal.showValidationMessage("Email tidak valid");
                }
            }
            console.log(field);
            console.log(value);

            // Contoh request ke server (opsional)
            return fetch(`/api/user/profile`, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            }).then(res => res.json());

        }
    });
}
function editBentukUsaha(field) {
    Swal.fire({
        title: `Edit ${field}`,
        input: 'select',
        inputOptions: {
            PT: 'PT',
            CV: 'CV',
            Koperasi: 'Koperasi',
            UMKM: 'UMKM'
        },
        inputValue: document.getElementById(`user-${field}`)?.value || '', // 
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        preConfirm: (value) => {
            if (!value) return Swal.showValidationMessage("Tidak boleh kosong");

            // Simpan nilai baru ke UI (bisa juga kirim ke server via fetch)
            document.getElementById(`user-${field}`).textContent = value;

            console.log(field);
            console.log(value);

            // Contoh request ke server (opsional)
            return fetch(`/api/user/profile`, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            }).then(res => res.json());
        }
    });
}
function editUkuranPasar(field) {
    Swal.fire({
        title: `Edit ${field}`,
        input: 'select',
        inputOptions: {
            'Lokal': 'Lokal',
            'Nasional': 'Nasional',
            'Internasional': 'Internasional'
        },
        // inputValue: document.getElementById(`user-${field}`).textContent,
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        preConfirm: (value) => {
            if (!value) return Swal.showValidationMessage("Tidak boleh kosong");

            // Simpan nilai baru ke UI (bisa juga kirim ke server via fetch)
            document.getElementById(`user-${field}`).textContent = value;

            console.log(field);
            console.log(value);

            // Contoh request ke server (opsional)
            return fetch(`/api/user/profile`, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            }).then(res => res.json());
        }
    });
}
$('#provinsi').empty();
$.ajax({
    url: 'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
        for (let x of response) {
            $('#provinsi').append(`<option value="${x.id}">${x.name}</option>`);
        }
    }
})


$('#provinsi').on('change click', function () {
    let id = $(this).val();
    $('#kabupaten').prop('disabled', false);
    $('#kabupaten').empty();
    $.ajax({
        url: 'https://www.emsifa.com/api-wilayah-indonesia/api/regencies/' + id + '.json',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let data = response;
            for (let x of data) {
                $('#kabupaten').append(`<option value="${x.id}">${x.name}</option>`);
            }
        }
    })
})
$('#kabupaten').on('change click', function () {
    let id = $(this).val();
    $('#kecamatan').prop('disabled', false);
    $('#kecamatan').empty();
    $.ajax({
        url: 'https://www.emsifa.com/api-wilayah-indonesia/api/districts/' + id + '.json',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let data = response;
            for (let x of data) {
                $('#kecamatan').append(`<option value="${x.id}">${x.name}</option>`);
            }
        }
    })
})
$('#kecamatan').on('change click', function () {
    let id = $(this).val();
    $('#kelurahan').prop('disabled', false);
    $('#kelurahan').empty();
    $.ajax({
        url: 'https://www.emsifa.com/api-wilayah-indonesia/api/villages/' + id + '.json',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let data = response;
            for (let x of data) {
                $('#kelurahan').append(`<option value="${x.id}">${x.name}</option>`);
            }
        }
    })
})

$('#inputAlamat').submit(function (event) {
    event.preventDefault();
    let datafrom = {
        alamat: $('#alamat').val(),
        provinsi: $('#provinsi').val(),
        kota: $('#kabupaten').val(),
        kecamatan: $('#kecamatan').val(),
        kelurahan: $('#kelurahan').val()
    }
    console.log(datafrom);
    $.ajax({
        url: "/api/user/profile/alamat",
        type: "PUT",
        data: datafrom,
        success: function (response) {
            if (!response.error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Data Berhasil Di Ubah',
                    showConfirmButton: false,
                    timer: 1500
                });
                $('#inputModal').modal('hide');
                updateProfile();
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Data Gagal Di Ubah',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    })
        .catch(err => {
            console.error(err);
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: err.message || 'Terjadi kesalahan saat mengunggah foto.',
            });
        });
})
