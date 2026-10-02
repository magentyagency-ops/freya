// One official, transparent wordmark for every branded surface.
import { readFileSync } from 'node:fs';
import { html } from './html.mjs';

const official = readFileSync(new URL('../assets/brand/freya-sp.svg', import.meta.url), 'utf8').trim();

export const wordmark = (cls = '') => official.replace('<svg ', `<svg class="freya-logo ${cls}" aria-hidden="true" focusable="false" `);

export const logoAsset = (color = '#111417') => official.replace('fill="currentColor"', `fill="${color}"`);

export const iconAsset = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#06090d"/><svg x="59" y="24" width="138" height="208" viewBox="0 0 155 233" fill="#f3f2ee">${official.slice(official.indexOf('<path'), official.lastIndexOf('</svg>'))}</svg></svg>`;

export const brand = (cls = '') => html`<a class="brand ${cls}" href="index.html" aria-label="Freya Sports Partners — Home">${wordmark()}</a>`;
