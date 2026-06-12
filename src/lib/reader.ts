/**
 * Reader for Keystatic content collections + singletons.
 *
 * Usage from .astro pages (server-side, build time):
 *   import { reader } from '../lib/reader';
 *   const services = await reader.collections.services.all();
 *   const home = await reader.singletons.home.read();
 */
import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

/**
 * Render a Keystatic markdoc field to an HTML string.
 *
 * Keystatic's markdoc field returns a function (when read via `createReader`).
 * Calling it yields `{ node: <Markdoc.Node> }`. We unwrap and run it through
 * Markdoc's official pipeline: node → Renderable → HTML string.
 */
export async function renderMarkdoc(content: any): Promise<string> {
  if (!content) return '';
  if (typeof content === 'string') return content;

  // Keystatic returns a function — call it to get { node }.
  const result = typeof content === 'function' ? await content() : content;
  if (!result) return '';

  // Unwrap the Keystatic envelope.
  const node = result.node ?? result;
  if (!node) return '';

  try {
    const renderable = Markdoc.transform(node);
    const html = Markdoc.renderers.html(renderable);
    return html ?? '';
  } catch {
    return '';
  }
}

/** Plain-text version for JSON-LD reviewBody, descriptions, etc. */
export async function renderMarkdocText(content: any): Promise<string> {
  const html = await renderMarkdoc(content);
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
