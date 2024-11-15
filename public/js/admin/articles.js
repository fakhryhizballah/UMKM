let tabels = $('#artikelTabel').DataTable({
    ajax: {
        url: '/admin/articles'
    },
    columns: [
        {
            data: 'id', render: function (data, type, row, meta) {
                return meta.row + 1;
            }
        },
        {
            data: 'thumbnail', render: function (data, type, row, meta) {
                return '<img src="' + data + '" class="img-thumbnail" width="100" height="100" />';
            }
        },
        { data: 'title' },
        { data: 'description' },
        {
            data: 'id', render: function (data, type, row, meta) {
                return '<button type="button" class="btn btn-sm btn-primary" onclick="editArtikel(' + data + ')">Edit</button> <button type="button" class="btn btn-sm btn-danger" onclick="deleteArtikel(' + data + ')">Delete</button>';
            }
        },
        {
            data: 'status', render: function (data, type, row, meta) {
                return '<button type="button" class="btn btn-sm btn-primary" onclick="updatePublished(' + row.id + ')">' + data + '</button>';
            }
        },

    ]
});

// tabels.ajax.reload();

async function deleteArtikel(id) {
    console.log(id);
    await $.ajax({
        url: '/admin/article/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            tabels.ajax.reload();
        }
    })

}


async function updatePublished(id) {
    tabels.ajax.reload();
    await $.ajax({
        url: '/admin/article/' + id,
        type: 'PUT',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            tabels.ajax.reload();
        }
    })
}