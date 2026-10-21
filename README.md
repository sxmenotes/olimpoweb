# Centro de Eventos Olimpo

Bienvenido al repositorio oficial del Centro de Eventos Olimpo.

## Sobre el Proyecto

Olimpo es una aplicación web estática construida para presentar de forma elegante y sofisticada los servicios, instalaciones y experiencia del centro de eventos más exclusivo de Curicó. Cuenta con un diseño altamente responsivo y un panel de administración CMS para autogestión de contenidos.

## 🚀 Notas de la Versión 1.2.0 (Versión Pública)

¡La página ha sido publicada oficialmente! Las actualizaciones principales de esta versión incluyen:

### Mejoras de UI / UX
- **Experiencia Móvil**: Optimización completa del menú de navegación (hamburguesa) y rediseño de la selección de salones mediante pestañas horizontales para facilitar la visibilidad inmediata.
- **Botones y Formularios**: Ajuste del comportamiento visual de los botones, botones de acción (CTA) orientados a facilitar la reserva vía WhatsApp.
- **Sección Nuestro Sello**: Integración de una nueva sección destacada con diseño asimétrico para resaltar el compromiso de la marca y la imagen de la fundadora.
- **Contacto**: Incorporación de un mapa responsivo nativo de Google Maps integrado directamente en el Footer para mejor referenciación geográfica.

### Panel de Administración (Decap CMS)
- **Reestructuración de Configuración**: Se eliminaron las listas planas en favor de secciones estructuradas lógicamente (Inicio, El Espacio, Servicios, Galería y Nuestro Sello).
- **Galería Dinámica**: Se eliminó la limitación de 22 imágenes, pasando a utilizar un widget de lista dinámica que permite subir, ordenar y eliminar fotografías libremente desde el panel `/admin/`.
- **Sincronización Total**: Todos los textos e imágenes (incluyendo fotos de la fundadora y servicios) ahora son completamente editables por el usuario final a través del CMS, sin necesidad de tocar el código fuente.

## 🚀 Notas de la Versión 1.2.1 (Optimización SEO y Motores de IA)

Esta actualización se centra en mejorar la visibilidad del sitio en motores de búsqueda tradicionales y asistentes de inteligencia artificial:

- **Archivos Raíz para Indexación**: Integración de `robots.txt`, `sitemap.xml` dinámico y `site.webmanifest`. Incorporación del estándar `llms.txt` para optimizar la lectura por parte de ChatGPT, Claude, Perplexity y otros modelos de lenguaje.
- **Metadatos Avanzados**: Implementación completa de etiquetas Open Graph (para redes sociales) y Twitter Cards en el `<head>`.
- **Datos Estructurados (JSON-LD)**: Configuración de esquemas `EventVenue`, `Organization`, `WebSite` y `FAQPage` para enriquecer los resultados de búsqueda con información precisa sobre el negocio, ubicación, contacto y preguntas frecuentes.
- **Favicon y Accesibilidad**: Extracción y optimización del ícono del panteón para uso como favicon en alta resolución, y mejora de los atributos `alt` en imágenes clave para accesibilidad y SEO.

## Estructura de Archivos

La estructura principal del proyecto está organizada de la siguiente manera:

```text
OLIMPO PROP/
├── index.html       # Archivo principal de la aplicación
├── admin/           # Configuración del panel Decap CMS (config.yml)
├── data/            # Base de datos local (content.json)
├── css/             # Hojas de estilo base y variables
│   └── style.css
├── js/              # Lógica interactiva y parseo del CMS
│   ├── main.js
│   └── tailwind-config.js
├── img/             # Recursos multimedia del sitio
└── README.md        # Documentación de la versión actual
```

## Popup de bienvenida

Al ingresar o recargar la página se muestra la promoción de Gala de Graduación 2027–2028, con la imagen original en `img/gala-graduacion-2027-2028.jpeg`. Se puede cerrar con la X, la tecla Escape o al hacer clic fuera del popup. El botón **Agenda tu fecha** cierra la promoción y lleva al formulario `#contacto` con **Graduación** seleccionado.

**Rediseño (2026-10-20):** en escritorio el popup usa dos columnas: la imagen de la gala a la izquierda y, a la derecha, un panel verde oliva oscuro con cuadrícula sutil, etiqueta "Últimas fechas 2027–2028", título en Playfair Display, descripción y botón verde claro. En móvil (menos de 680px) se apila: imagen arriba y contenido abajo. El botón de cierre es circular y flota sobre la esquina, el fondo se difumina y la entrada se anima con CSS y GSAP, respetando la preferencia de movimiento reducido y manteniendo el popup funcional si la librería no carga. Se sirve una copia de GSAP en `js/vendor/gsap.min.js` para que el sitio estático no dependa de `node_modules` al publicarse.

Los textos del panel derecho (etiqueta y descripción) se definen con `::before`/`::after` en `css/style.css`. Para cambiar la promoción, reemplaza la imagen y actualiza su texto alternativo en `index.html`. El popup está definido en `index.html`, sus estilos en `css/style.css` y su comportamiento en `js/main.js`.

## Despliegue

Este repositorio está conectado a Vercel para despliegues automáticos (CI/CD). Cualquier cambio empujado a la rama `main` (incluyendo aquellos hechos por los administradores a través de Decap CMS) iniciará automáticamente un nuevo despliegue del sitio en su versión más reciente.
