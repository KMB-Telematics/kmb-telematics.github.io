/*global jQuery:false */
jQuery(function ($) {
    "use strict";

    // Social icon tooltips in the footer
    $('.social-network li a').tooltip();

    // Start videos when they come into view, unless the visitor prefers less motion or data
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if ('IntersectionObserver' in window && !reduceMotion && !saveData) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    var playing = entry.target.play();
                    if (playing) {
                        playing.catch(function () { /* the controls remain available */ });
                    }
                }
            });
        }, { rootMargin: '200px' });
        $('video[data-play-when-visible]').each(function () { observer.observe(this); });
    }

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
