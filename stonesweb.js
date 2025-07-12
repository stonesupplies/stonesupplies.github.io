document.addEventListener('DOMContentLoaded', () => {

    // *******************************************************
    // 1. Smooth Scrolling para la Navegación y Activar Enlaces
    // *******************************************************
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

            // Si el objetivo es el modal de política de privacidad, no hacer scroll, solo abrir el modal.
            if (targetId === '#policy-modal-overlay') { // Asegúrate de que el href en tu HTML sea #policy-modal-overlay para el enlace de política
                openPolicyModal();
                // No actualizamos la clase 'active' para los enlaces de anclaje de la política,
                // ya que no son parte de la navegación principal de secciones.
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Actualizar la clase 'active' en la navegación principal
                // Solo para enlaces que son secciones, no para modals o externos
                document.querySelectorAll('.main-nav ul li a').forEach(link => {
                    link.classList.remove('active');
                });
                // Añadir clase 'active' si no es un enlace de modal
                if (!this.classList.contains('modal-link')) { // Asume que tus enlaces de modal tienen una clase 'modal-link'
                    this.classList.add('active');
                }
            }
        });
    });

    // Observador para actualizar la navegación activa al hacer scroll
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    const sectionsToObserve = document.querySelectorAll('main section');

    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // Asegúrate de que el href coincida con el ID de la sección y que no sea un enlace de modal
                    if (link.getAttribute('href') === `#${id}` && !link.classList.contains('modal-link')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50% 0px',
        threshold: 0
    });

    sectionsToObserve.forEach(section => {
        observerNav.observe(section);
    });

    // Establecer la sección "Inicio" como activa por defecto al cargar la página
    if (window.location.hash === '' || window.location.hash === '#') {
        const homeLink = document.querySelector('.main-nav ul li a[href="#intro"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }

    // ************************************************************
    // ** SECCIÓN: GESTIÓN DEL CARRUSEL DE OFERTAS (Reemplaza los enlaces de afiliados de las sidebars) **
    // ************************************************************
    const offers = [
        {
            name: "Oferta Especial: Granito Gris Perla",
            image: "img/granito-gris-perla.jpg", // Asegúrate de que estas rutas sean correctas
            description: "Granito natural de alta resistencia, ideal para encimeras de cocina y baños. Disponible en acabado pulido.",
            affiliateLink: "https://www.google.com/search?q=granito+gris+perla"
        },
        {
            name: "Mármol Blanco Carrara Premium",
            image: "img/marmol-carrara.jpg", // Asegúrate de que estas rutas sean correctas
            description: "Elegante mármol blanco con vetas grises, perfecto para un toque de lujo en cualquier espacio interior.",
            affiliateLink: "https://www.google.com/search?q=marmol+blanco+carrara"
        },
        {
            name: "Piedra Laja para Exteriores",
            image: "img/piedra-laja.jpg", // Asegúrate de que estas rutas sean correctas
            description: "Piedra laja rústica para muros y caminos, duradera y de bajo mantenimiento, ideal para paisajismo.",
            affiliateLink: "https://www.google.com/search?q=piedra+laja+exteriores"
        },
        {
            name: "Cuarzo Compacto Nieve",
            image: "img/cuarzo-nieve.jpg", // Asegúrate de que estas rutas sean correctas
            description: "Superficie de cuarzo no porosa, resistente a manchas y arañazos, ideal para cocinas modernas.",
            affiliateLink: "https://www.google.com/search?q=cuarzo+compacto+nieve"
        }
        // Añade más ofertas aquí si lo deseas
    ];

    let currentOfferIndex = 0;

    const carouselImage = document.getElementById('carousel-offer-image');
    const carouselTitle = document.getElementById('carousel-offer-title');
    const carouselDescription = document.getElementById('carousel-offer-description');
    const carouselAffiliateLink = document.getElementById('carousel-affiliate-link');
    const prevButton = document.getElementById('carousel-prev-btn');
    const nextButton = document.getElementById('carousel-next-btn');
    const carouselContentContainer = document.querySelector('.carousel-content'); // Selector del contenedor principal del contenido

    // Función para mostrar la oferta actual con transición de desvanecimiento
    const showOffer = (index) => {
        if (!carouselImage || !carouselTitle || !carouselDescription || !carouselAffiliateLink || !carouselContentContainer) {
            console.error("Faltan elementos esenciales del carrusel en el HTML. Verifica los IDs y la clase '.carousel-content'.");
            return;
        }

        // Paso 1: Hacer el contenido actual invisible para iniciar la transición de salida
        carouselContentContainer.style.opacity = '0';

        // Paso 2: Esperar un breve momento (300ms) antes de cambiar el contenido.
        // Este tiempo debe ser menor que la duración de la transición CSS (0.5s en este caso)
        setTimeout(() => {
            const offer = offers[index];
            carouselImage.src = offer.image;
            carouselImage.alt = offer.name;
            carouselTitle.textContent = offer.name;
            carouselDescription.textContent = offer.description;
            carouselAffiliateLink.href = offer.affiliateLink;
            carouselAffiliateLink.target = "_blank";
            carouselAffiliateLink.rel = "noopener noreferrer sponsored";

            // Paso 3: Restaurar la opacidad a 1 para iniciar la transición de entrada con el nuevo contenido
            carouselContentContainer.style.opacity = '1';
        }, 300); // Pequeño retraso para que la transición de salida sea visible
    };

    // Lógica para el cambio automático del carrusel
    let autoSlideInterval;
    const slideIntervalTime = 5000; // Cambia cada 5 segundos (5000 milisegundos)

    const startAutoSlide = () => {
        stopAutoSlide(); // Detiene cualquier intervalo existente para evitar que se ejecuten múltiples
        autoSlideInterval = setInterval(() => {
            currentOfferIndex = (currentOfferIndex + 1) % offers.length;
            showOffer(currentOfferIndex);
        }, slideIntervalTime);
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // Reinicia el temporizador de auto-deslizamiento. Se usa cuando el usuario hace clic.
    const resetAutoSlide = () => {
        stopAutoSlide();
        startAutoSlide();
    };

    // Inicializar el carrusel y los event listeners si todos los elementos del DOM están presentes
    if (carouselImage && carouselTitle && carouselDescription && carouselAffiliateLink && prevButton && nextButton && carouselContentContainer) {
        showOffer(currentOfferIndex); // Muestra la primera oferta al cargar la página

        // Configurar event listeners para los botones de navegación
        prevButton.addEventListener('click', () => {
            currentOfferIndex = (currentOfferIndex - 1 + offers.length) % offers.length;
            showOffer(currentOfferIndex);
            resetAutoSlide(); // Reinicia el temporizador automático al hacer clic
        });

        nextButton.addEventListener('click', () => {
            currentOfferIndex = (currentOfferIndex + 1) % offers.length;
            showOffer(currentOfferIndex);
            resetAutoSlide(); // Reinicia el temporizador automático al hacer clic
        });

        // ¡IMPORTANTE! Inicia el carrusel automático al cargar la página
        startAutoSlide();
    }


    // ************************************************************
    // ** FIN SECCIÓN: GESTIÓN DEL CARRUSEL DE OFERTAS **
    // ************************************************************


    // *******************************************************
    // 2. ANIMACIÓN DE ELEMENTOS AL HACER SCROLL (VISIBLE ON SCROLL)
    // *******************************************************
    const sections = document.querySelectorAll('section');

    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });


    // *******************************************************
    // 3. FUNCIONALIDAD DEL MODAL DE DETALLES DE PRODUCTOS
    // *******************************************************
    const modalOverlay = document.getElementById('modal-overlay');
    const closeButton = document.getElementById('close-button');
    const productosGrid = document.getElementById('productos-grid');

    const modalName = document.getElementById('modal-name');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');
    const modalCategory = document.getElementById('modal-category');
    const modalCaracteristicas = document.getElementById('modal-caracteristicas');
    const modalOrigen = document.getElementById('modal-origen');
    const modalUsos = document.getElementById('modal-usos');
    const modalMantenimiento = document.getElementById('modal-mantenimiento');
    const modalProductAffiliateLink = document.getElementById('modal-product-affiliate-link');

    const openProductModal = (product) => {
        if (!modalName || !modalImage || !modalDescription || !modalPrice || !modalCategory || !modalCaracteristicas || !modalOrigen || !modalUsos || !modalMantenimiento || !modalOverlay) {
            console.error("Faltan elementos del modal de producto en el HTML.");
            return;
        }

        modalName.textContent = product.name;
        modalImage.src = product.image;
        modalImage.alt = product.name;
        modalDescription.textContent = product.description;
        modalPrice.textContent = `Precio: ${product.price}`;
        modalCategory.textContent = `Categoría: ${product.category}`;
        modalCaracteristicas.textContent = `Características: ${product.caracteristicas}`;
        modalOrigen.textContent = `Origen: ${product.origen || 'No especificado'}`;
        modalUsos.textContent = `Usos: ${product.usos || 'No especificados'}`;
        modalMantenimiento.textContent = `Mantenimiento: ${product.mantenimiento || 'No especificado'}`;

        // Añadir el enlace de afiliado si existe en los datos del producto
        if (modalProductAffiliateLink) { // Verificar si el elemento existe en el HTML
            if (product.affiliateLink) {
                modalProductAffiliateLink.href = product.affiliateLink;
                modalProductAffiliateLink.style.display = 'inline-block'; // Asegurar que sea visible
                modalProductAffiliateLink.classList.add('affiliate-link');
                modalProductAffiliateLink.target = "_blank";
                modalProductAffiliateLink.rel = "noopener noreferrer sponsored";
            } else {
                modalProductAffiliateLink.style.display = 'none'; // Ocultar si no hay enlace
                modalProductAffiliateLink.classList.remove('affiliate-link');
            }
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeProductModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (productosGrid) {
        productosGrid.addEventListener('click', (event) => {
            if (event.target.classList.contains('boton-ver-mas')) {
                const productDiv = event.target.closest('.producto');
                if (productDiv) {
                    const productData = {
                        id: productDiv.dataset.id,
                        name: productDiv.dataset.name,
                        image: productDiv.dataset.image,
                        description: productDiv.dataset.description,
                        price: productDiv.dataset.price,
                        category: productDiv.dataset.category,
                        caracteristicas: productDiv.dataset.caracteristicas,
                        origen: productDiv.dataset.origen,
                        usos: productDiv.dataset.usos,
                        mantenimiento: productDiv.dataset.mantenimiento,
                        affiliateLink: productDiv.dataset.affiliateLink // Asegúrate de que este dataset exista en tu HTML para los productos
                    };
                    openProductModal(productData);
                }
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeProductModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeProductModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeProductModal();
        }
    });


    // *******************************************************
    // 4. FORMULARIO DE CONTACTO CON ENVÍO A FORMSUBMIT + DATOS EXTRA Y COOKIES
    // *******************************************************
    const contactForm = document.getElementById('contact-form');
    const formSuccessMessage = document.getElementById('form-success-message');

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    }

    if (localStorage.getItem("formularioEnviado") === "true" && formSuccessMessage && contactForm) {
        contactForm.style.display = "none";
        formSuccessMessage.textContent = "✅ Tu cotización ya fue recibida. ¡Gracias por contactarnos!";
        formSuccessMessage.style.display = "block";
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const fechaHora = new Date().toLocaleString();
            const navegador = navigator.userAgent;
            const resolucion = `${window.screen.width}x${window.screen.height}`;
            const cookiesEnabled = navigator.cookieEnabled ? 'Enabled' : 'Disabled';
            const cookieConsent = localStorage.getItem('cookiesAccepted') === 'true' ? 'Aceptadas' : 'No aceptadas / Rechazadas';
            const gaCookie = getCookie('_ga');
            const utmaCookie = getCookie('__utma');
            const allBrowserCookiesString = document.cookie;

            const formData = new FormData(contactForm);

            formData.append('fecha_hora', fechaHora);
            formData.append('navegador', navegador);
            formData.append('resolucion', resolucion);
            formData.append('cookies_enabled', cookiesEnabled);
            formData.append('submission_time', fechaHora);
            formData.append('user_agent', navegador);
            formData.append('screen_resolution', resolucion);
            formData.append('cookie_consent_status', cookieConsent);
            if (gaCookie) formData.append('ga4_client_id', gaCookie);
            if (utmaCookie) formData.append('ua_client_id', utmaCookie);
            formData.append('all_browser_cookies_string', allBrowserCookiesString);


            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const locationString = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
                    formData.append('user_location', locationString);
                    sendForm(formData);
                }, (error) => {
                    console.warn('ERROR de Geolocalización:', error.message);
                    const locationError = 'No disponible o denegada';
                    formData.append('user_location', locationError);
                    sendForm(formData);
                });
            } else {
                const locationNotSupported = 'Geolocalización no soportada';
                formData.append('user_location', locationNotSupported);
                sendForm(formData);
            }
        });
    }

    function sendForm(formData) {
        fetch("https://formsubmit.co/ajax/stonesuppliess@gmail.com", {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success === "true") {
                contactForm.reset();
                if (contactForm) contactForm.style.display = "none";
                if (formSuccessMessage) {
                    formSuccessMessage.textContent = "✅ ¡Mensaje enviado con éxito! Te contactaremos a la brevedad.";
                    formSuccessMessage.style.backgroundColor = "#d4edda";
                    formSuccessMessage.style.color = "#155724";
                    formSuccessMessage.style.display = "block";
                }
                localStorage.setItem("formularioEnviado", "true");
            } else {
                if (formSuccessMessage) {
                    formSuccessMessage.textContent = "❌ Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.";
                    formSuccessMessage.style.backgroundColor = "#f8d7da";
                    formSuccessMessage.style.color = "#721c24";
                    formSuccessMessage.style.display = "block";
                }
            }
        })
        .catch(error => {
            console.error("Error al enviar el formulario:", error);
            if (formSuccessMessage) {
                formSuccessMessage.textContent = "⚠️ Ocurrió un problema de conexión al enviar el formulario.";
                formSuccessMessage.style.backgroundColor = "#fff3cd";
                formSuccessMessage.style.color = "#664d03";
                formSuccessMessage.style.display = "block";
            }
        })
        .finally(() => {
            if (formSuccessMessage) {
                setTimeout(() => {
                    formSuccessMessage.style.display = "none";
                }, 6000);
            }
        });
    }

    // *******************************************************
    // 5. BANNER DE PRIVACIDAD (COOKIES) Y MODAL DE POLÍTICA DE PRIVACIDAD
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
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax";
    }

    const openPolicyModal = () => {
        if (policyModalOverlay) {
            policyModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (privacyBanner && privacyBanner.classList.contains('is-visible')) { // Usar la clase 'is-visible'
                privacyBanner.classList.remove('is-visible'); // Quitar la clase para ocultar con animación
                // Opcional: Asegurarse de que display: none se aplique después de la transición
                setTimeout(() => {
                    privacyBanner.style.display = 'none';
                }, 500); // Coincide con la duración de la transición en CSS
            }
        }
    };

    const closePolicyModal = () => {
        if (policyModalOverlay) {
            policyModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
        if (privacyBanner) {
            // Se usa la clase 'is-visible' para controlar la visibilidad con CSS
            // El display: flex ya está en el CSS para la clase .is-visible
            // Añadir un pequeño retraso para asegurar que DOMContentLoaded ya ejecutó el CSS
            setTimeout(() => {
                privacyBanner.classList.add('is-visible');
            }, 100);
        }
    } else {
        setCookie('user_cookie_consent', 'accepted', 365);
    }

    if (acceptCookiesButton) {
        acceptCookiesButton.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            setCookie('user_cookie_consent', 'accepted', 365);
            if (privacyBanner) {
                privacyBanner.classList.remove('is-visible');
                setTimeout(() => {
                    privacyBanner.style.display = 'none';
                }, 500);
            }
        });
    }

    if (openPolicyModalLink) {
        openPolicyModalLink.addEventListener('click', (e) => {
            e.preventDefault();
            openPolicyModal();
        });
    }

    if (moreInfoPolicyLink) {
        moreInfoPolicyLink.addEventListener('click', (e) => {
            e.preventDefault();
            openPolicyModal();
        });
    }

    if (closePolicyModalButton) {
        closePolicyModalButton.addEventListener('click', closePolicyModal);
    }

    if (policyModalOverlay) {
        policyModalOverlay.addEventListener('click', (event) => {
            if (event.target === policyModalOverlay) {
                closePolicyModal();
            }
        });
    }

    if (acceptPolicyFromModalButton) {
        acceptPolicyFromModalButton.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            setCookie('user_cookie_consent', 'accepted', 365);
            if (privacyBanner) {
                privacyBanner.classList.remove('is-visible');
                setTimeout(() => {
                    privacyBanner.style.display = 'none';
                }, 500);
            }
            closePolicyModal();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && policyModalOverlay && policyModalOverlay.classList.contains('active')) {
            closePolicyModal();
        }
    });

    // *******************************************************
    // 6. Lógica para el Widget de Publicidad Flotante (Antiguo, ahora Carrusel de Ofertas)
    // El bloque anterior de "Lógica para el Widget de Publicidad Flotante" se ha integrado
    // y transformado en la lógica del carrusel de ofertas.
    // Esta sección solo contendrá un comentario para indicar que ya no es un widget flotante separado.
    // *******************************************************
    // NOTA: La funcionalidad de arrastrar y cerrar un widget flotante separado
    // ha sido eliminada, ya que la sección de "Ofertas" ahora se gestiona
    // como un carrusel dentro del flujo normal del contenido o en una barra lateral.
    // Si en el futuro necesitas un widget flotante, se deberá añadir un nuevo bloque de código para ello.

}); // Fin de DOMContentLoaded