$(function () {
    let current = location.pathname;
    // console.log(current);
    $('.nav-item ').each(function () {
        // console.log($(this));
        let $this = $(this);
        if ($this.attr('href') === current) {
            $this.addClass('active');
        }
    });
});
function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

let token = getCookie("token");
let url_pp = getCookie("url_pp");
url_pp = decodeURIComponent(url_pp);
if (url_pp === "undefined" || url_pp === "null") {
    url_pp = "/asset/img/profile.png";
}
$('#profile_picture').attr('src', url_pp);
// if (token == null) {
//     if (location.pathname !== '/login') {
//         window.location.href = '/login';
//     }
//     // console.log(location.pathname);
// }
token = token.split(".")[1];
token = atob(token);
token = JSON.parse(token);
$('#username_account').text(token.fullName);