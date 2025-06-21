
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Mencegah reload halaman

        // Ambil semua nilai input dari form
        const data = {
            nama: form.querySelector('[placeholder="Nama Anda"]').value,
            alamat_domisili: form.querySelector('[placeholder="Kecamatan, Desa"]').value,
            nama_usaha: form.querySelector('[placeholder="Nama Usaha"]').value,
            legalitas: form.querySelector('[placeholder*="Nomor Induk Berusaha"]').value,
            kontak: form.querySelector('[placeholder="Nomor HP / WA"]').value,
            produk: form.querySelector('[placeholder="Jenis Produk"]').value,
            latar_belakang: form.querySelector('[placeholder="Tuliskan latar belakang..."]').value,
            isi_proposal: form.querySelector('[placeholder="Tuliskan isi proposal..."]').value,
            jenis_bantuan: form.querySelector('[placeholder="Tuliskan jenis bantuan yang dibutuhkan..."]').value,
        };

        try {
            console.log(data);

            const response = await fetch('/api/user/proposal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Proposal berhasil diajukan!',
                    showConfirmButton: false,
                    timer: 1500
                });
                editors['latar_belakang'].setData('');
                editors['isi_proposal'].setData('');
                editors['jenis_bantuan'].setData('');
                form.reset(); // reset form jika sukses
                UpdateTabel();
            } else {
                alert("Gagal mengajukan proposal: " + result.message);
            }
        } catch (error) {
            alert("Terjadi kesalahan: " + error.message);
        }
    });
});

function UpdateTabel () {
    fetch('/api/user/proposal/list')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('proposal-list');
            table.innerHTML = '';
            data.data.forEach((proposal, index) => {
                const row = document.createElement('tr');
                row.classList.add('text-sm');
                row.innerHTML = `
                    <td class="px-4 py-2 border text-center">${index + 1}</td>
                    <td class="px-4 py-2 border" >${proposal.nama}</td>
                    <td class="px-4 py-2 border">${proposal.nama_usaha}</td>
                    <td class="px-4 py-2 border">${proposal.kontak}</td>
                    <td class="px-4 py-2 border">${proposal.produk}</td>
                    <td class="px-4 py-2 border">${proposal.createdAt}</td>
                    <td class="px-4 py-2 border text-center">
                         <button class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs" onClick="detailStatus('${proposal.id}','${proposal.nama_usaha}')">${proposal.riwayat_proposal[0].status}</button>
                    </td>
                    <td class="px-4 py-2 border text-center">
                          <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick="editProposal(${proposal.id})">Edit</button>
                    </td>
                `;
                table.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
UpdateTabel();

async function editProposal(id) {
    try {
        const response = await fetch(`/api/user/proposal/edit/${id}`);
        const data = await response.json();
        console.log(data.data);
        let form = document.querySelector("form");
        form.querySelector('[placeholder="Nama Anda"]').value = data.data.nama;
        form.querySelector('[placeholder="Kecamatan, Desa"]').value = data.data.alamat_domisili;
        form.querySelector('[placeholder="Nama Usaha"]').value = data.data.nama_usaha;
        form.querySelector('[placeholder*="Nomor Induk Berusaha"]').value = data.data.legalitas;
        form.querySelector('[placeholder="Nomor HP / WA"]').value = data.data.kontak;
        form.querySelector('[placeholder="Jenis Produk"]').value = data.data.produk;
        editors['latar_belakang'].setData(data.data.latar_belakang);
        editors['isi_proposal'].setData(data.data.isi_proposal);
        editors['jenis_bantuan'].setData(data.data.jenis_bantuan);

        document.querySelector("#ajukan_proposal").innerHTML = `<button class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm" onClick="updateProposal(${id})">Ubah</button>`;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
}

async function updateProposal(id) {
    let form = document.querySelector("form");
    let data = {
        nama: form.querySelector('[placeholder="Nama Anda"]').value,
        alamat_domisili: form.querySelector('[placeholder="Kecamatan, Desa"]').value,
        nama_usaha: form.querySelector('[placeholder="Nama Usaha"]').value,
        legalitas: form.querySelector('[placeholder*="Nomor Induk Berusaha"]').value,
        kontak: form.querySelector('[placeholder="Nomor HP / WA"]').value,
        produk: form.querySelector('[placeholder="Jenis Produk"]').value,
        latar_belakang: editors['latar_belakang'].getData(),
        isi_proposal: editors['isi_proposal'].getData(),
        jenis_bantuan: editors['jenis_bantuan'].getData(),
    };

    try {
        const response = await fetch(`/api/user/proposal/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Proposal berhasil diubah!',
                showConfirmButton: false,
                timer: 1500
            });
            form.reset();
            editors['latar_belakang'].setData('');
            editors['isi_proposal'].setData('');
            editors['jenis_bantuan'].setData('');
            UpdateTabel();
            document.querySelector("#ajukan_proposal").innerHTML = `<button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                                    Ajukan Proposal
                                 </button>`;

        } else {
            alert("Gagal mengubah proposal: " + result.message);
        }
    } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
    }
    
}

async function detailStatus(id, nama_usaha) {
    console.log(nama_usaha);
    let modalEl = document.getElementById('modalRiwayat');

    document.getElementById('modalRiwayatLabel').textContent = `Riwayat Proposal ${nama_usaha}`;

    // Inisialisasi modal menggunakan Bootstrap Modal API
    let modalRiwayat = new bootstrap.Modal(modalEl);
    try {
        const response = await fetch(`/api/user/proposal/status/${id}`);
        const data = await response.json();
        console.log(data.data);

        const bodyModal = document.getElementById('modalRiwayatBody');
        bodyModal.innerHTML = '';
        data.data.forEach((proposal, index) => {
            const list = document.createElement('ul');
            list.classList.add('list-disc', 'px-6', 'py-2');
            bodyModal.appendChild(list);
            data.data.forEach((proposal, index) => {
                const item = document.createElement('li');
                let dateadd = new Date(proposal.tanggal).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                item.innerHTML = `
                    <div class="flex items-center">
                        <span class="text-sm font-medium">${index + 1}. Status: </span>
                        <span class="text-sm font-semibold ml-1">${proposal.status}</span>
                    </div>
                    <div class="flex items-center mt-1">
                        <span class="text-sm font-medium">Catatan: </span>
                        <span class="text-sm ml-1">${proposal.catatan}</span>
                    </div>
                    <div class="flex items-center mt-1">
                        <span class="text-sm font-medium">Tanggal: </span>
                        <span class="text-sm ml-1">${dateadd}</span>
                    </div>
                `;
                list.appendChild(item);
            });
            
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    // Tampilkan modal
    modalRiwayat.show();
    
}