function editFoto() {
    $("#modalEditFoto").modal("show");
}
formEditFoto.addEventListener("submit", function (e) {
    e.preventDefault();
    // editFoto();
    let picture = $('#picture').prop('files')[0];
    if (picture == undefined) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Thumbnail tidak boleh kosong',
        })
        return false;
    }
    console.log(picture);
    console.log($('#picture')[0].files[0]);
    if (picture.type !== 'image/jpeg' && picture.type !== 'image/png' && picture.type !== 'image/jpg' && picture.type !== 'image/webp') {
        Swal.fire({
            icon: 'warning',
            title: 'File Tidak Valid.',
            text: 'File harus berupa JPG, PNG',
        })
        return false;
    }
    let datafrom = new FormData();
    datafrom.append('picture', $('#picture')[0].files[0]);
    fetch("/api/user/pp", {
        method: "POST",
        body: datafrom,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (!data.error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Foto Berhasil Di Ubah',
                    showConfirmButton: false,
                    timer: 1500
                });
                document.cookie = "url_pp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                $('#modalEditFoto').modal('hide');
                location.reload();


            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Foto Gagal Di Ubah',
                    showConfirmButton: false,
                    timer: 1500
                });
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

});