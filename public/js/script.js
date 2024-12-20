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