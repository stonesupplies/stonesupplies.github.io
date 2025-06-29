document.addEventListener('DOMContentLoaded', () => {

    // *******************************************************
    // 1. Smooth Scrolling para la Navegación y Activar Enlaces
    // *******************************************************
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // Si el objetivo es el modal de política de privacidad, no hacer scroll, solo abrir el modal.
            if (targetId === '#policy-modal-overlay') {
                openPolicyModal();
                // No actualizamos la clase 'active' para los enlaces de anclaje de la política,
                // ya que no son parte de la navegación principal de secciones.
                return; 
            }

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Actualizar la clase 'active' en la navegación
                document.querySelectorAll('.main-nav ul li a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
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
                    if (link.getAttribute('href') === `#${id}`) {
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

    const openProductModal = (product) => { // Renombrado a openProductModal para claridad
        modalName.textContent = product.name;
        modalImage.src = product.image;
        modalImage.alt = product.name;
        modalDescription.textContent = product.description;
        modalPrice.textContent = product.price;
        modalCategory.textContent = product.category;
        modalCaracteristicas.textContent = product.caracteristicas;
        modalOrigen.textContent = product.origen || 'No especificado';
        modalUsos.textContent = product.usos || 'No especificados';
        modalMantenimiento.textContent = product.mantenimiento || 'No especificado';

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeProductModal = () => { // Renombrado a closeProductModal
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
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
                        mantenimiento: productDiv.dataset.mantenimiento
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

    // Cerrar modal de producto con la tecla ESC
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

    // Función auxiliar para leer el valor de una cookie por su nombre
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

    // Bloquear formulario si ya se envió (usando localStorage)
    if (localStorage.getItem("formularioEnviado") === "true" && formSuccessMessage && contactForm) {
        contactForm.style.display = "none";
        formSuccessMessage.textContent = "✅ Ya hemos recibido tu cotización. ¡Gracias!";
        formSuccessMessage.style.display = "block";
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(contactForm);

            // Rellenar campos ocultos en el formulario con datos del cliente
            document.getElementById('fecha_hora').value = new Date().toLocaleString();
            document.getElementById('navegador').value = navigator.userAgent;
            document.getElementById('resolucion').value = `${window.screen.width}x${window.screen.height}`;
            
            formData.append('cookies_enabled', navigator.cookieEnabled ? 'Enabled' : 'Disabled');
            formData.append('submission_time', new Date().toLocaleString());
            formData.append('user_agent', navigator.userAgent);
            formData.append('screen_resolution', `${window.screen.width}x${window.screen.height}`);
            
            // Estado del consentimiento de cookies del banner
            const cookieConsent = localStorage.getItem('cookiesAccepted') === 'true' ? 'Aceptadas' : 'No aceptadas / Rechazadas';
            document.getElementById('cookies').value = cookieConsent;
            formData.append('cookie_consent_status', cookieConsent);

            const gaCookie = getCookie('_ga'); 
            if (gaCookie) {
                formData.append('ga4_client_id', gaCookie);
            }

            const utmaCookie = getCookie('__utma'); 
            if (utmaCookie) {
                formData.append('ua_client_id', utmaCookie);
            }

            formData.append('all_browser_cookies_string', document.cookie);

            // Intentar obtener ubicación del usuario (requiere HTTPS y permiso del usuario)
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const locationString = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
                    document.getElementById('ubicacion').value = locationString;
                    formData.append('user_location', locationString);
                    sendForm(formData);
                }, (error) => {
                    console.warn('ERROR de Geolocalización:', error.message);
                    const locationError = 'No disponible o denegada';
                    document.getElementById('ubicacion').value = locationError;
                    formData.append('user_location', locationError);
                    sendForm(formData);
                });
            } else {
                const locationNotSupported = 'Geolocalización no soportada';
                document.getElementById('ubicacion').value = locationNotSupported;
                formData.append('user_location', locationNotSupported);
                sendForm(formData);
            }
        });
    }

    // Función para enviar el formulario a FormSubmit.co
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
                    formSuccessMessage.textContent = "✅ ¡Gracias por tu mensaje! Te responderemos pronto.";
                    formSuccessMessage.style.backgroundColor = "#d4edda";
                    formSuccessMessage.style.color = "#155724";
                    formSuccessMessage.style.display = "block";
                }
                localStorage.setItem("formularioEnviado", "true");
            } else {
                if (formSuccessMessage) {
                    formSuccessMessage.textContent = "❌ Hubo un error al enviar tu mensaje. Intenta nuevamente.";
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

    // Función para establecer una cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax";
    }

    // Función para abrir el modal de política
    const openPolicyModal = () => {
        if (policyModalOverlay) {
            policyModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Evita el scroll en el body
        }
    };

    // Función para cerrar el modal de política
    const closePolicyModal = () => {
        if (policyModalOverlay) {
            policyModalOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restaura el scroll en el body
        }
    };

    // Comprobar si ya se aceptaron las cookies al cargar la página
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
        if (privacyBanner) {
            privacyBanner.style.display = 'flex'; // Mostrar el banner si no hay consentimiento
        }
    } else {
        // Si ya aceptaron, podrías querer registrar esto de alguna forma o simplemente no mostrar el banner.
        // Por ejemplo, asegurar que la cookie de consentimiento esté activa:
        setCookie('user_cookie_consent', 'accepted', 365);
    }

    // Event listener para el botón "Aceptar" del banner
    if (acceptCookiesButton) {
        acceptCookiesButton.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            setCookie('user_cookie_consent', 'accepted', 365); // Establecer cookie de consentimiento
            if (privacyBanner) {
                privacyBanner.style.display = 'none'; // Ocultar el banner
            }
        });
    }

    // Event listener para el enlace "Política de Privacidad" en el footer
    if (openPolicyModalLink) {
        openPolicyModalLink.addEventListener('click', (e) => {
            e.preventDefault(); // Evita el desplazamiento de la página
            openPolicyModal();
        });
    }

    // Event listener para el enlace "Política de Privacidad" dentro del banner
    if (moreInfoPolicyLink) {
        moreInfoPolicyLink.addEventListener('click', (e) => {
            e.preventDefault(); // Evita el desplazamiento de la página
            openPolicyModal();
        });
    }

    // Event listener para el botón "Cerrar" del modal de política
    if (closePolicyModalButton) {
        closePolicyModalButton.addEventListener('click', closePolicyModal);
    }

    // Event listener para el clic fuera del contenido del modal de política
    if (policyModalOverlay) {
        policyModalOverlay.addEventListener('click', (event) => {
            if (event.target === policyModalOverlay) {
                closePolicyModal();
            }
        });
    }

    // Event listener para el botón "Entendido y Aceptar Cookies" dentro del modal de política
    if (acceptPolicyFromModalButton) {
        acceptPolicyFromModalButton.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            setCookie('user_cookie_consent', 'accepted', 365); // Establecer cookie de consentimiento
            if (privacyBanner) {
                privacyBanner.style.display = 'none'; // Asegurarse de que el banner también se oculte
            }
            closePolicyModal(); // Cerrar el modal de política
        });
    }

    // Cerrar modal de política con la tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && policyModalOverlay && policyModalOverlay.classList.contains('active')) {
            closePolicyModal();
        }
    });
});