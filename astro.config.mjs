// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';

/**
 * Deploy strategy:
 *   - DEPLOY_TARGET=cloudflare → pure static site (no SSR adapter, no
 *     Keystatic admin route). Cloudflare Pages serves the prerendered HTML
 *     in dist/. This is the *public* site.
 *   - DEPLOY_TARGET=vercel    → SSR-capable build for the Keystatic admin
 *     route. Hosted at admin.springmassagetherapy.ca on Vercel.
 *   - default (local dev)     → @astrojs/node + Keystatic admin at /keystatic.
 */
const deployTarget = process.env.DEPLOY_TARGET ?? 'node';

const integrations = [react(), markdoc(), sitemap()];
// Cloudflare static doesn't need (or want) the admin. Vercel + local-dev do.
if (deployTarget !== 'cloudflare') integrations.push(keystatic());

const adapterConfig =
  deployTarget === 'cloudflare'
    ? {} // pure static; no adapter
    : deployTarget === 'vercel'
      ? { adapter: vercel(), output: /** @type {const} */ ('server') }
      : { adapter: node({ mode: 'standalone' }), output: /** @type {const} */ ('static') };

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://springmassagetherapy.ca',
  integrations,
  ...adapterConfig,
  vite: {
    plugins: [tailwindcss()],
  },
});
