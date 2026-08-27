# Changelog

## [1.2.1] - 2026-08-27

### Added
- Nuevo simulador responsivo para probar vistas de dispositivos móviles (`simulator.html`).
- Animaciones de scroll (`fade-up`) y `IntersectionObserver` ligero para una revelación suave del contenido al navegar.
- Rotaciones lentas y elementos decorativos con efecto de iluminación difuminada (`blur-2xl`) de fondo en el formulario de contacto.
- Patrón de fondo exclusivo con temática del Olimpo (estilo marca de agua 2D) en la sección "El Espacio", aplicado globalmente para optimizar la estética en todas las resoluciones.

### Changed
- Refactorización de la paleta de colores global a un diseño "Dual-Tone" premium (Fondo crema `#f8f7f2` y contrastes verde olivo `#4a5022`).
- Actualización de fotografías de los salones (Olimpo, Apolo, Dionisio) y del banner Hero por nuevas versiones en alta resolución.
- Rediseño del botón Call-to-Action ("Agendar visita") del hero: ahora es verde sólido con rebordes sutiles, mejorando la visibilidad frente a fondos oscuros.
- Actualización de los 9 primeros placeholders de la sección Galería con fotografías reales.
- Se ha re-estilizado la palabra "vida" en el título del Hero para utilizar permanentemente un sutil tono verde claro, manteniéndose en una nueva línea para evitar saltos de layout indeseados.

### Fixed
- Corrección de un bug de estado en las pestañas (Tabs) de "El Espacio", donde el texto perdía contraste al desseleccionarse.
- Corrección de clases de Tailwind eliminadas en tiempo de ejecución (JIT) al insertarlas mediante JavaScript.
- Se eliminaron las pesadas columnas SVG de paralaje en "El Espacio" que generaban desajustes en el viewport de dispositivos móviles, reemplazándose por el nuevo tapiz temático de fondo.
