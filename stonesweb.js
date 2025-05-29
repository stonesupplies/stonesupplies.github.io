document.addEventListener('DOMContentLoaded', () => {

    // *******************************************************
    // 1. FUNCIONALIDAD DEL MODAL DE DETALLES DE PRODUCTOS
    // *******************************************************
    const modalOverlay = document.getElementById('modal-overlay');
    const closeButton = document.getElementById('close-button');
    const productosGrid = document.getElementById('productos-grid');

    // Función para abrir el modal, llenando su contenido con los datos del producto
    const openModal = (product) => {
        document.getElementById('modal-name').textContent = product.name;
        document.getElementById('modal-image').src = product.image;
        document.getElementById('modal-image').alt = product.name; // Asegurar alt text para accesibilidad
        document.getElementById('modal-description').textContent = product.description;
        document.getElementById('modal-price').textContent = `Precio: ${product.price}`;
        document.getElementById('modal-category').textContent = `Categoría: ${product.category}`;
        document.getElementById('modal-caracteristicas').textContent = `Características: ${product.caracteristicas}`;

        modalOverlay.classList.add('active'); // Añade la clase 'active' para mostrar el modal (controlado por CSS)
        document.body.style.overflow = 'hidden'; // Evita el scroll en el body cuando el modal está abierto
    };

    // Función para cerrar el modal
    const closeModal = () => {
        modalOverlay.classList.remove('active'); // Remueve la clase 'active' para ocultar el modal
        document.body.style.overflow = ''; // Restaura el scroll en el body
    };

    // Event Listener para los botones "Ver más detalles" en la cuadrícula de productos
    // Usa delegación de eventos para manejar clics en botones generados dinámicamente o múltiples botones
    productosGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('boton-ver-mas')) {
            const productoDiv = event.target.closest('.producto'); // Encuentra el div padre del producto
            if (productoDiv) {
                // Extrae los datos del producto de los atributos 'data-*' del div
                const productData = {
                    id: productoDiv.dataset.id,
                    name: productoDiv.dataset.name,
                    image: productoDiv.dataset.image,
                    description: productoDiv.dataset.description,
                    price: productoDiv.dataset.price,
                    category: productoDiv.dataset.category,
                    caracteristicas: productoDiv.dataset.caracteristicas
                };
                openModal(productData); // Abre el modal con los datos extraídos
            }
        }
    });

    // Event Listener para el botón de cerrar el modal (la 'X')
    closeButton.addEventListener('click', closeModal);

    // Event Listener para cerrar el modal al hacer clic fuera del contenido del modal (en el overlay)
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) { // Solo si el clic es directamente en el overlay
            closeModal();
        }
    });

    // Event Listener para cerrar el modal con la tecla 'Escape'
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });


    // *******************************************************
    // 2. ANIMACIÓN DE ELEMENTOS AL HACER SCROLL (VISIBLE ON SCROLL)
    // *******************************************************

    // Selecciona todos los elementos que tendrán la animación al entrar en el viewport
    const hiddenElements = document.querySelectorAll('.hidden-element');

    // Configuración para el Intersection Observer
    // threshold: 0.1 significa que la callback se ejecutará cuando el 10% del elemento sea visible
    const observerOptions = {
        root: null, // El viewport es el 'root' (área de observación)
        rootMargin: '0px',
        threshold: 0.1
    };

    // Crea un Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si el elemento es visible en el viewport
                entry.target.classList.add('visible'); // Añade la clase 'visible' para activar la animación CSS
                // Opcional: Para que la animación solo se reproduzca una vez, desconecta el observador
                // observer.unobserve(entry.target);
            } else {
                // Si el elemento sale del viewport, puedes quitar la clase 'visible'
                // Esto hará que la animación se repita si el usuario vuelve a hacer scroll hacia el elemento
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    // Observa cada elemento oculto para la animación
    hiddenElements.forEach(el => observer.observe(el));


    // *******************************************************
    // 3. FUNCIONALIDAD DEL FORMULARIO DE CONTACTO
    // *******************************************************
    const contactForm = document.getElementById('contact-form');
    const formSuccessMessage = document.getElementById('form-success-message');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional (recarga la página)

        // Recolectar datos del formulario
        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // --- INICIO DE LÓGICA DE ENVÍO (SIMULADA SIN BACKEND) ---
        // Para enviar el formulario a un servicio real (ej. Formspree, Netlify Forms, etc.),
        // deberías descomentar y adaptar la sección 'fetch' de abajo.
        // Un formulario HTML no puede enviar correos directamente desde el navegador.

        // Mostrar mensaje de éxito simulado
        formSuccessMessage.textContent = '¡Gracias por tu mensaje! Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto.';
        formSuccessMessage.style.backgroundColor = '#d4edda'; // Color de éxito
        formSuccessMessage.style.color = '#155724'; // Color de texto de éxito
        formSuccessMessage.style.display = 'block'; // Muestra el mensaje

        // Opcional: Resetear el formulario y ocultar el mensaje después de un tiempo
        setTimeout(() => {
            contactForm.reset(); // Limpia los campos del formulario
            formSuccessMessage.style.display = 'none'; // Oculta el mensaje
        }, 5000); // Ocultar después de 5 segundos

        // --- EJEMPLO DE CÓDIGO PARA ENVÍO REAL A UN SERVICIO (DESCOMENTAR Y ADAPTAR) ---
        /*
        fetch('TU_URL_DE_ENDPOINT_API_O_SERVICIO', { // Reemplaza 'TU_URL_DE_ENDPOINT_API_O_SERVICIO'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Envía los datos como JSON
        })
        .then(response => response.json()) // O response.text() si tu API no devuelve JSON
        .then(result => {
            if (result.success) { // Asumiendo que tu API devuelve { success: true } o similar
                formSuccessMessage.textContent = '¡Gracias! Tu mensaje ha sido enviado.';
                formSuccessMessage.style.backgroundColor = '#d4edda';
                formSuccessMessage.style.color = '#155724';
                formSuccessMessage.style.display = 'block';
                contactForm.reset();
            } else {
                formSuccessMessage.textContent = 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.';
                formSuccessMessage.style.backgroundColor = '#f8d7da'; // Color de error
                formSuccessMessage.style.color = '#721c24';
                formSuccessMessage.style.display = 'block';
            }
            setTimeout(() => {
                formSuccessMessage.style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
            formSuccessMessage.textContent = 'Ocurrió un error de red o de servidor. Por favor, inténtalo más tarde.';
            formSuccessMessage.style.backgroundColor = '#f8d7da';
            formSuccessMessage.style.color = '#721c24';
            formSuccessMessage.style.display = 'block';
            setTimeout(() => {
                formSuccessMessage.style.display = 'none';
            }, 5000);
        });
        */
        // --- FIN DE LÓGICA DE ENVÍO REAL ---
    });

});