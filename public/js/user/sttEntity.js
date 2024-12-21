let tableStatus = $('#tableStatus').DataTable({
    ajax: {
        url: '/api/user/getEntity'
    },
    columns: [
        {
            data: 'id', render: function (data, type, row, meta) {
                return meta.row + 1;
            }
        },
        { data: 'badanusaha' },
        {
            data: 'logousaha', render: function (data, type, row, meta) {
                return '<img src="' + data + '" class="img-thumbnail" width="100" height="100" />';
            }
        },
        { data: 'npwp' },
        { data: 'omzet' },
        { data: 'kategoriusaha' },
        { data: 'levelusaha' },
        { data: 'deskripsiusaha' },
        { data: 'deskripsiproduk' },
        { data: 'status' },

    ]
});