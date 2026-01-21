# 📤 Cómo Subir Cambios desde Mac a GitHub

## 🎯 Pasos Rápidos (2 minutos)

### Paso 1: Verificar que tienes los cambios commiteados
```bash
cd /Users/mgglobal/Desktop/socialrrss-app-main
git status
```

### Paso 2: Configurar el repositorio remoto (solo la primera vez)

**Si YA tienes un repositorio en GitHub:**
```bash
# Reemplaza TU-URL con tu URL de GitHub (ejemplo: https://github.com/tu-usuario/socialrrss-app.git)
git remote add origin TU-URL
```

**Si NO tienes repositorio aún:**
1. Ve a https://github.com
2. Click en "New repository" (botón verde)
3. Nombre: `socialrrss-app` (o el que prefieras)
4. NO marques "Initialize with README"
5. Click "Create repository"
6. Copia la URL que te muestra (ejemplo: `https://github.com/tu-usuario/socialrrss-app.git`)
7. Ejecuta: `git remote add origin TU-URL` (reemplaza TU-URL con la URL que copiaste)

### Paso 3: Subir los cambios
```bash
git push -u origin main
```

**Si te pide autenticación:**
- Usa un **Personal Access Token** (no tu contraseña)
- Cómo crear uno: https://github.com/settings/tokens → "Generate new token" → marca "repo" → copia el token
- Cuando pida password, pega el token

### Paso 4: Verificar que se subió
```bash
git log --oneline -3
```

---

## ✅ Después de subir

Railway y Vercel deberían detectar automáticamente los cambios y hacer deploy en 1-2 minutos.

**Para verificar:**
- Railway: Ve a tu proyecto → "Deployments" → debería aparecer un nuevo deploy
- Vercel: Ve a tu proyecto → "Deployments" → debería aparecer un nuevo deploy

---

## 🔄 Para cambios futuros (más rápido)

Una vez configurado, solo necesitas:
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

---

## ❓ Problemas Comunes

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin TU-URL
```

### Error: "Authentication failed"
- Usa un Personal Access Token en lugar de tu contraseña
- Crea uno en: https://github.com/settings/tokens

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push
```
