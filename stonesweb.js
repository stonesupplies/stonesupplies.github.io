document.addEventListener('DOMContentLoaded', () => {

    // *******************************************************
    // 1. Smooth Scrolling y navegación activa
    // *******************************************************
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#policy-modal-overlay') {
                e.preventDefault();
                if (targetId === '#policy-modal-overlay') openPolicyModal();
                return;
            }
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                document.querySelectorAll('.main-nav ul li a').forEach(link => link.classList.remove('active'));
                if (!this.classList.contains('modal-link')) this.classList.add('active');
            }
        });
    });

    const navLinks = document.querySelectorAll('.main-nav ul li a');
    const sectionsToObserve = document.querySelectorAll('main section');

    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`)
                        link.classList.add('active');
                });
            }
        });
    }, { root: null, rootMargin: '0px 0px -50% 0px', threshold: 0 });

    sectionsToObserve.forEach(section => observerNav.observe(section));

    // *******************************************************
    // 2. Filtros de productos
    // *******************************************************
    const filtrosBtns = document.querySelectorAll('.filtro-btn');
    const todosProductos = document.querySelectorAll('.producto[data-filtro]');

    filtrosBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filtrosBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filtro = btn.dataset.filtro;

            todosProductos.forEach(prod => {
                if (filtro === 'todos' || prod.dataset.filtro.includes(filtro)) {
                    prod.style.display = '';
                } else {
                    prod.style.display = 'none';
                }
            });

            goTo(0);
        });
    });

    // *******************************************************
    // 3. Carrusel de Productos (AUTO-PLAY)
    // *******************************************************
    const productosGrid = document.getElementById('productos-grid');
    let goTo = () => {};

    if (productosGrid) {
        const productCards = Array.from(productosGrid.querySelectorAll('.producto'));

        if (productCards.length > 0) {
            const wrapper = document.createElement('div');
            wrapper.className = 'productos-carousel-wrapper';

            const track = document.createElement('div');
            track.className = 'productos-carousel-track';
            track.id = 'productosTrack';

            productCards.forEach(card => {
                card.classList.remove('hidden-element');
                track.appendChild(card);
            });

            const btnPrev = document.createElement('button');
            btnPrev.className = 'prod-carousel-btn prod-carousel-prev';
            btnPrev.innerHTML = '&#8592;';
            btnPrev.setAttribute('aria-label', 'Producto anterior');

            const btnNext = document.createElement('button');
            btnNext.className = 'prod-carousel-btn prod-carousel-next';
            btnNext.innerHTML = '&#8594;';
            btnNext.setAttribute('aria-label', 'Producto siguiente');

            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'prod-carousel-dots';

            wrapper.appendChild(btnPrev);
            wrapper.appendChild(track);
            wrapper.appendChild(btnNext);

            productosGrid.innerHTML = '';
            productosGrid.appendChild(wrapper);
            productosGrid.appendChild(dotsContainer);

            let prodIndex = 0;
            let prodAutoplay;

            const getVisibleCount = () => {
                if (window.innerWidth <= 768) return 1;
                if (window.innerWidth <= 992) return 2;
                return 3;
            };

            const getVisibleCards = () => Array.from(track.querySelectorAll('.producto')).filter(c => c.style.display !== 'none');

            const getCardWidth = () => {
                const card = track.querySelector('.producto');
                if (!card) return 320;
                return card.offsetWidth + 16;
            };

            const buildDots = () => {
                dotsContainer.innerHTML = '';
                const visible = getVisibleCount();
                const cards = getVisibleCards();
                const pages = Math.ceil(cards.length / visible);
                for (let i = 0; i < pages; i++) {
                    const dot = document.createElement('span');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => { goTo(i * visible); resetProdAutoplay(); });
                    dotsContainer.appendChild(dot);
                }
            };

            const updateDots = () => {
                const visible = getVisibleCount();
                const pageIndex = Math.floor(prodIndex / visible);
                dotsContainer.querySelectorAll('span').forEach((d, i) => {
                    d.classList.toggle('active', i === pageIndex);
                });
            };

            goTo = (index) => {
                const visible = getVisibleCount();
                const cards = getVisibleCards();
                const maxIndex = Math.max(0, cards.length - visible);
                prodIndex = Math.max(0, Math.min(index, maxIndex));
                track.style.transform = `translateX(-${prodIndex * getCardWidth()}px)`;
                updateDots();
            };

            const nextProd = () => {
                const visible = getVisibleCount();
                const cards = getVisibleCards();
                const newIndex = prodIndex + visible;
                goTo(newIndex >= cards.length ? 0 : newIndex);
            };

            const prevProd = () => {
                const visible = getVisibleCount();
                const cards = getVisibleCards();
                const newIndex = prodIndex - visible;
                goTo(newIndex < 0 ? Math.max(0, cards.length - visible) : newIndex);
            };

            const resetProdAutoplay = () => {
                clearInterval(prodAutoplay);
                prodAutoplay = setInterval(nextProd, 3500);
            };

            btnNext.addEventListener('click', () => { nextProd(); resetProdAutoplay(); });
            btnPrev.addEventListener('click', () => { prevProd(); resetProdAutoplay(); });

            let touchStartX = 0;
            track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
            track.addEventListener('touchend', e => {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) { diff > 0 ? nextProd() : prevProd(); resetProdAutoplay(); }
            }, { passive: true });

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => { buildDots(); goTo(0); }, 200);
            });

            buildDots();
            resetProdAutoplay();
        }
    }

    // *******************************************************
    // 4. COTIZADOR INTEGRADO (calculadora de área + carrito)
    // *******************************************************

    const NOMBRES_MATERIALES = {
        'blanca':        'Piedra Blanca Crystal',
        'negra':         'Piedra Plana Negra de Río',
        'multicolor':    'Piedra Multicolor 2-5 cm',
        'marmol-gris':   'Mármol Jardinero Gris',
        'marmol-blanco': 'Mármol Blanco 6-7 cm',
        'triturado':     'Triturado de Piedra 3/4"',
        'canto':         'Canto Rodado de Río 2-4"',
        'arena':         'Arena de Río y Peña',
        'bola':          'Piedra Bola 4-6"'
    };

    // carrito: array de items para permitir el mismo material varias veces (áreas distintas)
    // cada item: { uid, id, nombre, qty, unidad, precio, area }
    const carrito = [];
    let uidCounter = 0;

    const fmtCOP = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    // Toast de confirmación
    function mostrarToast(msg) {
        let toast = document.getElementById('cot-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cot-toast';
            toast.className = 'cot-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function renderCarrito() {
        const resumen = document.getElementById('cotizador-resumen');
        const badge   = document.getElementById('cot-badge');
        const datosWrap = document.getElementById('cot-datos-wrap');
        if (!resumen) return;

        if (badge) {
            if (carrito.length > 0) { badge.textContent = carrito.length; badge.style.display = 'inline-flex'; }
            else badge.style.display = 'none';
        }
        if (datosWrap) datosWrap.style.display = carrito.length > 0 ? 'block' : 'none';

        if (!carrito.length) {
            resumen.innerHTML = `<div class="cot-resumen-vacio"><i class="fas fa-shopping-basket"></i>Aún no has agregado productos</div>`;
            return;
        }

        let total = 0;
        let html = '';
        carrito.forEach(item => {
            const sub = item.precio * item.qty;
            total += sub;
            const detalleArea = item.area ? ` (${item.area} m²)` : '';
            html += `
                <div class="cot-item" data-uid="${item.uid}">
                    <div class="cot-item-info">
                        <div class="cot-item-nombre">${item.nombre}</div>
                        <div class="cot-item-detalle">${item.qty} ${item.unidad}${detalleArea}</div>
                    </div>
                    <span class="cot-item-precio">${fmtCOP(sub)}</span>
                    <button class="cot-item-eliminar" data-uid="${item.uid}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>`;
        });

        html += `
            <div class="cot-resumen-total">
                <span>Total estimado</span>
                <span class="cot-total-valor">${fmtCOP(total)}</span>
            </div>
            <p class="cot-nota">* Precios aproximados. El equipo confirmará el valor final con transporte si aplica.</p>`;

        resumen.innerHTML = html;

        // Botones eliminar
        resumen.querySelectorAll('.cot-item-eliminar').forEach(btn => {
            btn.addEventListener('click', () => {
                const uid = parseInt(btn.dataset.uid);
                const idx = carrito.findIndex(i => i.uid === uid);
                if (idx !== -1) carrito.splice(idx, 1);
                renderCarrito();
            });
        });
    }

    // ── Calculadora ──
    const calcBtn       = document.getElementById('calc-btn');
    const calcResultado = document.getElementById('calc-resultado');
    const calcAgregarBtn = document.getElementById('calc-agregar-btn');

    let calcEstado = null; // guarda el resultado actual para agregarlo

    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const area    = parseFloat(document.getElementById('calc-area').value);
            const prodVal = document.getElementById('calc-producto').value;

            if (!area || area <= 0 || !prodVal) {
                alert('Por favor ingresa el área y selecciona un material.');
                return;
            }

            const [id, precioStr, rendimientoStr, unidad, tipo] = prodVal.split('|');
            const precio      = parseInt(precioStr);
            const rendimiento = parseFloat(rendimientoStr);

            const cantidadExacta = Math.ceil(area / rendimiento);
            const cantidadExtra  = Math.ceil(cantidadExacta * 1.1);
            const costoExtra     = cantidadExtra * precio;

            document.getElementById('res-cantidad').textContent = `${cantidadExacta} ${unidad}`;
            document.getElementById('res-extra').textContent    = `${cantidadExtra} ${unidad} (+10%)`;
            document.getElementById('res-precio').textContent   = fmtCOP(costoExtra);

            calcEstado = { id, nombre: NOMBRES_MATERIALES[id] || id, qty: cantidadExtra, unidad, precio, area };

            if (calcResultado) calcResultado.style.display = 'block';
        });
    }

    if (calcAgregarBtn) {
        calcAgregarBtn.addEventListener('click', () => {
            if (!calcEstado) return;
            carrito.push({ ...calcEstado, uid: ++uidCounter });
            renderCarrito();
            mostrarToast(`✓ ${calcEstado.nombre} agregado`);
            // Limpiar calculadora
            document.getElementById('calc-area').value = '';
            document.getElementById('calc-producto').selectedIndex = 0;
            if (calcResultado) calcResultado.style.display = 'none';
            calcEstado = null;
            // Scroll suave al carrito
            document.getElementById('cotizador-resumen')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // ── WhatsApp ──
    const cotBtnWa = document.getElementById('cot-btn-wa');
    if (cotBtnWa) {
        cotBtnWa.addEventListener('click', () => {
            if (!carrito.length) { alert('Agrega al menos un producto a tu cotización.'); return; }

            const nombre    = document.getElementById('cot-nombre')?.value.trim();
            const telefono  = document.getElementById('cot-telefono')?.value.trim();
            const direccion = document.getElementById('cot-direccion')?.value.trim();
            const notas     = document.getElementById('cot-notas')?.value.trim();

            let total = 0;
            let msg = '¡Hola Stones Supplies! Me interesa hacer el siguiente pedido:\n\n';
            carrito.forEach(it => {
                const sub = it.precio * it.qty;
                total += sub;
                const areaInfo = it.area ? ` para ${it.area} m²` : '';
                msg += `• ${it.nombre}: ${it.qty} ${it.unidad}${areaInfo} — ${fmtCOP(sub)}\n`;
            });
            msg += `\n*Total estimado: ${fmtCOP(total)}*`;
            if (nombre)    msg += `\n\nNombre: ${nombre}`;
            if (telefono)  msg += `\nTeléfono: ${telefono}`;
            if (direccion) msg += `\nDirección: ${direccion}`;
            if (notas)     msg += `\nNotas: ${notas}`;
            msg += '\n\nPor favor confirmar disponibilidad y detalles de envío. ¡Gracias!';

            window.open('https://wa.me/573178626912?text=' + encodeURIComponent(msg), '_blank');
        });
    }

    // ── Limpiar todo ──
    const cotBtnReset = document.getElementById('cot-btn-reset');
    if (cotBtnReset) {
        cotBtnReset.addEventListener('click', () => {
            carrito.length = 0;
            ['cot-nombre','cot-telefono','cot-direccion','cot-notas'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            renderCarrito();
        });
    }

    // Inicializar carrito vacío
    renderCarrito();

    // *******************************************************
    // 5. Animación de elementos al hacer scroll
    // *******************************************************
    const sections = document.querySelectorAll('section');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { root: null, threshold: 0.1, rootMargin: "0px" });
    sections.forEach(section => scrollObserver.observe(section));

    // *******************************************************
    // 6. Modal de detalles de productos
    // *******************************************************
    const modalOverlay = document.getElementById('modal-overlay');
    const closeButton = document.getElementById('close-button');
    const productosGridEl = document.getElementById('productos-grid');

    const openProductModal = (product) => {
        if (!modalOverlay) return;
        document.getElementById('modal-name').textContent = product.name;
        document.getElementById('modal-image').src = product.image;
        document.getElementById('modal-image').alt = product.name;
        document.getElementById('modal-description').textContent = product.description;
        document.getElementById('modal-price').textContent = product.price;
        document.getElementById('modal-category').textContent = product.category;
        document.getElementById('modal-caracteristicas').textContent = product.caracteristicas;
        document.getElementById('modal-origen').textContent = product.origen || 'No especificado';
        document.getElementById('modal-usos').textContent = product.usos || 'No especificados';
        document.getElementById('modal-mantenimiento').textContent = product.mantenimiento || 'No especificado';

        const waLink = document.getElementById('modal-whatsapp-link');
        if (waLink && product.whatsapp) {
            waLink.href = `https://wa.me/573178626912?text=${product.whatsapp}`;
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeProductModal = () => {
        if (modalOverlay) { modalOverlay.classList.remove('active'); document.body.style.overflow = ''; }
    };

    if (productosGridEl) {
        productosGridEl.addEventListener('click', (event) => {
            if (event.target.classList.contains('boton-ver-mas') || event.target.closest('.boton-ver-mas')) {
                const productDiv = event.target.closest('.producto');
                if (productDiv) {
                    openProductModal({
                        name: productDiv.dataset.name,
                        image: productDiv.dataset.image,
                        description: productDiv.dataset.description,
                        price: productDiv.dataset.price,
                        category: productDiv.dataset.category,
                        caracteristicas: productDiv.dataset.caracteristicas,
                        origen: productDiv.dataset.origen,
                        usos: productDiv.dataset.usos,
                        mantenimiento: productDiv.dataset.mantenimiento,
                        whatsapp: productDiv.dataset.whatsapp
                    });
                }
            }
        });
    }

    if (closeButton) closeButton.addEventListener('click', closeProductModal);
    if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeProductModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) closeProductModal(); });

    // *******************************************************
    // 7. Formulario de contacto
    // *******************************************************
    const contactForm = document.getElementById('contact-form');
    const formSuccessMessage = document.getElementById('form-success-message');

    if (localStorage.getItem("formularioEnviado") === "true" && formSuccessMessage && contactForm) {
        contactForm.style.display = "none";
        formSuccessMessage.textContent = "✅ Tu cotización ya fue recibida. ¡Gracias por contactarnos!";
        formSuccessMessage.style.display = "block";
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(contactForm);
            formData.append('fecha_hora', new Date().toLocaleString());
            formData.append('navegador', navigator.userAgent);
            formData.append('resolucion', `${window.screen.width}x${window.screen.height}`);
            sendForm(formData);
        });
    }

    function sendForm(formData) {
        fetch("https://formsubmit.co/ajax/stonesuppliess@gmail.com", {
            method: "POST", body: formData, headers: { 'Accept': 'application/json' }
        })
        .then(r => r.json())
        .then(data => {
            if (data.success === "true") {
                contactForm.reset();
                contactForm.style.display = "none";
                if (formSuccessMessage) {
                    formSuccessMessage.textContent = "✅ ¡Mensaje enviado con éxito! Te contactaremos a la brevedad.";
                    formSuccessMessage.style.backgroundColor = "#d4edda";
                    formSuccessMessage.style.color = "#155724";
                    formSuccessMessage.style.display = "block";
                }
                localStorage.setItem("formularioEnviado", "true");
            } else {
                if (formSuccessMessage) {
                    formSuccessMessage.textContent = "❌ Hubo un error. Por favor, inténtalo de nuevo.";
                    formSuccessMessage.style.backgroundColor = "#f8d7da";
                    formSuccessMessage.style.color = "#721c24";
                    formSuccessMessage.style.display = "block";
                }
            }
        })
        .catch(() => {
            if (formSuccessMessage) {
                formSuccessMessage.textContent = "⚠️ Problema de conexión al enviar.";
                formSuccessMessage.style.backgroundColor = "#fff3cd";
                formSuccessMessage.style.color = "#664d03";
                formSuccessMessage.style.display = "block";
            }
        })
        .finally(() => {
            if (formSuccessMessage) setTimeout(() => { formSuccessMessage.style.display = "none"; }, 6000);
        });
    }

    // *******************************************************
    // 8. Banner de privacidad y Modal de política
    // *******************************************************
    const privacyBanner = document.getElementById('privacy-banner');
    const acceptCookiesButton = document.getElementById('accept-cookies');
    const policyModalOverlay = document.getElementById('policy-modal-overlay');
    const closePolicyModalButton = document.getElementById('close-policy-modal');
    const openPolicyModalLink = document.getElementById('open-policy-modal');
    const moreInfoPolicyLink = document.getElementById('more-info-policy');
    const acceptPolicyFromModalButton = document.getElementById('accept-policy-from-modal');

    function setCookie(name, value, days) {
        let expires = "";
        if (days) { const d = new Date(); d.setTime(d.getTime() + days * 864e5); expires = "; expires=" + d.toUTCString(); }
        document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
    }

    const openPolicyModal = () => {
        if (policyModalOverlay) {
            policyModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closePolicyModal = () => {
        if (policyModalOverlay) { policyModalOverlay.classList.remove('active'); document.body.style.overflow = ''; }
    };

    if (!localStorage.getItem('cookiesAccepted')) {
        if (privacyBanner) setTimeout(() => { privacyBanner.classList.add('is-visible'); }, 1500);
    } else { setCookie('user_cookie_consent', 'accepted', 365); }

    const acceptAndHideBanner = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        setCookie('user_cookie_consent', 'accepted', 365);
        if (privacyBanner) { privacyBanner.classList.remove('is-visible'); setTimeout(() => { privacyBanner.style.display = 'none'; }, 500); }
    };

    if (acceptCookiesButton) acceptCookiesButton.addEventListener('click', acceptAndHideBanner);
    if (openPolicyModalLink) openPolicyModalLink.addEventListener('click', e => { e.preventDefault(); openPolicyModal(); });
    if (moreInfoPolicyLink) moreInfoPolicyLink.addEventListener('click', e => { e.preventDefault(); openPolicyModal(); });
    if (closePolicyModalButton) closePolicyModalButton.addEventListener('click', closePolicyModal);
    if (policyModalOverlay) policyModalOverlay.addEventListener('click', e => { if (e.target === policyModalOverlay) closePolicyModal(); });
    if (acceptPolicyFromModalButton) acceptPolicyFromModalButton.addEventListener('click', () => { acceptAndHideBanner(); closePolicyModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && policyModalOverlay?.classList.contains('active')) closePolicyModal(); });

}); // Fin DOMContentLoaded
