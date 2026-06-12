// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import cloudflare from '@astrojs/cloudflare';

/**
 * Adapter is selected via DEPLOY_TARGET env var:
 *   DEPLOY_TARGET=cloudflare  → @astrojs/cloudflare (used in Cloudflare Pages build)
 *   anything else (default)   → @astrojs/node       (local dev + Keystatic admin)
 *
 * Cloudflare Pages: set the env var DEPLOY_TARGET=cloudflare in the Pages dashboard.
 */
const deployTarget = process.env.DEPLOY_TARGET ?? 'node';
const adapter = deployTarget === 'cloudflare'
  ? cloudflare()
  : node({ mode: 'standalone' });

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://springmassagetherapy.ca',
  integrations: [react(), markdoc(), keystatic(), sitemap()],
  adapter,
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
