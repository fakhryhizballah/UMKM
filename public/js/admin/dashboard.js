let lineChartKategori = $('#lineChartKategori').get(0).getContext('2d');
const colors = [
    "rgba(255, 99, 132, 0.7)",   // merah
    "rgba(54, 162, 235, 0.7)",   // biru
    "rgba(255, 206, 86, 0.7)",   // kuning
    "rgba(75, 192, 192, 0.7)"    // hijau toska
    ,
    ...Array(20).fill().map((_, i) => `hsla(${Math.random() * 360}, 70%, 60%, 0.7)`)
];
console.log(colors[5]);
$.ajax({
    url: "/admin/umkm/dashboard/kategori",
    type: "GET",
    success: function (data) {
        console.log(typeof (parseInt(data.data[0].count)));
        let datalineChartKategori = new Chart(lineChartKategori, {
            type: "bar",
            data: {
                labels: data.data.map((item) => item.kategoriusaha),
                datasets: [
                    {
                        backgroundColor: colors.slice(0, data.data.length),
                        data: data.data.map((item) => item.count)
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: "top",
                    display: true,
                    labels: {
                        generateLabels: function (chart) {
                            return chart.data.labels.map((label, index) => {
                                return {
                                    text: label,
                                    fillStyle: chart.data.datasets[0].backgroundColor[index],
                                    hidden: false,
                                    index: index,
                                    fontColor: "#1d7af3",
                                };
                            });
                        },
                        padding: 10,
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            generateLabels: function (chart) {
                                const dataset = chart.data.datasets[0];
                                return chart.data.labels.map((label, index) => ({
                                    text: label,
                                    fillStyle: dataset.backgroundColor[index],
                                    strokeStyle: dataset.backgroundColor[index],
                                    lineWidth: 1,
                                    hidden: false,
                                    index: index
                                }));
                            },
                            padding: 10,
                            color: "#1d7af3" // menggantikan fontColor
                        }
                    }
                },
                layout: {
                    padding: { left: 15, right: 15, top: 15, bottom: 15 },
                },
                scales: {
                    y: {
                        min: 0,
                        ticks: {
                            stepSize: 1
                        }
                    },
                    x: {
                        ticks: {
                            autoSkip: false
                        }
                    }
                }
            },
        });
    },
});
let lineChartLevel = $('#lineChartLevel').get(0).getContext('2d');
$.ajax({
    url: "/admin/umkm/dashboard/level",
    type: "GET",
    success: function (data) {
        // console.log(data.data);
        let datalineChartLevel = new Chart(lineChartLevel, {
            type: "bar",
            data: {
                labels: data.data.map((item) => item.levelusaha),
                datasets: [
                    {
                        backgroundColor: colors.slice(0, data.data.length),
                        data: data.data.map((item) => item.count)
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        generateLabels: function (chart) {
                            const dataset = chart.data.datasets[0];
                            console.log(dataset);
                            return chart.data.labels.map((label, index) => ({
                                text: label,
                                fillStyle: dataset.backgroundColor[index],
                                strokeStyle: dataset.backgroundColor[index],
                                lineWidth: 1,
                                hidden: false,
                                index: index
                            }));
                        },
                        padding: 10,
                        color: "#1d7af3" // menggantikan fontColor
                    }
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
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            generateLabels: function (chart) {
                                const dataset = chart.data.datasets[0];
                                return chart.data.labels.map((label, index) => ({
                                    text: label,
                                    fillStyle: dataset.backgroundColor[index],
                                    strokeStyle: dataset.backgroundColor[index],
                                    lineWidth: 1,
                                    hidden: false,
                                    index: index
                                }));
                            },
                            padding: 10,
                            color: "#1d7af3" // menggantikan fontColor
                        }
                    }
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
        // console.log(data.data);
        let datalineChartKecamatan = new Chart(lineChartKecamatan, {
            type: "bar",
            data: {
                labels: data.data.map((item) => item.Location.dist.name),
                datasets: [
                    {
                        backgroundColor: colors.slice(0, data.data.length),
                        data: data.data.map((item) => item.count)
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
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            generateLabels: function (chart) {
                                const dataset = chart.data.datasets[0];
                                return chart.data.labels.map((label, index) => ({
                                    text: label,
                                    fillStyle: dataset.backgroundColor[index],
                                    strokeStyle: dataset.backgroundColor[index],
                                    lineWidth: 1,
                                    hidden: false,
                                    index: index
                                }));
                            },
                            padding: 10,
                            color: "#1d7af3" // menggantikan fontColor
                        }
                    }
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
        // console.log(data.data);
        let datalineChartKabupaten = new Chart(lineChartKabupaten, {
            type: "bar",
            data: {
                labels: data.data.map((item) => item.Location.regen.name),
                datasets: [
                    {
                        backgroundColor: colors.slice(0, data.data.length),
                        data: data.data.map((item) => item.count)
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
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            generateLabels: function (chart) {
                                const dataset = chart.data.datasets[0];
                                return chart.data.labels.map((label, index) => ({
                                    text: label,
                                    fillStyle: dataset.backgroundColor[index],
                                    strokeStyle: dataset.backgroundColor[index],
                                    lineWidth: 1,
                                    hidden: false,
                                    index: index
                                }));
                            },
                            padding: 10,
                            color: "#1d7af3" // menggantikan fontColor
                        }
                    }
                },
            },
        });
    },
});
