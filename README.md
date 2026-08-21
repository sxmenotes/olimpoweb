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

## Despliegue

Este repositorio está conectado a Vercel para despliegues automáticos (CI/CD). Cualquier cambio empujado a la rama `main` (incluyendo aquellos hechos por los administradores a través de Decap CMS) iniciará automáticamente un nuevo despliegue del sitio en su versión más reciente.
