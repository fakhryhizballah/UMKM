$.ajax({
    url: 'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
        let data = response;
        for (let x of data) {
            $('#prov').append(`<option value="${x.id}">${x.name}</option>`);
        }
    }
})
$('#prov').change(function () {
    let id = $(this).val();
    $('#kota').prop('disabled', false);
    $('#kota').empty();
    $.ajax({
        url: 'https://www.emsifa.com/api-wilayah-indonesia/api/regencies/' + id + '.json',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let data = response;
            for (let x of data) {
                $('#kota').append(`<option value="${x.id}">${x.name}</option>`);
            }
        }
    })
})
$('#kota').change(function () {
    let id = $(this).val();
    $('#kec').prop('disabled', false);
    $('#kec').empty();
    $.ajax({
        url: 'https://www.emsifa.com/api-wilayah-indonesia/api/districts/' + id + '.json',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let data = response;
            for (let x of data) {
                $('#kec').append(`<option value="${x.id}">${x.name}</option>`);
            }
        }
    })
})
$('#kec').change(function () {
    let id = $(this).val();
    $('#kel').prop('disabled', false);
    $('#kel').empty();
    $.ajax({
        url: 'https://www.emsifa.com/api-wilayah-indonesia/api/villages/' + id + '.json',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let data = response;
            for (let x of data) {
                $('#kel').append(`<option value="${x.id}">${x.name}</option>`);
            }
        }
    })
})