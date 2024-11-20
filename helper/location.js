let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://10.8.0.4:9080/api/bpjs/peserta/getfinger?Tglpelayanan=2024-11-19&Nokartu=0002421395469',
    headers: {}
};

axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
        console.log(error);
    });