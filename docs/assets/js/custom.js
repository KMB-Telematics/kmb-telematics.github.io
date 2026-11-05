/*global jQuery:false */
jQuery(function ($) {
    "use strict";

    // Social icon tooltips in the footer
    $('.social-network li a').tooltip();

    // Play videos only while they are in view, unless the visitor prefers less motion or data
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if ('IntersectionObserver' in window && !reduceMotion && !saveData) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var video = entry.target;
                if (entry.isIntersecting) {
                    // Start once, and resume only if we paused it: a visitor's own pause stays paused.
                    if (!video.dataset.started || video.dataset.pausedOffScreen) {
                        video.dataset.started = 'true';
                        delete video.dataset.pausedOffScreen;
                        var playing = video.play();
                        if (playing) {
                            playing.catch(function () { /* the controls remain available */ });
                        }
                    }
                } else if (video.dataset.started && !video.paused) {
                    video.dataset.pausedOffScreen = 'true';
                    video.pause();
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
