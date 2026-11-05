# Rif Adventures — Concept Demo

Site de démonstration Innovatechs (portfolio, concept n°09) : sorties en bateau, snorkeling et plongée à Al Hoceima.
Marque, activités et tarifs **fictifs** — ce n'est pas le site d'un opérateur réel.

## Parcours principal

Activité → date + taille du groupe (+ niveau en plongée) → coordonnées → récapitulatif → message WhatsApp pré-rempli.
La demande n'est jamais présentée comme une réservation confirmée.

## Stack

React 19 · Vite 6 · TypeScript · Tailwind CSS 4 · React Router 7 · Vitest. Site statique, déployé sur Vercel.

- Langues : français (défaut), arabe (RTL), anglais — préfixe d'URL `/fr`, `/ar`, `/en`.
- Textes : `src/i18n/*.ts` · activités : `src/data/activities.ts`.
- Numéro WhatsApp : `VITE_WHATSAPP_NUMBER` (défaut : ligne Innovatechs).

## Commandes

```bash
npm install
npm run dev      # développement
npm test         # tests (validation + message WhatsApp)
npm run build    # build de production dans dist/
```

## Crédits

Photos : Unsplash (licence Unsplash), à remplacer par celles de l'opérateur.
