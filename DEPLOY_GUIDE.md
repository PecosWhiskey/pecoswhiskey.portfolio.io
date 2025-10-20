# 🚀 Guida Completa al Deploy - VayGo App

## 📋 Panoramica

Questo progetto è diviso in due parti:
- **Frontend**: Angular/Ionic app su GitHub Pages
- **Backend**: Node.js/Express API su Render.com

---

## 🎯 DEPLOY BACKEND (Render.com)

### Step 1: Prepara il file .env locale

Assicurati di avere `back_end/.env` con:

```env
JWT_SECRET = "il-tuo-jwt-secret-sicuro"
PORT = 3000
```

### Step 2: Crea account Render.com

1. Vai su https://render.com
2. Clicca "Get Started" → "Sign up with GitHub"
3. Autorizza Render ad accedere ai tuoi repository

### Step 3: Crea Web Service

1. Dashboard Render → "New +" → "Web Service"
2. Connetti: **pecoswhiskey.portfolio.io**
3. Configurazione:

```
Name: pecoswhiskey-backend
Region: Frankfurt
Branch: main
Root Directory: back_end
Runtime: Node
Build Command: npm install
Start Command: node server.js
Instance Type: Free
```

### Step 4: Configura Environment Variables

Nella sezione "Environment Variables", aggiungi:

```
JWT_SECRET = [il-tuo-jwt-secret-qui]
```

⚠️ **NON** committare .env su GitHub!

### Step 5: Deploy

1. Clicca "Create Web Service"
2. Attendi 2-5 minuti per il build
3. Copia l'URL: `https://pecoswhiskey-portfolio-io-back-end.onrender.com`

---

## 🌐 DEPLOY FRONTEND (GitHub Pages)

### Step 1: Aggiorna URL Backend

In `photo-gallery/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://pecoswhiskey-backend.onrender.com'  // ← URL da Render
};
```

### Step 2: Aggiorna base href

In `photo-gallery/www/index.html`, verifica:

```html
<base href="/pecoswhiskey.portfolio.io/">
```

### Step 3: Build di produzione

```powershell
cd photo-gallery
npm run build
```

### Step 4: Deploy su GitHub Pages

Dalla root del progetto:

```powershell
.\deploy-gh-pages.ps1
```

Oppure manualmente:

```powershell
cd photo-gallery
npm run build

cd ..
git checkout --orphan gh-pages
git rm -rf .
xcopy /E /I /Y photo-gallery\www\* .
echo. > .nojekyll
git add .
git commit -m "Deploy to GitHub Pages"
git push -f origin gh-pages
git checkout main
```

### Step 5: Configura GitHub Pages

1. Vai su GitHub → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **/ (root)**
4. Save

---

## 🔄 WORKFLOW COMPLETO PER AGGIORNAMENTI

### Modifica solo il FRONTEND:

```powershell
# 1. Modifica il codice in photo-gallery/src/
# 2. Testa localmente
cd photo-gallery
ionic serve

# 3. Build e deploy
npm run build
cd ..
.\deploy-gh-pages.ps1
```

### Modifica solo il BACKEND:

```powershell
# 1. Modifica il codice in back_end/
# 2. Testa localmente
cd back_end
node server.js

# 3. Push su GitHub (Render fa deploy automatico)
git add .
git commit -m "Update backend"
git push origin main
```

### Modifica ENTRAMBI:

```powershell
# 1. Aggiorna backend
cd back_end
# ... modifiche ...
cd ..

# 2. Aggiorna frontend
cd photo-gallery
# ... modifiche ...
npm run build
cd ..

# 3. Commit e push (triggera deploy backend)
git add .
git commit -m "Update frontend and backend"
git push origin main

# 4. Deploy frontend
.\deploy-gh-pages.ps1
```

---

## 🐛 TROUBLESHOOTING

### Backend non risponde

1. Controlla logs su Render dashboard
2. Verifica environment variables
3. Controlla che il servizio sia "Live"

### Frontend mostra errori CORS

1. Verifica che l'URL del backend in `environment.prod.ts` sia corretto
2. Controlla che CORS nel backend includa GitHub Pages URL
3. Rebuild frontend: `npm run build`

### 404 su GitHub Pages

1. Verifica che `base href` sia corretto in `index.html`
2. Controlla GitHub Settings → Pages sia configurato correttamente
3. Attendi 2-5 minuti per la propagazione

### Database non persistente su Render

⚠️ Il piano gratuito di Render non garantisce persistenza del filesystem.
Per database produttivi, usa:
- PostgreSQL su Render (servizio separato)
- MongoDB Atlas
- Supabase

---

## 📝 CHECKLIST PRE-DEPLOY

- [ ] `.env` NON è committato su GitHub
- [ ] `JWT_SECRET` è configurato su Render
- [ ] URL backend in `environment.prod.ts` è corretto
- [ ] `base href` in `index.html` è `/pecoswhiskey.portfolio.io/`
- [ ] Build di produzione funziona senza errori
- [ ] CORS include GitHub Pages URL
- [ ] .nojekyll esiste nella root di gh-pages

---

## 🔗 URL IMPORTANTI

- **Frontend Live**: https://pecoswhiskey.github.io/pecoswhiskey.portfolio.io/
- **Backend Live**: https://pecoswhiskey-backend.onrender.com
- **Repository**: https://github.com/PecosWhiskey/pecoswhiskey.portfolio.io
- **Render Dashboard**: https://dashboard.render.com

---

## 📧 SUPPORTO

Per problemi, controlla:
1. GitHub Actions (se attivi)
2. Render Logs
3. Browser Console (F12)
4. Network Tab per errori API
