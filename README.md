# 🇵🇷 Jibaro Markup Cleaner - Chrome Extension

Una extensión de Chrome poderosa para limpiar HTML, Markdown, citaciones y otros tipos de markup de cualquier texto.

**Creado por jibaroenlaluna**

---

## ✨ Características

- 🎯 **Limpia texto seleccionado** directamente desde cualquier página web
- 🏷️ **Remueve HTML tags** y entidades HTML
- 📝 **Remueve formato Markdown** (bold, italic, headers, links, etc.)
- 📚 **Remueve citaciones** y referencias
- 🔄 **Normaliza espacios** mientras preserva la estructura de párrafos
- 📋 **Copia al clipboard** con un click
- ✏️ **Reemplaza texto** directamente en la página
- 💾 **Guarda preferencias** automáticamente
- 🎨 **Colores de la bandera de Puerto Rico**

---

## 📦 Instalación

### Método 1: Instalación Manual (Desarrollo)

1. **Descarga la extensión**
   - Todos los archivos están en la carpeta `jibaro-chrome-extension`

2. **Genera los iconos**
   - Abre el archivo `icons/create-icons.html` en tu navegador
   - Click en "Generate Icons"
   - Click en "Download All Icons"
   - Guarda los archivos como `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`
   - Colócalos en la carpeta `/icons/`

3. **Instala en Chrome**
   - Abre Chrome y ve a `chrome://extensions/`
   - Activa el "Modo de desarrollador" (Developer mode) en la esquina superior derecha
   - Click en "Cargar extensión sin empaquetar" (Load unpacked)
   - Selecciona la carpeta `jibaro-chrome-extension`
   - ¡Listo! Verás el icono de Jibaro en tu barra de herramientas

### Método 2: Chrome Web Store (Próximamente)
*La extensión estará disponible en el Chrome Web Store pronto.*

---

## 🚀 Cómo Usar

### Opción 1: Limpiar Texto Seleccionado
1. Selecciona texto en cualquier página web
2. Click en el icono de Jibaro en la barra de herramientas
3. Click en "Clean Selected Text"
4. ¡El texto limpio aparece en la ventana!
5. Puedes copiarlo o reemplazar el texto original

### Opción 2: Pegar y Limpiar
1. Click en el icono de Jibaro
2. Pega tu texto en el área de texto
3. Click en "Clean Text"
4. Copia el resultado

### Opción 3: Click Derecho (Context Menu)
1. Selecciona texto en cualquier página
2. Click derecho → "Clean markup from..."
3. El texto se limpia automáticamente

---

## ⚙️ Opciones de Limpieza

Puedes activar/desactivar cada opción según tus necesidades:

- ✅ **Remove HTML tags** - Remueve `<div>`, `<p>`, `<span>`, etc.
- ✅ **Remove Markdown** - Remueve `**bold**`, `*italic*`, `# headers`, etc.
- ✅ **Remove citations** - Remueve `[1]`, `(2020)`, referencias, etc.
- ✅ **Normalize whitespace** - Limpia espacios múltiples pero preserva párrafos

Las preferencias se guardan automáticamente.

---

## 🎨 Ejemplos

### Ejemplo 1: Email con HTML
**Entrada:**
```html
<p>Hi Stephen,</p>
<p>Thanks for sending over both <b>UoM validation files</b>.</p>
<p>I reviewed them with Daniel and we have feedback on each.</p>
```

**Salida:**
```
Hi Stephen,

Thanks for sending over both UoM validation files.

I reviewed them with Daniel and we have feedback on each.
```

### Ejemplo 2: Documento con Markdown
**Entrada:**
```markdown
## UoM Master File - APPROVED

The structure looks good. I see the strategy:

- **INSERT** = new SAP-aligned codes
- **UPDATE** = existing xTuple codes
- **DELETE** = codes we're phasing out
```

**Salida:**
```
UoM Master File - APPROVED

The structure looks good. I see the strategy:

INSERT = new SAP-aligned codes
UPDATE = existing xTuple codes
DELETE = codes we're phasing out
```

### Ejemplo 3: Texto con Citaciones
**Entrada:**
```
This is important information [1] that needs citations (Smith, 2020).
Multiple sources confirm this²³.
```

**Salida:**
```
This is important information that needs citations.
Multiple sources confirm this.
```

---

## 🔧 Estructura de Archivos

```
jibaro-chrome-extension/
├── manifest.json          # Configuración de la extensión
├── popup.html            # Interfaz principal
├── popup.css             # Estilos
├── popup.js              # Lógica de la interfaz
├── content.js            # Script que interactúa con páginas
├── background.js         # Service worker de fondo
├── icons/
│   ├── icon16.png        # Icono 16x16
│   ├── icon32.png        # Icono 32x32
│   ├── icon48.png        # Icono 48x48
│   ├── icon128.png       # Icono 128x128
│   └── create-icons.html # Generador de iconos
└── README.md             # Este archivo
```

---

## 🛠️ Tecnologías Usadas

- **Manifest V3** - La versión más reciente de Chrome Extensions
- **JavaScript Vanilla** - Sin dependencias externas
- **Chrome Storage API** - Para guardar preferencias
- **Chrome Tabs API** - Para interactuar con páginas
- **Content Scripts** - Para acceder al contenido de las páginas

---

## 🔒 Permisos

La extensión requiere los siguientes permisos:

- `activeTab` - Para acceder al texto seleccionado en la pestaña activa
- `clipboardWrite` - Para copiar texto al clipboard
- `storage` - Para guardar tus preferencias

**Nota:** La extensión NO envía datos a ningún servidor. Todo se procesa localmente en tu navegador.

---

## 🐛 Solución de Problemas

### La extensión no aparece
- Verifica que el "Modo de desarrollador" esté activado
- Recarga la extensión en `chrome://extensions/`

### "Clean Selected Text" no funciona
- Asegúrate de tener texto seleccionado en la página
- Algunas páginas con protección especial pueden no permitir acceso
- Intenta usar el método manual (pegar en el área de texto)

### Los iconos no aparecen
- Genera los iconos usando `icons/create-icons.html`
- Asegúrate de que estén en la carpeta `/icons/` con los nombres correctos

### El formato de párrafos se pierde
- Verifica que "Normalize whitespace" esté activado
- El algoritmo preserva párrafos separados por líneas en blanco

---

## 🚀 Próximas Características

- [ ] Atajos de teclado personalizables
- [ ] Más opciones de limpieza (emojis, números, etc.)
- [ ] Presets de configuración (Email, Documentos, Código)
- [ ] Modo oscuro
- [ ] Estadísticas de uso
- [ ] Exportar/Importar configuración

---

## 📝 Changelog

### Version 1.0.0 (2025-01-04)
- ✨ Lanzamiento inicial
- ✅ Limpieza de HTML, Markdown, citaciones
- ✅ Normalización de espacios mejorada
- ✅ Interfaz con colores de Puerto Rico
- ✅ Context menu
- ✅ Guardar preferencias

---

## 👨‍💻 Desarrollo

### Probar localmente
```bash
# 1. Clona o descarga los archivos
# 2. Abre Chrome y ve a chrome://extensions/
# 3. Activa "Modo de desarrollador"
# 4. Click en "Cargar extensión sin empaquetar"
# 5. Selecciona la carpeta jibaro-chrome-extension
```

### Hacer cambios
1. Edita los archivos según necesites
2. Ve a `chrome://extensions/`
3. Click en el botón de "Reload" en la extensión
4. Prueba los cambios

---

## 📄 Licencia

Este proyecto es de código abierto para uso personal y educativo.

---

## 🙏 Créditos

**Creado por jibaroenlaluna**

Inspirado en la necesidad de limpiar texto rápidamente sin perder la estructura.

Colores basados en la bandera de Puerto Rico 🇵🇷

---

## 📧 Contacto y Soporte

Si encuentras algún bug o tienes sugerencias:
- Reporta issues
- Envía feedback
- Comparte con otros Jíbaros

---

## 🎉 ¡Disfruta!

Espero que esta herramienta te sea útil para limpiar texto rápidamente.

**¡Wepa!** 🇵🇷

---

*Made with ❤️ in Puerto Rico*
