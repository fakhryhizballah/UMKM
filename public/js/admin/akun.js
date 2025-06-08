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
        }
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