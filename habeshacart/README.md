# HabeshaCart

A six-product storefront priced in ETB, built as a single-page commerce demo with plain HTML, CSS and JavaScript.

[![HabeshaCart](https://bereket-codes.github.io/Habeshacart.jpg)](https://bereket-codes.github.io/habeshacart/)

**Live:** https://bereket-codes.github.io/habeshacart/

## What it does

- Product grid with add-to-cart and quantity controls, reflected on a cart badge.
- Cart drawer recalculating **subtotal**, **delivery** and **total** on every change.
- Free delivery once the subtotal reaches ETB 800, otherwise a flat ETB 75.
- A **simulated** Telebirr checkout — a UI flow, not a live payment integration.

## How to run

It is static: open `index.html`, or serve the folder.

```bash
python3 -m http.server 8000   # then open http://localhost:8000/habeshacart/
```

## Files

```
habeshacart/
  index.html    markup
  styles.css    layout and styling
  script.js     cart state, totals, drawer and checkout modal
```

## Note

This folder lives inside the portfolio repository, so its "view code" link points here rather than to a standalone repo.
