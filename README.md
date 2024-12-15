## About

This small application is a sandbox to replicate a basket environment to a certain degree.

- home page is a list of products, each product navigates user to details page.
- product details page has `add to cart` button that: adds product to user cart, updates product quantity
- product can be added by either guest/anonymous user or by an authenticated user, if cart is initially updated as a guest user, followed by successful sign-in, then the user's cart is added/merged with the items from that user's anonymous cart.
- at the navbar basket summary, user can click an navigate to basket page
- basket page, displays the user'c basket content, shipping addresses subtotal, shipping costs and total amounts.
- user login is by federated Google login only ( for ease of usage )

## Tech stack

- Node v.18 ( old one to replicate the work project node v)
- Next.js pages router, all page routes are dynamic(ssr)
- Redux state management, used RTK as per best practices recommendations, with preloaded state during the SSR phase
- Authentication is session based, achieved by means of `next-auth` v.4
- Database is PG, cloud service provided by neon; Prisma ORM is used.
- Styles are by tailwindCss, UI provided by shad-cn library
- form state management provided by `react-hook-form`
- objects data structure validation by `zod`
- Application is hosted on Vercel.

## To start

- clone the repo, instal. packages `nvm use && npm ci` to be sure.
- `.env` file to contain the following below ( ask Serge for db string OR have your own)
  If using you own db string, will need to initialize & migrate db, then seed the products as per schema
  Same for the google IDs - either ask Serge for existing one, or setup quickly your on via Google cloud console.

```sh
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
GOOGLE_CLIENT_ID="google-client-id"
GOOGLE_CLIENT_SECRET="google-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="some-secret-hash"
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
