$("#username").change(function () {
    var username = $("#username").val();
    $.ajax({
        url: "/api/user/username",
        method: "POST",
        data: { username: username },
        success: function (response) {
            console.log(response);
            if (response.data.available) {
                $("#username").removeClass("is-invalid");
                $("#username").addClass("is-valid");
            } else {
                $("#username").removeClass("is-valid");
                $("#username").addClass("is-invalid");
                $("#username").attr("title", "Username sudah digunakan");
            }
        }
    });
});
$("#password2").change(function () {
    var password = $("#password").val();
    var password2 = $("#password2").val();
    if (password != password2) {
        $("#password2").removeClass("is-valid");
        $("#password2").addClass("is-invalid");
        $("#password2").attr("title", "Password tidak sama");

    } else {
        $("#password2").removeClass("is-invalid");
        $("#password2").addClass("is-valid");
    }
});
$("#formRegister").submit(function (event) {
    event.preventDefault();
    $('#btnSubmit').prop('disabled', true);
    var valid = true;
    $(".is-invalid").each(function () {
        valid = false;
    });
    if (!valid) {
        $('#btnSubmit').prop('disabled', false);
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Isi form dengan benar',
        });
        return false;
    }
    let datafrom = {
        username: $('#username').val(),
        fullName: $('#fullName').val(),
        nowa: $('#nowa').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        password2: $('#password2').val()
    }
    console.log(datafrom);
    $.ajax({
        url: "api/user/register",
        type: "POST",
        data: datafrom,
        success: function (response) {
            response = response.data
            $('#btnSubmit').prop('disabled', false);
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.message,
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/login";
                }
            });
        },
        error: function (xhr, status, error) {
            $('#btnSubmit').prop('disabled', false);
            console.log(xhr);
            let pesan = JSON.parse(xhr.responseText);
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: pesan.message,
            });
        }
    });
});
