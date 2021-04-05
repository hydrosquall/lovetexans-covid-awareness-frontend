Note: this site is an early prototype of what became <https://covidcommitment.org>. This code remains public for historical research purposes.

## LoveTexans.org

[Live Site](https://lovetexans.now.sh/)

This application is a proof of concept for an application that lets users combine multiple public datasets to understand the impact of Coronavirus in their immediate surroundings. It combines with a Serverless Framework (Python)/Darklang backend responsible for data aggregation + generating the interactive maps portion of the application.

## NextJS Documentation

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

https://nextjs.org/blog/create-next-app

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/zeit/next.js/) - your feedback and contributions are welcome!

## Deploy on ZEIT Now

The easiest way to deploy your Next.js app is to use the [ZEIT Now Platform](https://zeit.co/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Miscellaneous tooling used

- Converted Alex's app to React code (mostly): https://magic.reactjs.net/htmltojsx.htm
- Image compression with TinyPNG + ICO Converters
- Custom thumbnails from Vimeo (note WebP doesn't work on Safari)
  - https://stackoverflow.com/questions/1361149/get-img-thumbnails-from-vimeo

## TODO

- Replace Darklang cache with custom redis or elasticache
- Responsive/localization
- Determine roadmap to extend platform to states/regions beyond Texas
- Put Algolia behind a feature flag, toggle between which input is used depending on API key availability
- Extend API to support querying map cases + summary by lat/lng instead of URL
- Make util folder for titlecasing
- Config - set up prettier, typescript, basic commit hooks
