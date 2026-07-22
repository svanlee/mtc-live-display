# Deploying to GitHub Pages

## 1. Create the repository

1. Go to https://github.com/new.
2. Name it (e.g. `mtc-live-display`), choose Public or Private, and create it.

## 2. Upload the files

Using git:
```bash
cd mtc-live-display
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mtc-live-display.git
git push -u origin main
```

Or use GitHub's web UI "Add file → Upload files" if you prefer not to use
the command line.

## 3. Enable GitHub Pages

1. In your repository, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or re-run the included workflow from the **Actions** tab).
   `.github/workflows/deploy.yml` will validate the HTML/CSS, regenerate the
   media manifest, and publish the site automatically.

## 4. Find your URL

Once the workflow finishes (check the **Actions** tab for a green check),
your site is live at:
```
https://YOUR-USERNAME.github.io/mtc-live-display/
```
This is also shown in **Settings → Pages** and in the workflow's deployment
summary.

## 5. Open it on the TV

- Open that URL in the TV's browser (or your kiosk device's browser).
- Press fullscreen (`F11` on Chrome/Edge/Firefox desktop, or use kiosk mode —
  see `docs/TV-Kiosk.md`).

## 6. Updating the live site

Any push to `main` (including adding new images to `/images`) automatically
re-triggers the workflow and updates the live site within a minute or two —
no manual redeploy step needed.

## Custom domain (optional)

If you want `display.yourstore.com` instead of the default `github.io` URL:
1. Add a `CNAME` file to the repo root containing your domain.
2. Add a `CNAME` DNS record with your domain registrar pointing to
   `YOUR-USERNAME.github.io`.
3. Set the custom domain in **Settings → Pages → Custom domain**.
