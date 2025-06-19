$("#formRegister").submit(function (event) {
    event.preventDefault();
    $('#btnSubmit').prop('disabled', true);
    let datafrom = new FormData();
    datafrom.append('badanusaha', $('#badanusaha').val());
    datafrom.append('npwp', $('#npwp').val());
    datafrom.append('nib', $('#nib').val());
    datafrom.append('omzet', $('#omzet').val());
    datafrom.append('kategoriusaha', $('#kategoriusaha').val());
    datafrom.append('logousaha', $('#logousaha')[0].files[0]);
    datafrom.append('deskripsiusaha', $('#deskripsiusaha').val());
    datafrom.append('deskripsiproduk', $('#deskripsiproduk').val());
    datafrom.append('lat', $('#lat').val());
    datafrom.append('lng', $('#lng').val());
    datafrom.append('alamat', $('#alamat').val());
    datafrom.append('prov', $('#prov').val());
    datafrom.append('kota', $('#kota').val());
    datafrom.append('kec', $('#kec').val());
    datafrom.append('kel', $('#kel').val());
    console.log(datafrom);
    let files = $('#fotoproduk')[0].files;

    // Tambahkan semua file ke FormData
    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        datafrom.append('fotoproduk', files[i]);
    }

    $.ajax({
        url: "/api/user/addEntity",
        type: "POST",
        data: datafrom,
        processData: false,
        contentType: false,
        success: function (response) {
            $('#btnSubmit').prop('disabled', false);
            if (response.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message,
                })
            }
            formRegister.reset();
        },
        error: function (xhr, status, error) {
            console.log(xhr);
            $('#btnSubmit').prop('disabled', false);


            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: "Server Error",
            });
        }
    });
});