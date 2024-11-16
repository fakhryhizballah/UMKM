console.log("test");

function getCategory() {
    $.ajax({
        url: '/api/article/category',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let data = response.data;
            console.log(data);
            for (let x of data) {
                $('#list-categorie').append(`<li>
                    <div class="d-flex justify-content-between fruite-name">
                    <a href="#" onClick="findCategory('${x.name}')"><i class="fa-regular fa-newspaper me-2"></i>${x.name}</a>
                     <span>(${x.count})</span></div></li>`);
            }
        }
    })
}

getCategory()

async function findCategory(id) {
    $('#topic').text(id);
    $.ajax({
        url: '/api/article/topic/' + id,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            $('#fruite-list').empty();

            let data = response.data;
            for (let x of data) {
                console.log(x);
                $('#fruite-list').append(`<a href="/articles/detail/${x.slug}" class="col-md-6 col-lg-6 col-xl-4">
                                        <div class="rounded position-relative fruite-item border border-secondary border-top-0 rounded-bottom">
                                            <div class="fruite-img">
                                                <img src="${x.thumbnail}" class="img-fluid w-100 rounded-top"
                                                    alt="">
                                            </div>
                                            <div class="p-4 ">
                                                <h4>${x.title}</h4>
                                                <p>${x.description}</p>
                                                <div class="d-flex justify-content-between flex-lg-wrap">
                                                </div>
                                            </div>
                                        </div>
                                    </a>`);
            }
        }
    })
}
findCategory('all')