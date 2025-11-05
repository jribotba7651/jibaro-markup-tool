# 🚀 Guía Rápida - Jibaro Markup Cleaner

## 📥 Instalación en 3 Pasos

### 1️⃣ Genera los Iconos
```
1. Abre: icons/create-icons.html en tu navegador
2. Click: "Generate Icons"
3. Click: "Download All Icons"
4. Guarda los 4 archivos en la carpeta /icons/
```

### 2️⃣ Instala en Chrome
```
1. Abre Chrome → chrome://extensions/
2. Activa: "Modo de desarrollador" (esquina superior derecha)
3. Click: "Cargar extensión sin empaquetar"
4. Selecciona la carpeta: jibaro-chrome-extension
```

### 3️⃣ ¡Listo!
```
Verás el icono de Jibaro en tu barra de herramientas
```

---

## 💡 Cómo Usar (3 Formas)

### Método 1: Texto Seleccionado (Más Rápido)
```
1. Selecciona texto en cualquier página
2. Click en el icono de Jibaro
3. Click "Clean Selected Text"
4. ¡Listo! Copia o reemplaza
```

### Método 2: Pegar Manualmente
```
1. Click en el icono de Jibaro
2. Pega tu texto
3. Click "Clean Text"
4. Copia el resultado
```

### Método 3: Click Derecho
```
1. Selecciona texto
2. Click derecho
3. "Clean markup from..."
```

---

## ⚙️ Opciones

- ✅ **Remove HTML tags** → Quita `<p>`, `<div>`, etc.
- ✅ **Remove Markdown** → Quita `**bold**`, `*italic*`, etc.
- ✅ **Remove citations** → Quita `[1]`, `(2020)`, etc.
- ✅ **Normalize whitespace** → Limpia espacios, preserva párrafos

*Las opciones se guardan automáticamente*

---

## 🎯 Ejemplo con tu Email

**ANTES (con markup):**
```html
<p>Hi Stephen,</p>
<p>Thanks for sending over both <b>UoM validation files</b>.</p>
<p>I reviewed them with Daniel and we have feedback on each.</p>

<p><b>UoM Master File - APPROVED</b> with documentation notes:</p>
```

**DESPUÉS (limpio):**
```
Hi Stephen,

Thanks for sending over both UoM validation files.

I reviewed them with Daniel and we have feedback on each.

UoM Master File - APPROVED with documentation notes:
```

---

## 🆘 Problemas Comunes

### ❌ "No funciona el Clean Selected Text"
**Solución:** Usa el método manual (pegar en el textarea)

### ❌ "No veo los iconos"
**Solución:** Genera los iconos con `icons/create-icons.html`

### ❌ "Se pierden los párrafos"
**Solución:** Verifica que "Normalize whitespace" esté ✅ activado

---

## 🔥 Tips Pro

- **Ctrl + Enter** en el textarea → Limpia el texto automáticamente
- **Guarda las opciones** → Se recuerdan entre sesiones
- **Reemplaza en la página** → Útil para editar directamente
- **Copia al clipboard** → Un solo click para copiar

---

## 📂 Archivos Importantes

```
jibaro-chrome-extension/
├── 📄 manifest.json      ← Configuración principal
├── 🎨 popup.html/css/js  ← Interfaz de usuario
├── 🔧 content.js         ← Interacción con páginas
├── 🖼️ icons/             ← Iconos (generarlos primero)
└── 📖 README.md          ← Documentación completa
```

---

## 🎨 Personalización

Todos los colores están en `popup.css`:
- Azul: `#0050F0`
- Rojo: `#ED0000`

Puedes cambiarlos si quieres personalizar la extensión.

---

## ✨ Características Especiales

1. **Preserva Estructura** → No pierde los párrafos
2. **Offline** → Funciona sin internet
3. **Privado** → Todo se procesa localmente
4. **Rápido** → Procesa miles de caracteres instantáneamente
5. **Puerto Rico 🇵🇷** → Colores de nuestra bandera

---

## 📞 ¿Necesitas Ayuda?

Lee el **README.md** completo para:
- Más ejemplos
- Solución de problemas detallada
- Próximas características
- Información técnica

---

**¡Wepa! Disfruta tu nueva herramienta** 🇵🇷

*created by jibaroenlaluna*
