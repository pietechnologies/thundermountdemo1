# Demo image repair

The original checkout referenced an absent `demo/assets/img` directory.

- Main installation, before/after and selected mount photographs now ship with the demo, using the existing relative paths (safe under a GitHub Pages repository subdirectory).
- Remaining product photographs and the logo use the original Thunder Mounts Wix media URLs, identified from its public catalog and portfolio. These require an internet connection and remain dependent on that CDN. Photography and logo belong to Thunder Mounts; no generated product images are used.
- `demo/js/image-fallback.js` repairs known missing image paths retained in existing browser-local demo data, without clearing cart, dealer, or CMS state.
- Styling remains plain CSS; routing, entry points, `.nojekyll`, and the no-build deployment are unchanged. No real commerce has been added.

Validation: run `node scripts/check-assets.js` and `node --check demo/js/<file>.js`.
The check validates local files and entry-point links, not availability of third-party image servers. Browser visual testing against the external CDN is still recommended before publishing.
