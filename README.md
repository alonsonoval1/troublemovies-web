# TroubleMovies

Sitio web de **TroubleMovies Productions®** — productora audiovisual.
*Historias que valen la pena.*

Single-page estático, cinematográfico y reactivo, construido alrededor del venado (tótem de la marca).

## Stack
HTML + CSS + JavaScript puro (sin build, sin dependencias). Tipografías vía Google Fonts.

## Estructura
```
index.html      Estructura y contenido (bilingüe ES/EN vía data-i18n)
styles.css      Sistema de diseño (oscuro/violeta) y responsive
script.js       Interacciones: linterna del hero, cursor, lightbox, i18n, reveals
assets/         Logo, venado optimizado (webp) y miniaturas de proyectos
```

## Desarrollo local
Los videos de YouTube **requieren servirse por http** (no abras `index.html` como `file://`,
o YouTube devuelve "Error 153").

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Despliegue
Sitio 100% estático. Compatible con cualquier hosting estático (Vercel, Netlify, GitHub Pages).
Sin pasos de build: la raíz del repo es la raíz del sitio.

## Edición rápida
- **Proyectos / portafolio:** array `WORK` en `script.js` (nombre, categoría, ID de YouTube, póster, tamaño).
- **Textos (ES/EN):** objeto `I18N` en `script.js`.
- **Colores y tipografías:** variables `:root` al inicio de `styles.css`.

---
© TroubleMovies Productions®
