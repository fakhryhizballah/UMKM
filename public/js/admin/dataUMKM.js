let tabels = $('#tabelUMKM').DataTable({
    ajax: {
        url: '/admin/umkm/getEntity',
        type: 'GET',
        dataSrc: function (json) {
            // Proses untuk mengakses data yang diinginkan
            return json.data; // Pastikan `data` adalah array yang digunakan
        },
    },
    columns: [
        {
            data: 'id', render: function (data, type, row, meta) {
                return meta.row + 1;
            }
        },
        { data: 'username' },
        { data: 'nowa' },
        { data: 'email' },
        { data: 'badanusaha' },
        {
            data: 'logousaha', render: function (data, type, row, meta) {
                return '<img src="' + data + '" class="img-thumbnail" width="100" height="100" />';
            }
        },
        { data: 'omzet' },
        { data: 'kategoriusaha' },
        { data: 'levelusaha' },
        { data: 'Location.address' },
        {
            data: 'id', render: function (data, type, row, meta) {
                return '<button type="button" class="btn btn-sm btn-primary" onclick="detailUMKM(' + data + ')">Detail</button> ';
            }
        },
        {
            data: 'Location.status', render: function (data, type, row, meta) {
                if (data == 'accepted') {
                    return '<button type="button" class="btn btn-sm btn-success">' + data + '</button>';
                } else if (data == 'rejected') {
                    return '<button type="button" class="btn btn-sm btn-danger">' + data + '</button>';
                }
                return '<button type="button" class="btn btn-sm btn-warning">' + data + '</button>';
            }
        },
    ],
    processing: true, // Menampilkan indikator loading
    serverSide: false, // Diatur false jika semua data di-load di sisi client
    responsive: true, // Agar responsif
    paging: true, // Pagination
    searching: true, // Search bar
    order: [[0, 'desc']], // Urutan default berdasarkan ID
    error: function (xhr, error, code) {
        console.error('Error:', error, code, xhr.responseText);
    },
});
function detailUMKM(id) {
    let random = Math.floor(Math.random() * 1000000);
    var id64 = btoa(id);
    let key = btoa(random + "#" + id64 + "#" + btoa(Math.floor(Math.random() * 1000)));
    console.log(key);
    window.location.href = "/admin/umkm/entity/" + key;

}