// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

/**
 * Deploy strategy:
 *   - DEPLOY_TARGET=cloudflare → pure static site (no SSR adapter, no Keystatic
 *     admin route). Cloudflare Pages serves the prerendered HTML in dist/.
 *     Content edits go through GitHub commits only.
 *   - default (local dev)      → @astrojs/node + Keystatic admin at /keystatic.
 *
 * Why no Cloudflare adapter? The Cloudflare adapter's prerender pass runs
 * inside miniflare (a Workers sandbox), and Keystatic's reader uses
 * node:path / node:fs/promises which miniflare doesn't expose by default.
 * Going pure-static side-steps the issue entirely; the site doesn't need
 * any server runtime in production.
 */
const deployTarget = process.env.DEPLOY_TARGET ?? 'node';
const isCloudflare = deployTarget === 'cloudflare';

const integrations = [react(), markdoc(), sitemap()];
// Only mount the Keystatic admin in local dev — the cloudflare-targeted build
// doesn't need or want the admin route.
if (!isCloudflare) integrations.push(keystatic());

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://springmassagetherapy.ca',
  integrations,
  ...(isCloudflare ? {} : { adapter: node({ mode: 'standalone' }) }),
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
