
$("#formArtikel").submit(function (event) {
    event.preventDefault();
    // $('#btnSubmit').prop('disabled', true);
    if ($('#btnSubmit').text() == 'Update') {
        let datafrom = new FormData();
        datafrom.append('id', $('#id').val());
        datafrom.append('thumbnail', $('#thumbnail')[0].files[0]);
        datafrom.append('title', $('#title').val());
        datafrom.append('description', $('#description').val());
        datafrom.append('content', $('#content').val());
        datafrom.append('label', $('#label').val());
        $.ajax({
            url: "/admin/article/" + $('#id').val(),
            type: "POST",
            data: datafrom,
            processData: false,
            contentType: false,
            success: function (data) {
                tabels.ajax.reload();
                $('#btnSubmit').text('submit');
                if (!data.error) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Data Berhasil Di Update',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    $('#formArtikel')[0].reset();
                    $('#label').val(null).trigger('change');
                    // $('#label').val(null).trigger('change');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.error,
                    })
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseJSON.message);
                // Tampilkan pesan error dari response API menggunakan SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: xhr.responseJSON.message,
                });
            }
        })
        return
    }
    let thumbnail = $('#thumbnail').prop('files')[0];
    if (thumbnail == undefined) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Thumbnail tidak boleh kosong',
        })
        return false;
    }
    console.log(thumbnail.type);
    if (thumbnail.type !== 'image/jpeg' && thumbnail.type !== 'image/png' && thumbnail.type !== 'image/jpg' && thumbnail.type !== 'image/webp') {
        Swal.fire({
            icon: 'warning',
            title: 'File Tidak Valid.',
            text: 'File harus berupa JPG, PNG',
        })
        return false;
    }

    let datafrom = new FormData();
    datafrom.append('thumbnail', $('#thumbnail')[0].files[0]);
    datafrom.append('title', $('#title').val());
    datafrom.append('description', $('#description').val());
    datafrom.append('content', $('#content').val());
    datafrom.append('label', $('#label').val());
    // console.log(datafrom);
    // console.log($('#thumbnail').prop('files')[0]);
    $.ajax({
        url: "/admin/article/add",
        type: "POST",
        data: datafrom,
        mimeType: "multipart/form-data",
        processData: false,
        contentType: false,
        success: function (data) {
            tabels.ajax.reload();
            if (!data.error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Data Berhasil Di Tambahkan',
                    showConfirmButton: false,
                    timer: 1500
                });
                $('#formArtikel')[0].reset();
                $('#label').val(null).trigger('change');
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Data Gagal Di Tambahkan',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
            let pesan = JSON.parse(xhr.responseText);
            // Tampilkan pesan error dari response API menggunakan SweetAlert2
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: pesan.message,
            });
        }
    });
});
async function editArtikel(id) {
    // tabels.ajax.reload();
    // console.log(id);
    $('#label').val(null).trigger('change');
    await $.ajax({
        url: '/admin/article/' + id,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            response = response.data
            // tabels.ajax.reload();
            $('#id').val(response.id);
            $('#title').val(response.title);
            $('#description').val(response.description);
            $('#content').val(response.content);
            for (let x of response.category) {
                let option = new Option(x, x, true, true);
                console.log(option);
                $('#label').append(option).trigger('change');
            }
            // $('#label').val(['aaa']).trigger('change');
            // $('#label').val(response.category).trigger('change');
            $('#btnSubmit').text('Update');
            console.log(response.category);
        }
    })
}
$(document).ready(function () {

    let vauleSelect = $('#label');
    $.ajax({
        url: '/admin/hashtag',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            // console.log(response);

            for (let x of response.data) {
                // Hashtag.push({ id: x.name, text: x.name })
                let option = new Option(x.name, x.name, false, false);
                console.log(option);
                vauleSelect.append(option).trigger('change');

                // // manually trigger the `select2:select` event
                // vauleSelect.trigger({
                //     type: 'select2:select',
                //     params: {
                //         data: data
                //     }
                // });
            }


        }
    })

    $('.js-example-basic-multiple').select2({
        tags: true,
        placeholder: "Tambah Hashtag"
    });
    // $('#label').val(['aaa', 'aaaaa'])
    // $('#label').change(function () {
    //     $(this).val(["aaa", "aaaaa"]);
    //     console.log($(this).val());
    // })
    // $('#label').val("aaaa").trigger('change');


    // $('#label').select2({
    //     insertTag: function (data, tag) {
    //         // Insert the tag at the end of the results
    //         data.push(['aaa', 'aaaaa']);
    //     }
    // });

});