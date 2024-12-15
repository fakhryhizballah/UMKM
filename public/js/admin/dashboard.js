let lineChartKategori = $('#lineChartKategori').get(0).getContext('2d');
let datalineChartKategori = new Chart(lineChartKategori, {
    type: "line",
    data: {
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        datasets: [
            {
                label: "Active Users",
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
                data: [
                    542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 900,
                ],
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