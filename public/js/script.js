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
if (token == null) {
    window.location.href = '/login';
}
token = token.split(".")[1];
token = atob(token);
token = JSON.parse(token);
console.log(token);
$('#username_account').text(token.fullName);