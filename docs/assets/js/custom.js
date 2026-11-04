/*global jQuery:false */
jQuery(function ($) {
    "use strict";

    // Social icon tooltips in the footer
    $('.social-network li a').tooltip();

    // Scroll to top
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });
    $('.scrollup').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 1000);
        return false;
    });
});
