console.log("test");

function getCategory() {
    $.ajax({
        url: '/api/article/category',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            let data = response.data;
            for (let x of data) {
                $('#list-categorie').append(`<li>
                    <div class="d-flex justify-content-between fruite-name">
                    <a href="article/category/${x.slug}"><i class="fa-regular fa-newspaper me-2"></i>${x.name}</a>
                     <span>(${x.count})</span></div></li>`);
            }
        }
    })
}

// $(document).ready(function () {
getCategory()

// })