# Artemis · Página de Captura

Landing page (página de captura) do **Studio Artemis** — diagnóstico de visibilidade em IA.
Implementação fiel (pixel-perfect) do design no Figma, em **HTML/CSS/JS estático**, pronta para **GitHub Pages**.

> **Design de referência:** Figma — *Studio Artemis · Site Institucional* → canvas *Design · Página de Captura* → frame *Desktop* (`7484:2980`, 1440px).

## Estrutura

```
.
├── index.html                 # página única (8 seções)
├── assets/
│   ├── css/styles.css         # tokens :root + estilos por seção
│   ├── js/main.js             # smooth-scroll + UX do formulário
│   └── images/figma/          # assets exportados do Figma
├── .github/workflows/deploy.yml   # deploy automático no GitHub Pages
├── .nojekyll                  # não processar com Jekyll
└── README.md
```

### Seções
1. Header · 2. Hero + formulário · 3. Pattern (faixa) · 4. Resultados (scroll-stack)
5. Diagnóstico (grid 2×2) · 6. Stats · 7. Call to action · 8. Footer

## Rodar localmente

```bash
python -m http.server 8000
# abre http://localhost:8000
```

## Deploy no GitHub Pages

O workflow em `.github/workflows/deploy.yml` publica o site a cada push na branch `main`.
Depois de subir o repositório:

1. **Settings → Pages → Build and deployment → Source: `GitHub Actions`**.
2. Faça um push (ou rode o workflow manualmente em *Actions*).
3. O site fica em `https://<seu-usuario>.github.io/<repositorio>/`.

## Notas de implementação

- **Estático (não WordPress):** GitHub Pages serve apenas arquivos estáticos, por isso não há tema WP/PHP.
- **Fontes:** Instrument Serif, Exo e Cabin via Google Fonts.
- **Tokens estruturais** (`--frame-w: 1440`, `--content-w: 1376`, `--section-px`, `--content-gap: 120`) extraídos do Figma.
- **Responsivo:** o Figma só tem frame desktop; tablet/mobile usam adaptação fluida (não há comp mobile de referência).
- **Formulário:** sem back-end (site estático). O submit dá feedback local — conectar a um endpoint (Formspree, etc.) quando necessário.

---
Design: Studio Artemis · Implementação: pixel-perfect a partir do Figma.
