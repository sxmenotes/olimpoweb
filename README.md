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

## 🚀 Versión 2.0.0 (Migración a Vite)

El proyecto migró de HTML estático + Tailwind CDN a **Vite 8 + Tailwind CSS 3 (PostCSS) + GSAP vía npm**:

- **Desarrollo con HMR**: `npm run dev` levanta el servidor en `http://localhost:5173` (accesible también desde el celular en la red local).
- **Build optimizado**: `npm run build` genera `dist/` con CSS purgado (~54 kB, ~9 kB gzip) y JS minificado (~85 kB, ~32 kB gzip, GSAP incluido). Ya no se carga el CDN de Tailwind ni la copia de GSAP en `js/vendor`.
- **Previsualizar el build**: `npm run preview`.

| Comando | Descripción |
| --- | --- |
| `npm install` | Instala dependencias (una sola vez) |
| `npm run dev` | Servidor de desarrollo con recarga instantánea |
| `npm run build` | Compila el sitio para producción en `dist/` |
| `npm run preview` | Sirve `dist/` localmente para revisar el build |

> Las rutas `/api/*` (login del CMS) solo funcionan en Vercel o con `vercel dev`; `npm run dev` sirve únicamente el front-end.

## Estructura de Archivos

```text
OLIMPO PROP/
├── index.html           # Entrada principal (Vite)
├── src/
│   ├── main.js          # Lógica interactiva, GSAP y parseo del CMS
│   └── style.css        # Directivas Tailwind + estilos propios
├── public/              # Archivos estáticos servidos tal cual
│   ├── img/             # Recursos multimedia del sitio
│   ├── data/content.json# Contenido editable por Decap CMS
│   ├── admin/           # Panel Decap CMS (index.html + config.yml)
│   └── robots.txt, sitemap.xml, llms.txt, site.webmanifest
├── api/                 # Funciones serverless de Vercel (OAuth del CMS)
├── tailwind.config.js   # Tema (colores, tipografías, espaciado)
├── postcss.config.js
├── vite.config.js
└── simulator.html       # Herramienta local de previsualización móvil (no se publica)
```

## Popup de bienvenida

Al ingresar a la web (primera visita de la sesión, no al recargar) se muestra la promoción de Gala de Graduación 2027–2028, con la imagen original en `img/gala-graduacion-2027-2028.jpeg`. Se puede cerrar con la X, la tecla Escape o al hacer clic fuera del popup. El botón **Agenda tu fecha** cierra la promoción y lleva al formulario `#contacto` con **Graduación** seleccionado.

**Rediseño (2026-10-20):** en escritorio el popup usa dos columnas: la imagen de la gala a la izquierda y, a la derecha, un panel verde oliva oscuro con cuadrícula sutil, etiqueta "Últimas fechas 2027–2028", título en Playfair Display, descripción y botón verde claro. En móvil (menos de 680px) se apila: imagen arriba y contenido abajo. El botón de cierre es circular y flota sobre la esquina, el fondo se difumina y la entrada se anima con CSS y GSAP, respetando la preferencia de movimiento reducido y manteniendo el popup funcional si la librería no carga. GSAP se instala vía npm y se empaqueta con Vite.

Los textos del panel derecho (etiqueta y descripción) se definen con `::before`/`::after` en `src/style.css`. Para cambiar la promoción, reemplaza la imagen y actualiza su texto alternativo en `index.html`. El popup está definido en `index.html`, sus estilos en `src/style.css` y su comportamiento en `src/main.js`.

## Despliegue

Este repositorio está conectado a Vercel para despliegues automáticos (CI/CD). Vercel detecta Vite automáticamente (`npm run build` → `dist/`). Cualquier cambio empujado a la rama `main` (incluyendo aquellos hechos por los administradores a través de Decap CMS) iniciará automáticamente un nuevo despliegue del sitio en su versión más reciente.
