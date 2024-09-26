$(function () {
    let current = location.pathname;
    $('.nav-item a.nav-link').each(function () {
        let $this = $(this);
        if ($this.attr('href') === current) {
            $this.addClass('active');
        }
    });
});
