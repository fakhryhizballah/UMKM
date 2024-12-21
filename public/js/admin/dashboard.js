let lineChartKategori = $('#lineChartKategori').get(0).getContext('2d');
$.ajax({
    url: "/admin/umkm/dashboard/kategori",
    type: "GET",
    success: function (data) {
        console.log(data.data);
        let datalineChartKategori = new Chart(lineChartKategori, {
            type: "line",
            data: {
                labels: data.data.map((item) => item.kategoriusaha),
                datasets: [
                    {
                        label: "Kategori Usaha",
                        borderColor: "#1d7af3",
                        pointBorderColor: "#FFF",
                        pointBackgroundColor: "#1d7af3",
                        pointBorderWidth: 2,
                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 1,
                        pointRadius: 4,
                        backgroundColor: "transparent",
                        fill: true,
                        borderWidth: 2,
                        data: data.data.map((item) => item.count),
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 10,
                        fontColor: "#1d7af3",
                    },
                },
                tooltips: {
                    bodySpacing: 4,
                    mode: "nearest",
                    intersect: 0,
                    position: "nearest",
                    xPadding: 10,
                    yPadding: 10,
                    caretPadding: 10,
                },
                layout: {
                    padding: { left: 15, right: 15, top: 15, bottom: 15 },
                },
            },
        });
    },
});
let lineChartLevel = $('#lineChartLevel').get(0).getContext('2d');
$.ajax({
    url: "/admin/umkm/dashboard/level",
    type: "GET",
    success: function (data) {
        console.log(data.data);
        let datalineChartLevel = new Chart(lineChartLevel, {
            type: "line",
            data: {
                labels: data.data.map((item) => item.levelusaha),
                datasets: [
                    {
                        label: "Level Usaha",
                        borderColor: "#1d7af3",
                        pointBorderColor: "#FFF",
                        pointBackgroundColor: "#1d7af3",
                        pointBorderWidth: 2,
                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 1,
                        pointRadius: 4,
                        backgroundColor: "transparent",
                        fill: true,
                        borderWidth: 2,
                        data: data.data.map((item) => item.count),
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 10,
                        fontColor: "#1d7af3",
                    },
                },
                tooltips: {
                    bodySpacing: 4,
                    mode: "nearest",
                    intersect: 0,
                    position: "nearest",
                    xPadding: 10,
                    yPadding: 10,
                    caretPadding: 10,
                },
                layout: {
                    padding: { left: 15, right: 15, top: 15, bottom: 15 },
                },
            },
        });
    },
});
let lineChartKecamatan = $('#lineChartKecamatan').get(0).getContext('2d');
$.ajax({
    url: "/admin/umkm/dashboard/kecamatan",
    type: "GET",
    success: function (data) {
        console.log(data.data);
        let datalineChartKecamatan = new Chart(lineChartKecamatan, {
            type: "line",
            data: {
                labels: data.data.map((item) => item.Location.dist.name),
                datasets: [
                    {
                        label: "Kategori Usaha",
                        borderColor: "#1d7af3",
                        pointBorderColor: "#FFF",
                        pointBackgroundColor: "#1d7af3",
                        pointBorderWidth: 2,
                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 1,
                        pointRadius: 4,
                        backgroundColor: "transparent",
                        fill: true,
                        borderWidth: 2,
                        data: data.data.map((item) => item.count),
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 10,
                        fontColor: "#1d7af3",
                    },
                },
                tooltips: {
                    bodySpacing: 4,
                    mode: "nearest",
                    intersect: 0,
                    position: "nearest",
                    xPadding: 10,
                    yPadding: 10,
                    caretPadding: 10,
                },
                layout: {
                    padding: { left: 15, right: 15, top: 15, bottom: 15 },
                },
            },
        });
    },
});
let lineChartKabupaten = $('#lineChartKabupaten').get(0).getContext('2d');
$.ajax({
    url: "/admin/umkm/dashboard/kabupaten",
    type: "GET",
    success: function (data) {
        console.log(data.data);
        let datalineChartKabupaten = new Chart(lineChartKabupaten, {
            type: "line",
            data: {
                labels: data.data.map((item) => item.Location.regen.name),
                datasets: [
                    {
                        label: "Kategori Usaha",
                        borderColor: "#1d7af3",
                        pointBorderColor: "#FFF",
                        pointBackgroundColor: "#1d7af3",
                        pointBorderWidth: 2,
                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 1,
                        pointRadius: 4,
                        backgroundColor: "transparent",
                        fill: true,
                        borderWidth: 2,
                        data: data.data.map((item) => item.count),
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 10,
                        fontColor: "#1d7af3",
                    },
                },
                tooltips: {
                    bodySpacing: 4,
                    mode: "nearest",
                    intersect: 0,
                    position: "nearest",
                    xPadding: 10,
                    yPadding: 10,
                    caretPadding: 10,
                },
                layout: {
                    padding: { left: 15, right: 15, top: 15, bottom: 15 },
                },
            },
        });
    },
});
