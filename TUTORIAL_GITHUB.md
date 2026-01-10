# 📤 Tutorial Completo: Subir Proyecto a GitHub
## Para Principiantes Absolutos - Paso a Paso

Guía **súper detallada** para subir tu proyecto completo a GitHub desde cero.

**⚠️ IMPORTANTE:** Esta guía está escrita para personas que nunca han usado GitHub. Si no entiendes algo, léelo de nuevo hasta que lo entiendas.

---

## 📚 ¿Qué es GitHub?

**GitHub** es como "Dropbox" pero para código. Es un lugar en internet donde puedes guardar todo tu código y tenerlo respaldado. También permite que otras personas vean tu código (si quieres) y trabajar en equipo.

**Piénsalo así:**
- Tu ordenador = Tu habitación (solo tú ves tu código)
- GitHub = Un almacén compartido (todos pueden verlo si lo permites)

---

## ✅ ¿Qué necesitas antes de empezar?

Antes de seguir esta guía, necesitas:

- [ ] Un ordenador con Windows (estás en Windows, así que perfecto)
- [ ] Una cuenta de GitHub (si no la tienes, te enseñaré a crearla)
- [ ] Git instalado en tu ordenador (te enseñaré cómo instalarlo)
- [ ] Tu proyecto completo (frontend y backend)

**Tiempo estimado:** 30-60 minutos si es tu primera vez.

---

## 📋 Índice

1. [Paso 1: Crear cuenta en GitHub](#1-paso-1-crear-cuenta-en-github)
2. [Paso 2: Instalar Git en tu ordenador](#2-paso-2-instalar-git-en-tu-ordenador)
3. [Paso 3: Preparar tu proyecto](#3-paso-3-preparar-tu-proyecto)
4. [Paso 4: Crear repositorio en GitHub](#4-paso-4-crear-repositorio-en-github)
5. [Paso 5: Conectar tu ordenador con GitHub](#5-paso-5-conectar-tu-ordenador-con-github)
6. [Paso 6: Subir tu código a GitHub](#6-paso-6-subir-tu-código-a-github)
7. [Paso 7: Verificar que todo está subido](#7-paso-7-verificar-que-todo-está-subido)
8. [Solución de Problemas](#8-solución-de-problemas)

---

## 1. Paso 1: Crear cuenta en GitHub

### ¿Qué vamos a hacer?

Vamos a crear una cuenta gratuita en GitHub.

### Paso 1.1: Ir a GitHub

**Paso 1.1.1:** Abre tu navegador web (Chrome, Firefox, Edge, etc.).

**Paso 1.1.2:** Ve a https://github.com

**Paso 1.1.3:** Verás la página principal de GitHub.

### Paso 1.2: Registrarse

**Paso 1.2.1:** Busca el botón **"Sign up"** o **"Registrarse"** (arriba a la derecha).

**Paso 1.2.2:** Click en "Sign up".

**Paso 1.2.3:** GitHub te pedirá:
- **Username** (Nombre de usuario): Elige un nombre único (ejemplo: `josu-dev`, `mi-proyecto-rrss`)
- **Email** (Correo electrónico): Tu email real
- **Password** (Contraseña): Una contraseña segura (mínimo 8 caracteres, con letras y números)

**⚠️ IMPORTANTE:**
- El nombre de usuario debe ser único (GitHub te dirá si ya está en uso)
- Usa un email que tengas acceso porque GitHub te enviará un correo de verificación
- Anota tu nombre de usuario y contraseña en un lugar seguro

**Paso 1.2.4:** Después de llenar los campos, click en **"Create account"** o **"Crear cuenta"**.

**Paso 1.2.5:** GitHub te pedirá verificar que eres humano (captcha). Completa la verificación.

**Paso 1.2.6:** GitHub te enviará un código de verificación a tu email. Ve a tu correo, busca el email de GitHub, y copia el código.

**Paso 1.2.7:** Vuelve a GitHub y pega el código donde te lo pida.

**Paso 1.2.8:** GitHub te preguntará algunas cosas opcionales (como tus intereses). Puedes saltarte esto clickeando "Skip" o "Omitir".

**✅ Si ves el dashboard de GitHub (tu página principal), ¡ya tienes cuenta!**

---

## 2. Paso 2: Instalar Git en tu ordenador

### ¿Qué vamos a hacer?

**Git** es un programa que necesitas instalar en tu ordenador para poder subir código a GitHub. Es como un "mensajero" entre tu ordenador y GitHub.

### Paso 2.1: Verificar si ya tienes Git instalado

**Paso 2.1.1:** Abre PowerShell o CMD (Terminal de Windows).

**¿Cómo abrir PowerShell?**
- Presiona `Windows + X` y selecciona "Windows PowerShell" o "Terminal"
- O busca "PowerShell" en el menú de inicio

**Paso 2.1.2:** En la terminal, escribe este comando y presiona Enter:
```
git --version
```

**Paso 2.1.3:** Si ves algo como `git version 2.xx.x`, **ya tienes Git instalado**. Puedes saltar al Paso 3.

**Si ves un error como "git is not recognized"**, necesitas instalar Git. Continúa con el Paso 2.2.

### Paso 2.2: Descargar Git

**Paso 2.2.1:** Abre tu navegador y ve a https://git-scm.com/download/win

**Paso 2.2.2:** Git empezará a descargarse automáticamente. Si no:
- Busca el botón "Download" o "Descargar"
- Click en él y espera a que se descargue

**Paso 2.2.3:** Espera a que termine la descarga (normalmente es un archivo llamado `Git-x.x.x-64-bit.exe`).

### Paso 2.3: Instalar Git

**Paso 2.3.1:** Ve a tu carpeta de Descargas (Downloads) y busca el archivo que acabas de descargar.

**Paso 2.3.2:** Doble click en el archivo para abrirlo.

**Paso 2.3.3:** Te aparecerá una ventana de instalación. Click en **"Next"** o **"Siguiente"**.

**Paso 2.3.4:** Te preguntará dónde instalar Git. **Deja la opción por defecto** y click en "Next".

**Paso 2.3.5:** Te preguntará qué componentes instalar. **Deja todo marcado** y click en "Next".

**Paso 2.3.6:** Te preguntará qué editor usar. **Deja la opción por defecto** (Notepad) y click en "Next".

**Paso 2.3.7:** Te preguntará sobre el nombre de la rama inicial. **Deja la opción por defecto** y click en "Next".

**Paso 2.3.8:** Te preguntará sobre ajustes del PATH. **Selecciona la segunda opción** ("Git from the command line and also from 3rd-party software") y click en "Next".

**Paso 2.3.9:** Te preguntará sobre HTTPS. **Deja la opción por defecto** y click en "Next".

**Paso 2.3.10:** Te preguntará sobre line endings. **Selecciona la primera opción** ("Checkout Windows-style, commit Unix-style line endings") y click en "Next".

**Paso 2.3.11:** Te preguntará sobre el terminal. **Deja la opción por defecto** y click en "Next".

**Paso 2.3.12:** Te preguntará sobre opciones extra. **Deja todo marcado** y click en "Next".

**Paso 2.3.13:** Click en **"Install"** o **"Instalar"**.

**Paso 2.3.14:** Espera a que termine la instalación (puede tardar 1-2 minutos).

**Paso 2.3.15:** Cuando termine, click en **"Finish"** o **"Finalizar"**.

### Paso 2.4: Verificar la instalación

**Paso 2.4.1:** **Cierra y vuelve a abrir PowerShell** (importante para que los cambios tengan efecto).

**Paso 2.4.2:** Escribe este comando y presiona Enter:
```
git --version
```

**Paso 2.4.3:** Deberías ver algo como `git version 2.xx.x`.

**✅ Si ves la versión de Git, la instalación fue exitosa.**

### Paso 2.5: Configurar Git (Solo la primera vez)

**Paso 2.5.1:** En PowerShell, escribe este comando (reemplaza con tu nombre real) y presiona Enter:
```
git config --global user.name "Tu Nombre"
```

**Ejemplo:**
```
git config --global user.name "Josu"
```

**Paso 2.5.2:** Escribe este comando (reemplaza con tu email de GitHub) y presiona Enter:
```
git config --global user.email "tu-email@ejemplo.com"
```

**Ejemplo:**
```
git config --global user.email "josu@ejemplo.com"
```

**⚠️ IMPORTANTE:** Usa el mismo email que usaste para crear tu cuenta de GitHub.

**Paso 2.5.3:** Para verificar que se configuró correctamente, escribe:
```
git config --global user.name
git config --global user.email
```

Deberías ver tu nombre y tu email.

**✅ Si ves tu nombre y email, Git está configurado correctamente.**

---

## 3. Paso 3: Preparar tu proyecto

### ¿Qué vamos a hacer?

Antes de subir tu proyecto a GitHub, necesitamos asegurarnos de que está listo. Vamos a crear un archivo `.gitignore` para que NO subamos archivos sensibles (como contraseñas).

### Paso 3.1: Ir a tu proyecto

**Paso 3.1.1:** Abre el explorador de archivos de Windows.

**Paso 3.1.2:** Ve a la carpeta donde tienes tu proyecto. Probablemente es algo como:
```
C:\Users\JOSU\Desktop\CURSOR
```

**Paso 3.1.3:** Asegúrate de que puedes ver estas carpetas:
- `backend`
- `frontend`

Si no las ves, estás en la carpeta equivocada. Navega hasta encontrarlas.

### Paso 3.2: Crear archivo .gitignore en la raíz

**Paso 3.2.1:** En la carpeta principal de tu proyecto (donde están las carpetas `backend` y `frontend`), crea un archivo nuevo llamado `.gitignore`.

**¿Cómo crear un archivo?**
- Click derecho → Nuevo → Documento de texto
- Nómbralo exactamente `.gitignore` (con el punto al principio)
- Windows puede advertirte sobre cambiar la extensión, click en "Sí"

**Paso 3.2.2:** Abre el archivo `.gitignore` con el Bloc de notas.

**Paso 3.2.3:** Copia y pega este contenido en el archivo:

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables (IMPORTANTE: No subir archivos con contraseñas)
backend/.env
frontend/.env.local
.env
.env.local
.env.production

# Build output
dist/
build/
.next/
out/
*.tsbuildinfo

# Logs
logs/
*.log

# Uploads
backend/uploads/*
!backend/uploads/.gitkeep

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Misc
.DS_Store
*.pem
```

**Paso 3.2.4:** Guarda el archivo (Ctrl+S).

**⚠️ IMPORTANTE:** Este archivo le dice a Git que NO suba estos archivos. Es muy importante para proteger tus contraseñas y archivos sensibles.

### Paso 3.3: Verificar que tienes .gitignore en backend y frontend

**Paso 3.3.1:** Ve a la carpeta `backend` y verifica que hay un archivo `.gitignore`. Si no existe, créalo igual que antes con este contenido:

```
node_modules/
npm-debug.log*
yarn-debug.log*
.env
.env.local
.env.production
dist/
build/
*.tsbuildinfo
logs/
*.log
uploads/*
!uploads/.gitkeep
.DS_Store
Thumbs.db
.vscode/
.idea/
```

**Paso 3.3.2:** Ve a la carpeta `frontend` y verifica que hay un archivo `.gitignore`. Si no existe, créalo con este contenido:

```
node_modules/
/.pnp
.pnp.js
/coverage
/.next/
/out/
/build
/dist
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env*.local
.env
.vercel
*.tsbuildinfo
next-env.d.ts
```

**✅ Si todos los archivos `.gitignore` están creados, este paso está completo.**

### Paso 3.4: Verificar que NO tienes archivos .env en las carpetas

**⚠️ MUY IMPORTANTE:** Antes de subir a GitHub, verifica que los archivos con contraseñas NO se van a subir.

**Paso 3.4.1:** Ve a la carpeta `backend`.

**Paso 3.4.2:** Busca un archivo llamado `.env`. **Si existe, está bien** - el `.gitignore` evitará que se suba.

**Paso 3.4.3:** Ve a la carpeta `frontend`.

**Paso 3.4.4:** Busca un archivo llamado `.env.local`. **Si existe, está bien** - el `.gitignore` evitará que se suba.

**✅ Si los archivos `.env` existen pero están en `.gitignore`, está todo bien.**

---

## 4. Paso 4: Crear repositorio en GitHub

### ¿Qué vamos a hacer?

Vamos a crear un "repositorio" en GitHub. Un repositorio es como una carpeta en internet donde guardarás tu código.

### Paso 4.1: Ir a GitHub

**Paso 4.1.1:** Abre tu navegador y ve a https://github.com

**Paso 4.1.2:** Inicia sesión con tu cuenta (si no lo estás ya).

### Paso 4.2: Crear nuevo repositorio

**Paso 4.2.1:** En la esquina superior derecha, busca el botón **"+"** y click en él.

**Paso 4.2.2:** En el menú desplegable, click en **"New repository"** o **"Nuevo repositorio"**.

**Alternativa:** También puedes buscar un botón verde que dice **"New"** o **"Nuevo"** en la página principal.

### Paso 4.3: Configurar el repositorio

**Paso 4.3.1:** Te aparecerá un formulario. Llénalo así:

**Repository name** (Nombre del repositorio):
- Escribe un nombre descriptivo, por ejemplo: `promocion-rrss` o `socialrrss-app`
- Solo letras minúsculas, números y guiones
- No uses espacios ni caracteres especiales

**Description** (Descripción) - OPCIONAL:
- Escribe una breve descripción, por ejemplo: "Aplicación web para promoción de redes sociales"

**Visibility** (Visibilidad):
- **Public** (Público): Cualquiera puede ver tu código
- **Private** (Privado): Solo tú puedes ver tu código
- **Recomendación:** Elige **Private** si tienes información sensible, o **Public** si no te importa que otros vean tu código

**⚠️ IMPORTANTE:** 
- NO marques "Add a README file" (lo haremos después)
- NO marques "Add .gitignore" (ya lo tenemos)
- NO marques "Choose a license" (opcional, puedes hacerlo después)

**Paso 4.3.2:** Después de llenar el formulario, click en el botón verde **"Create repository"** o **"Crear repositorio"**.

### Paso 4.4: Copiar la URL del repositorio

**Paso 4.4.1:** GitHub te mostrará una página con instrucciones.

**Paso 4.4.2:** Busca una URL que se ve así:
```
https://github.com/tu-usuario/nombre-del-repositorio.git
```

**⚠️ COPIA ESTA URL - LA NECESITARÁS EN EL SIGUIENTE PASO.**

**Ejemplo:**
```
https://github.com/josu-dev/promocion-rrss.git
```

**✅ Si tienes la URL copiada, este paso está completo.**

---

## 5. Paso 5: Conectar tu ordenador con GitHub

### ¿Qué vamos a hacer?

Vamos a "conectar" tu carpeta del proyecto con el repositorio de GitHub que acabamos de crear.

### Paso 5.1: Abrir PowerShell en la carpeta del proyecto

**Paso 5.1.1:** Abre el explorador de archivos.

**Paso 5.1.2:** Ve a la carpeta principal de tu proyecto (donde están `backend` y `frontend`).

**Paso 5.1.3:** En la barra de direcciones (arriba), escribe `powershell` y presiona Enter.

**Alternativa:** 
- Click derecho en la carpeta (mientras presionas Shift)
- Selecciona "Abrir ventana de PowerShell aquí"

**Paso 5.1.4:** Se abrirá PowerShell apuntando a tu carpeta del proyecto.

**✅ Si PowerShell muestra la ruta de tu proyecto, estás en el lugar correcto.**

### Paso 5.2: Inicializar Git en tu proyecto

**Paso 5.2.1:** En PowerShell, escribe este comando y presiona Enter:
```
git init
```

**Paso 5.2.2:** Deberías ver un mensaje como:
```
Initialized empty Git repository in C:/Users/JOSU/Desktop/CURSOR/.git/
```

**✅ Si ves ese mensaje, Git está inicializado.**

### Paso 5.3: Añadir todos los archivos

**Paso 5.3.1:** En PowerShell, escribe este comando y presiona Enter:
```
git add .
```

**⚠️ NOTA:** El punto (.) significa "todos los archivos". Este comando añade todos los archivos al "área de staging" (como un área de espera antes de subirlos).

**Paso 5.3.2:** No verás ningún mensaje, pero está bien. El comando funcionó en silencio.

**✅ Si no hay errores, los archivos están añadidos.**

### Paso 5.4: Hacer el primer commit

**Paso 5.4.1:** En PowerShell, escribe este comando y presiona Enter:
```
git commit -m "Primera subida del proyecto"
```

**⚠️ NOTA:** `-m "mensaje"` es el mensaje que describe qué estás subiendo. Puedes escribir lo que quieras, por ejemplo: "Subida inicial", "Primera versión", etc.

**Paso 5.4.2:** Deberías ver un mensaje como:
```
[main (root-commit) xxxxxxx] Primera subida del proyecto
 X files changed, Y insertions(+)
```

**✅ Si ves ese mensaje, el commit fue exitoso.**

### Paso 5.5: Conectar con GitHub

**Paso 5.5.1:** En PowerShell, escribe este comando (reemplaza `TU-URL` con la URL que copiaste en el Paso 4.4) y presiona Enter:
```
git remote add origin TU-URL
```

**Ejemplo:**
```
git remote add origin https://github.com/josu-dev/promocion-rrss.git
```

**Paso 5.5.2:** No verás ningún mensaje, pero está bien.

**✅ Si no hay errores, la conexión está hecha.**

### Paso 5.6: Cambiar el nombre de la rama principal (si es necesario)

**Paso 5.6.1:** Algunas versiones de Git usan "master" y otras "main". Vamos a asegurarnos de usar "main":
```
git branch -M main
```

**Paso 5.6.2:** No verás ningún mensaje, pero está bien.

**✅ Si no hay errores, la rama está configurada.**

---

## 6. Paso 6: Subir tu código a GitHub

### ¿Qué vamos a hacer?

Ahora vamos a subir todos tus archivos a GitHub.

### Paso 6.1: Subir el código

**Paso 6.1.1:** En PowerShell, escribe este comando y presiona Enter:
```
git push -u origin main
```

**⚠️ IMPORTANTE:** Este comando puede tardar unos minutos dependiendo del tamaño de tu proyecto.

**Paso 6.1.2:** Si es la primera vez que usas Git con GitHub, puede que te pida autenticación. Te aparecerá una ventana del navegador pidiendo que autorices Git.

**Si te pide usuario y contraseña:**
- **Usuario:** Tu nombre de usuario de GitHub
- **Contraseña:** NO uses tu contraseña normal. Necesitas un "Personal Access Token"

**¿Cómo crear un Personal Access Token?**

1. Ve a https://github.com/settings/tokens
2. Click en "Generate new token" → "Generate new token (classic)"
3. Pon un nombre (ej: "Mi ordenador")
4. Selecciona el scope "repo" (marca la casilla)
5. Click en "Generate token"
6. **COPIA EL TOKEN** (solo lo verás una vez)
7. Usa ese token como contraseña cuando Git te lo pida

**Paso 6.1.3:** Espera a que termine el comando. Verás mensajes como:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**✅ Si ves ese mensaje, ¡tu código está subido a GitHub!**

**❌ Si hay errores:**
- Lee el mensaje de error
- Ve a la sección "Solución de Problemas" al final de esta guía

---

## 7. Paso 7: Verificar que todo está subido

### ¿Qué vamos a hacer?

Vamos a verificar que todos tus archivos están en GitHub.

### Paso 7.1: Ir al repositorio en GitHub

**Paso 7.1.1:** Abre tu navegador y ve a tu repositorio en GitHub:
```
https://github.com/tu-usuario/nombre-del-repositorio
```

**Paso 7.1.2:** Deberías ver una página con todos tus archivos.

### Paso 7.2: Verificar las carpetas

**Paso 7.2.1:** En GitHub, deberías ver:
- Carpeta `backend`
- Carpeta `frontend`
- Archivo `.gitignore` (en la raíz)

**Paso 7.2.2:** Click en la carpeta `backend` y verifica que ves los archivos (pero NO deberías ver `.env`).

**Paso 7.2.3:** Click en la carpeta `frontend` y verifica que ves los archivos (pero NO deberías ver `.env.local`).

**✅ Si ves las carpetas y archivos, pero NO ves los archivos `.env`, todo está bien.**

### Paso 7.3: Verificar que los archivos sensibles NO están

**⚠️ MUY IMPORTANTE:** Verifica que los archivos con contraseñas NO se subieron.

**Paso 7.3.1:** En GitHub, busca un archivo llamado `.env` o `.env.local`.

**Paso 7.3.2:** **NO deberías encontrarlos.** Si los encuentras:
- Ve a la sección "Solución de Problemas"
- Necesitas eliminarlos de GitHub inmediatamente

**✅ Si NO ves archivos `.env` o `.env.local`, está todo seguro.**

---

## 8. Solución de Problemas

### ❌ Problema: "git is not recognized"

**Síntomas:** Cuando escribes `git --version`, ves un error que dice que git no se reconoce.

**Solución:**
1. Git no está instalado o no está en el PATH
2. Ve al Paso 2 y reinstala Git
3. Después de instalar, **cierra y vuelve a abrir PowerShell**

### ❌ Problema: "fatal: not a git repository"

**Síntomas:** Cuando intentas hacer `git add .`, ves este error.

**Solución:**
1. No has ejecutado `git init` todavía
2. Ve al Paso 5.2 y ejecuta `git init` primero
3. Asegúrate de estar en la carpeta correcta (donde están `backend` y `frontend`)

### ❌ Problema: "Permission denied" o "Authentication failed"

**Síntomas:** Cuando intentas hacer `git push`, te dice que no tienes permiso.

**Solución:**
1. Necesitas autenticarte con GitHub
2. Ve al Paso 6.1.2 y crea un Personal Access Token
3. Usa el token como contraseña cuando Git te lo pida

### ❌ Problema: "remote origin already exists"

**Síntomas:** Cuando intentas hacer `git remote add origin`, ves este error.

**Solución:**
1. Ya añadiste el remote antes
2. Para cambiarlo, escribe:
   ```
   git remote set-url origin TU-NUEVA-URL
   ```
3. O para eliminarlo y volver a añadirlo:
   ```
   git remote remove origin
   git remote add origin TU-URL
   ```

### ❌ Problema: Los archivos .env se subieron a GitHub

**Síntomas:** En GitHub, ves archivos `.env` o `.env.local`.

**Solución (URGENTE - Hacer esto inmediatamente):**

1. **Eliminar los archivos de GitHub:**
   - En GitHub, ve al archivo `.env`
   - Click en el archivo
   - Click en el icono de papelera (trash) o "Delete"
   - Confirma la eliminación

2. **Asegurarte de que están en .gitignore:**
   - Verifica que tu archivo `.gitignore` tiene estas líneas:
     ```
     .env
     .env.local
     backend/.env
     frontend/.env.local
     ```

3. **Eliminar del historial de Git (opcional pero recomendado):**
   - En PowerShell, escribe:
     ```
     git rm --cached backend/.env
     git rm --cached frontend/.env.local
     git commit -m "Eliminar archivos sensibles"
     git push
     ```

4. **Cambiar todas tus contraseñas:**
   - Como los archivos estuvieron en GitHub, cambia todas las contraseñas que había en ellos
   - Genera nuevas claves de API para PayPal, Stripe, MongoDB, etc.

### ❌ Problema: "failed to push some refs"

**Síntomas:** Cuando intentas hacer `git push`, ves este error.

**Solución:**
1. Puede que haya cambios en GitHub que no tienes localmente
2. Primero, trae los cambios:
   ```
   git pull origin main --allow-unrelated-histories
   ```
3. Resuelve cualquier conflicto si aparece
4. Luego intenta hacer push de nuevo:
   ```
   git push -u origin main
   ```

### ❌ Problema: El comando se queda colgado o tarda mucho

**Síntomas:** El comando `git push` parece no hacer nada.

**Solución:**
1. Puede que esté esperando autenticación
2. Presiona Enter para ver si aparece un prompt
3. Si no funciona, cancela con Ctrl+C y vuelve a intentar
4. Verifica tu conexión a internet

---

## 🎉 ¡Felicitaciones!

Si llegaste hasta aquí y todo está subido a GitHub, **¡has completado el tutorial exitosamente!**

Tu código ahora está:
- ✅ Respaldado en GitHub
- ✅ Accesible desde cualquier lugar
- ✅ Listo para desplegar (usando la guía de despliegue)

### 📝 Recordatorios importantes:

1. **Nunca subas archivos `.env`** - Siempre verifica antes de hacer commit
2. **Haz commits regularmente** - Sube cambios frecuentemente para tener respaldo
3. **Usa mensajes descriptivos** - Escribe mensajes claros en tus commits
4. **Mantén tu código actualizado** - Sube los cambios nuevos regularmente

### 🔄 Para subir cambios futuros:

Cuando hagas cambios en tu código y quieras subirlos a GitHub:

```bash
# 1. Ve a la carpeta del proyecto en PowerShell
cd C:\Users\JOSU\Desktop\CURSOR

# 2. Añade los cambios
git add .

# 3. Haz commit
git commit -m "Descripción de los cambios"

# 4. Sube a GitHub
git push
```

**¡Buena suerte con tu proyecto!** 🚀

