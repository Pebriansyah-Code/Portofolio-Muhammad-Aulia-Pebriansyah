document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar efek "liquid glass" saat di-scroll
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 2. Animasi Scroll Reveal (progressive enhancement)
    //    Section defaultnya SUDAH TAMPIL (lihat style.css).
    //    Kalau IntersectionObserver didukung browser, baru kita
    //    sembunyikan sebentar lalu munculkan lagi pakai animasi
    //    saat di-scroll. Kalau baris ini gagal/error, isi web
    //    tetap kelihatan normal seperti biasa.
    if ('IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll('.scroll-reveal');

        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('reveal-init');
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

        revealElements.forEach(el => {
            el.classList.add('reveal-init'); // baru disembunyikan di sini, setelah observer siap
            revealObserver.observe(el);
        });
    }

    // 3. Animasi hitung angka (counter) untuk bagian statistik
    const statNumbers = document.querySelectorAll('.stat-num');

    const animateCount = (el) => {
        const target = parseInt(el.dataset.target, 10) || 0;
        const suffix = el.dataset.suffix || '+';
        const duration = 1400;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        };

        requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window && statNumbers.length) {
        const counterCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        };

        const counterObserver = new IntersectionObserver(counterCallback, { threshold: 0.4 });

        statNumbers.forEach(el => {
            counterObserver.observe(el);
        });
    }

    // 4. Scroll-spy: otomatis menyalakan link navbar sesuai
    //    section yang sedang dilihat (Tentang / Karya / Kontak)
    const spySections = document.querySelectorAll('section[id]');
    const navLinkMap = {};

    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            navLinkMap[href.substring(1)] = link;
        }
    });

    if ('IntersectionObserver' in window && spySections.length) {
        const spyCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    Object.values(navLinkMap).forEach(link => link.classList.remove('active'));
                    if (navLinkMap[id]) {
                        navLinkMap[id].classList.add('active');
                    }
                }
            });
        };

        // rootMargin ini bikin "zona deteksi" cuma area tengah layar,
        // jadi section yang dianggap "aktif" adalah yang lagi di tengah
        const spyObserver = new IntersectionObserver(spyCallback, {
            rootMargin: "-40% 0px -55% 0px",
            threshold: 0
        });

        spySections.forEach(sec => spyObserver.observe(sec));
    }

});