let tabels = $('#tabelUMKM').DataTable({
    ajax: {
        url: '/api/admin/allUser',
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
        { data: 'fullName' },
        { data: 'nik' },
        { data: 'nowa' },
        { data: 'email' },
        {
            data: 'password',
            render: function (data, type, row, meta) {
                return `
                    <div class="input-group" style="max-width: 180px;">
                        <input type="password" value="${data}" class="form-control" id="password-${meta.row}" readonly>
                        <button class="btn btn-outline-secondary" type="button" onclick="togglePassword(${meta.row})">
                            <i class="fas fa-eye-slash" id="iconToggle-${meta.row}"></i>
                        </button>
                    </div>
                `;
            }
        },
        {
            data: null,
            render: function (data, type, row) {
                return `<span class="badge ${row.status === '1' ? 'bg-success' : 'bg-danger'}" onClick="toggleStatus('${row.username}', '${row.status}')">${row.status === '1' ? 'Aktif' : 'Tidak Aktif'}</span>`;
            }
        },
        {
            data: 'level',

            render: function (data, type, row) {
                let levelOption = '';
                let selectedLevel = data ? parseInt(data.replace('Level ', '')) : 1; // Default to Level 1 if data is empty
                for (let i = 1; i <= 7; i++) {
                    levelOption += `<option value="Level ${i}" ${selectedLevel === i ? 'selected' : ''}>Level ${i}</option>`;
                }
                return `
                    <select class="form-select" onChange="updateLevel('${row.username}', this.value)">
                        ${levelOption}
                    </select>
                `;
            }
        },
        {
            data: 'createdAt',
            render: function (data, type, row, meta) {
                return new Date(data).toLocaleString('id-ID');
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
function togglePassword(rowIndex) {
    const input = document.getElementById(`password-${rowIndex}`);
    const icon = document.getElementById(`iconToggle-${rowIndex}`);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
}
function toggleStatus(username, status) {
    // console.log(`Toggling status for user ID: ${id}`);
    console.log(username);
    Swal.fire({
        title: 'Konfirmasi',
        text: "Anda yakin ingin mengubah status user menjadi " + (status === '1' ? 'Tidak Aktif' : 'Aktif') + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, ubah status!'
    }).then((result) => {
        if (result.isConfirmed) {
            // console.log(`Mengubah status untuk user: ${username} menjadi ${status === '1' ? 'Tidak Aktif' : 'Aktif'}`);
            $.ajax({
                url: `/api/admin/user/${username}`,
                type: 'PUT',
                success: function (response) {
                    tabels.ajax.reload();
                    Swal.fire({
                        icon: 'success',
                        title: 'Status Berhasil Diubah',
                        showConfirmButton: false,
                        timer: 1500
                    });
                },
                error: function (xhr, status, error) {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal mengubah status',
                        text: xhr.responseText,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
    });
}
function updateLevel(username, level) {
    console.log(`Mengubah level untuk user: ${username} menjadi ${level}`);
    $.ajax({
        url: `/api/admin/userlevel/${username}`,
        type: 'PUT',
        data: { level },
        success: function (response) {
            tabels.ajax.reload();
            Swal.fire({
                icon: 'success',
                title: 'Level Berhasil Diubah',
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (xhr, status, error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal mengubah level',
                text: xhr.responseText,
                showConfirmButton: false,
                timer: 1500
            });
        }
    });

}