fetch("/api/user/profile", {
    method: "GET",
})
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.data != null) {
            data = data.data;
            $('#user-NIK').text(data.nik);
            $('#user-nama').text(data.fullName);
            $('#user-email').text(data.email);
            $('#user-NoWa').text(data.nowa);
            $('#user-modal').text(data.modal);
            $('#user-alamat').text(data.alamat);
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

function editField(field) {
    Swal.fire({
        title: `Edit ${field}`,
        input: 'text',
        inputValue: document.getElementById(`user-${field}`).textContent,
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        preConfirm: (value) => {
            if (!value) return Swal.showValidationMessage("Tidak boleh kosong");

            // Simpan nilai baru ke UI (bisa juga kirim ke server via fetch)
            document.getElementById(`user-${field}`).textContent = value;

            if (field == 'NIK' || field == 'NoWa' || field == 'modal') {
                if (isNaN(value)) {
                    return Swal.showValidationMessage(field + " harus berupa angka");
                }
            }
            if (field == 'email') {
                if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
                    return Swal.showValidationMessage("Email tidak valid");
                }
            }
            console.log(field);
            console.log(value);

            // Contoh request ke server (opsional)
            return fetch(`/api/user/profile`, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            }).then(res => res.json());

        }
    });
}