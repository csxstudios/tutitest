//<![CDATA[
// makes sure the whole site is loaded
$(window).load(function() {
    // will first fade out the loading animation
    $(".logo-animated").fadeOut(1000);
    // will fade out the whole DIV that covers the website.
    $("#preloader").delay(1000).fadeOut(1000);
    $('.delay').each(function (i) {
        $(this).delay((i + 1) * 250).fadeIn(2000);
    });
});

$(document).ready(function () {
    
});
//]]>  