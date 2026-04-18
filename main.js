(function () {
    "use strict";

    var header = document.querySelector(".js-header");
    var lastY = window.scrollY;
    var navToggle = document.querySelector(".js-nav-toggle");
    var mainNav = document.querySelector(".js-main-nav");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", function () {
            mainNav.classList.toggle("is-open");
            var open = mainNav.classList.contains("is-open");
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });
    }

    function onScroll() {
        var y = window.scrollY;
        if (header) {
            header.classList.toggle("is-scrolled", y > 24);
            if (y > lastY && y > 200) {
                header.classList.add("is-hidden");
            } else {
                header.classList.remove("is-hidden");
            }
        }
        lastY = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var observed = document.querySelectorAll(".js-observe");
    if (observed.length && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) {
                        e.target.classList.add("is-visible");
                        io.unobserve(e.target);
                    }
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
        );
        observed.forEach(function (el) {
            io.observe(el);
        });
    } else {
        observed.forEach(function (el) {
            el.classList.add("is-visible");
        });
    }

    var metric = document.querySelector(".metric-value[data-count]");
    if (metric) {
        var target = parseFloat(metric.getAttribute("data-count"), 10);
        var duration = 1800;
        var start = null;

        function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            metric.textContent = String(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(step);
            else metric.textContent = String(target);
        }

        function runCount() {
            requestAnimationFrame(step);
        }

        if ("IntersectionObserver" in window) {
            var mIo = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (e) {
                        if (e.isIntersecting) {
                            runCount();
                            mIo.disconnect();
                        }
                    });
                },
                { threshold: 0.3 }
            );
            mIo.observe(metric.closest(".hero-card") || metric);
        } else {
            runCount();
        }
    }

    var contactForm = document.getElementById("contact-form");
    var formErrors = document.getElementById("form-errors");
    var formErrorsList = document.getElementById("form-errors-list");
    var contactSuccess = document.getElementById("contact-success");

    function showFormErrors(messages) {
        if (!formErrors || !formErrorsList) return;
        formErrorsList.innerHTML = "";
        messages.forEach(function (msg) {
            var li = document.createElement("li");
            li.textContent = msg;
            formErrorsList.appendChild(li);
        });
        formErrors.hidden = false;
    }

    function clearFormErrors() {
        if (formErrors) formErrors.hidden = true;
    }

    if (contactForm && contactSuccess) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            clearFormErrors();

            var first = (contactForm.querySelector("#first_name") || {}).value;
            first = first ? first.trim() : "";
            var emailEl = contactForm.querySelector("#email");
            var email = emailEl ? emailEl.value.trim() : "";
            var errors = [];

            if (!first) errors.push("First name is required.");
            if (!email || (emailEl && !emailEl.checkValidity())) errors.push("Valid email is required.");

            if (errors.length) {
                showFormErrors(errors);
                return;
            }

            contactForm.style.display = "none";
            contactSuccess.hidden = false;
            contactSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    }
})();
