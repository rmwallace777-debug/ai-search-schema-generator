/**
 * Post-build: generate static HTML variants for each SEO route.
 * Creates per-variant index.html files under dist/<route>/index.html
 * so every long-tail URL works on plain static file hosting.
 */

import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');
const baseHtml = fs.readFileSync(indexPath, 'utf8');

const routes = {
  perplexity: {
    title: 'Perplexity Schema Generator — Create JSON-LD for Perplexity Citation & Answers',
    description: 'Generate structured data optimized for Perplexity citation. Create JSON-LD schemas (WebApplication, FAQPage, HowTo) that Perplexity uses to cite your content in AI-generated answers.',
    h1: 'Perplexity Schema Generator — Create JSON-LD for Perplexity Citation & Answers',
    lead: 'Build JSON-LD markup that helps Perplexity understand and cite your website. Optimize for AI-generated answers with schema.org structured data templates built for perplexity crawlers.',
    schemaName: 'Perplexity Schema Generator',
    schemaDesc: 'Generate JSON-LD optimized for Perplexity citation, including WebApplication and FAQPage schemas.',
    schemaUrl: 'https://www.example.com/ai-search-schema-generator/perplexity'
  },
  openai: {
    title: 'OpenAI Search Schema Generator — JSON-LD for OpenAI Search & GPT Citations',
    description: 'Generate JSON-LD for OpenAI Search and GPT-powered search engines. Build structured data that improves citation accuracy and content retrieval.',
    h1: 'OpenAI Search Schema Generator — JSON-LD for OpenAI Search & GPT Citations',
    lead: 'JSON-LD schema generator optimized for OpenAI Search and GPT-based retrieval. Create WebApplication, Organization, and FAQPage schemas that AI engines index reliably.',
    schemaName: 'OpenAI Search Schema Generator',
    schemaDesc: 'Generate schema.org JSON-LD tailored for OpenAI Search and GPT citation patterns.',
    schemaUrl: 'https://www.example.com/ai-search-schema-generator/openai-search'
  },
  claude: {
    title: 'Claude Search Schema Generator — JSON-LD for Claude Answer Engine',
    description: 'Generate JSON-LD for Claude-friendly indexing. Build schemas optimized for Claude answer quoting, citations, and summary reuse.',
    h1: 'Claude Search Schema Generator — JSON-LD for Claude Answer Engine',
    lead: 'A focused JSON-LD builder for Claude-style AI engines. Create WebApplication, Article, and HowTo schemas aligned with Claude indexing behavior.',
    schemaName: 'Claude Search Schema Generator',
    schemaDesc: 'Generate JSON-LD optimized for Claude-based AI search, with article and FAQ schemas.',
    schemaUrl: 'https://www.example.com/ai-search-schema-generator/claude'
  },
  validator: {
    title: 'Free JSON-LD Validator for AI Search Engines — Check Perplexity, OpenAI, Claude',
    description: 'Validate JSON-LD structured data for AI search engines. Validate schema.org markup against Perplexity, OpenAI Search, and Claude indexing requirements.',
    h1: 'Free JSON-LD Validator for AI Search Engines — Check Perplexity, OpenAI, Claude',
    lead: 'Paste your JSON-LD and validate it for AI search compatibility. Tests schema.org structure, required fields, AI-specific properties, and cross-engine readability.',
    schemaName: 'AI Search JSON-LD Validator',
    schemaDesc: 'Paste JSON-LD to validate schema.org structure and AI engine compatibility.',
    schemaUrl: 'https://www.example.com/ai-search-schema-generator/validator'
  },
  faq: {
    title: 'AI Engine Schema FAQ — Perplexity, OpenAI Search, Claude Structured Data',
    description: 'Frequently asked questions about JSON-LD for AI crawlers: Does Perplexity read JSON-LD? What schema types do AI engines prefer? How do I validate structured data?',
    h1: 'AI Engine Schema FAQ — Perplexity, OpenAI Search, Claude Structured Data',
    lead: 'Common questions about using JSON-LD to help AI search engines discover, index, and cite your content accurately.',
    schemaName: 'AI Engine Schema FAQ',
    schemaDesc: 'A living FAQ about AI engine JSON-LD: Perplexity, OpenAI Search, Claude, and schema.org structured data.',
    schemaUrl: 'https://www.example.com/ai-search-schema-generator/faq'
  }
};

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeText(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildVariantHtml(route) {
  const r = routes[route];
  if (!r) return;

  let out = baseHtml;

  // title
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(r.title)}</title>`);
  // meta name="title"
  out = out.replace(
    /<meta name="title" content="[^"]*"/,
    `<meta name="title" content="${escapeAttr(r.title)}"`
  );
  // meta description
  out = out.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeAttr(r.description)}"`
  );
  // canonical
  out = out.replace(
    /<link rel="canonical" id="canonical" href="[^"]*"/,
    `<link rel="canonical" id="canonical" href="${escapeAttr(r.schemaUrl)}"`
  );
  // h1
  out = out.replace(
    /<h1 id="page-title">[\s\S]*?<\/h1>/,
    `<h1 id="page-title">${escapeText(r.h1)}</h1>`
  );
  // lead
  out = out.replace(
    /<p class="lead" id="page-lead">[\s\S]*?<\/p>/,
    `<p class="lead" id="page-lead">${escapeText(r.lead)}</p>`
  );
  // JSON-LD
  out = out.replace(
    /<script type="application\/ld\+json" id="jsonld-schema">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="jsonld-schema">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "${escapeText(r.schemaName)}",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "${escapeText(r.schemaDesc)}",
    "url": "${escapeAttr(r.schemaUrl)}"
  }
  </script>`
  );

  return out;
}

for (const [route, data] of Object.entries(routes)) {
  const outDir = path.join(distDir, route);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'index.html');
  const variantHtml = buildVariantHtml(route);
  if (!variantHtml) {
    console.error(`Failed to build HTML for route: ${route}`);
    process.exit(1);
  }
  fs.writeFileSync(outPath, variantHtml, 'utf8');
  console.log(`Wrote ${outPath}`);
}

console.log('Static route variants generated into dist/<route>/index.html');
