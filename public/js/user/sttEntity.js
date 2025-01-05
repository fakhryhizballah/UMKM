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
        {
            data: 'id', render: function (data, type, row, meta) {
                let tombol = '';
                if (row.status == 'pending') {
                    tombol += `<button type="button" class="btn btn-warning" id="btnPendings" onclick="cekStatus(${data})">Pending</button> `;
                } else if (row.status == 'accepted') {
                    tombol += `<button type="button" class="btn btn-success" id="btnAcc" onclick="cekStatus(${data})">Accept</button> `;
                } else if (row.status == 'rejected') {
                    tombol += `<button type="button" class="btn btn-warning" id="btnPendings" onclick="cekStatus(${data})">rejected</button> `;
                }
                return tombol;
            }
        },

    ]
});

function cekStatus(id) {
    $.ajax({
        url: '/api/user/showStatus/' + id,
        type: 'GET',
        success: function (res) {
            console.log(res.data.length)
            $('#modalStatus').modal('show');
            if (res.data.length > 0) {
                for (let e of res.data) {
                    console.log(e);
                    let timedate = new Date(e.createdAt).toLocaleString(
                        'en-GB', {
                        timeZone: 'Asia/Jakarta'
                    }
                    );
                    $('#modalStatus').find('.modal-body').html(`
                    <ol>
                        <li>(${e.status}) ${e.message} | ${timedate}</li>
                    </ol>
                    `);
                }
            }

        }
    });
}