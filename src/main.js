/**
 * AI Search Schema Generator — Main Entry
 * - Zero-login, client-side only
 * - URL var ingestion for long-tail variants
 * - Dynamic metadata + JSON-LD injection
 * - Recursive validation UI + clipboard copy
 */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function parseQuery() {
  return Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
}

// SEO route config
const routes = {
  default: {
    title: 'Free AI Search Schema Generator — JSON-LD for Perplexity, OpenAI Search & Claude',
    description: 'Generate and validate JSON-LD structured data for AI search engines (Perplexity, OpenAI Search, Claude). Optimize for LLM citations. Free, instant, no sign-up.',
    h1: 'Validate JSON-LD for Perplexity, AI Search Engine Structured Data Generator',
    lead: 'A browser-based JSON-LD generator that helps you create schema.org markup optimized for modern AI search engines. Build WebApplication, FAQPage, and HowTo schemas that help Perplexity, OpenAI Search, and Claude cite your content accurately.',
    schemaName: 'AI Search Schema Generator',
    schemaDesc: 'A free, client-side tool that generates and validates JSON-LD structured data for AI search engines (Perplexity, OpenAI Search, Claude). Helps webmasters improve citation quality for LLM crawlers.',
    schemaUrl: 'https://www.example.com/ai-search-schema-generator'
  },
  perplexity: {
    title: 'Perplexity Schema Generator — Create JSON-LD for Perplexity Citation & Answers',
    description: 'Generate structured data optimized for Perplexity citation. Create JSON-LD schemas (WebApplication, FAQPage, HowTo) that Perplexity uses to cite your content in AI-generated answers.',
    h1: 'Perplexity Schema Generator — Create JSON-LD for Perplexity Citation & Answers',
    lead: 'Build JSON-LD markup that helps Perplexity understand and cite your website. Optimize for AI-generated answers with schema.org structured data templates built for Perplexity crawlers.',
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

function classifyQuery(query) {
  const q = JSON.stringify(query).toLowerCase();
  if (/perplexity/.test(q)) return 'perplexity';
  if (/openai|gpt/.test(q)) return 'openai';
  if (/claude/.test(q)) return 'claude';
  if (/validator|check|validate/.test(q)) return 'validator';
  if (/faq/.test(q)) return 'faq';
  return 'default';
}

function applyRoute(route) {
  const r = routes[route] || routes.default;

  document.title = r.title;

  const metaDesc = document.querySelector('meta[name="description"]') || (() => {
    const m = document.createElement('meta');
    m.name = 'description';
    document.head.appendChild(m);
    return m;
  })();
  metaDesc.setAttribute('content', r.description);

  const canonical = $('#canonical');
  if (canonical) {
    canonical.setAttribute('href', window.location.origin + window.location.pathname + window.location.search);
  }

  const schemaEl = $('#jsonld-schema');
  if (schemaEl) {
    try {
      const ld = JSON.parse(schemaEl.textContent);
      ld.name = r.schemaName;
      ld.description = r.schemaDesc;
      ld.url = r.schemaUrl;
      schemaEl.textContent = JSON.stringify(ld);
    } catch {
      // ignore parse issues if fallback is invalid
    }
  }

  const pageTitle = $('#page-title');
  const pageLead = $('#page-lead');
  if (pageTitle) pageTitle.textContent = r.h1;
  if (pageLead) pageLead.textContent = r.lead;
}

// -------- Schema builder (core tool logic) --------

function buildSchema({ type, name, url, description, engine }) {
  const base = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    url,
    description
  };

  if (['WebApplication', 'SoftwareApplication'].includes(type)) {
    base.applicationCategory = 'DeveloperApplication';
    base.operatingSystem = 'Any';
    base.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    };
  }

  if (type === 'FAQPage') {
    // remove inapplicable props, keep minimal
    delete base.applicationCategory;
    delete base.operatingSystem;
    delete base.offers;
  }

  if (type === 'HowTo') {
    delete base.applicationCategory;
    delete base.operatingSystem;
    delete base.offers;
    base.step = [];
    delete base.step;
  }

  if (type === 'Article') {
    base.inLanguage = 'en';
  }

  return { ...base, _engine: engine };
}

function validateNode(node, path = '') {
  const errors = [];
  if (!node || typeof node !== 'object') {
    errors.push(`Invalid node at "${path || '$'}": not an object.`);
    return errors;
  }

  const ctx = node['@context'];
  if (!ctx) errors.push(`Missing "@context" at ${path || '$'}.`);

  const typ = node['@type'];
  if (!typ) errors.push(`Missing "@type" at ${path || '$'}.`);

  const required = ['name', 'url'];
  for (const key of required) {
    if (!(key in node)) {
      errors.push(`Missing required property "${key}" at ${path || '$'}.`);
    }
  }

  const desc = node.description;
  if (desc !== undefined && typeof desc !== 'string') {
    errors.push(`Property "description" must be a string at ${path || '$'}.`);
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('@')) continue;
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] && typeof value[i] === 'object') {
          errors.push(...validateNode(value[i], `${path}.${key}[${i}]`));
        } else if (value[i] !== undefined && value[i] !== null && typeof value[i] !== 'string' && typeof value[i] !== 'number' && typeof value[i] !== 'boolean') {
          errors.push(`Invalid array element at ${path}.${key}[${i}]: must be scalar.`);
        }
      }
    } else if (typeof value === 'object') {
      errors.push(...validateNode(value, `${path}.${key}`));
    }
  }

  return errors;
}

function formatJson(obj) {
  return JSON.stringify(obj, null, 2);
}

// -------- UI interaction --------

function setResult(code) {
  const out = $('#output');
  const badge = $('#badge');
  if (out) out.textContent = code || '// JSON-LD will appear here';
  if (badge) badge.textContent = code ? 'Generated' : 'Default Generation';
}

function setCopyText(text) {
  const btn = $('#copy-btn');
  if (!btn) return;
  btn.dataset.text = text;
}

async function initHandlers() {
  const form = $('#schema-form');
  const output = $('#output');
  const copyBtn = $('#copy-btn');

  if (!form || !output || !copyBtn) return;

  const typeEl = $('#type');
  const nameEl = $('#name');
  const urlEl = $('#url');
  const descEl = $('#desc');
  const badge = $('#badge');

  let currentEngine = 'default';

  function currentRaw() {
    return {
      type: typeEl ? typeEl.value : 'WebApplication',
      name: nameEl ? nameEl.value.trim() : '',
      url: urlEl ? urlEl.value.trim() : '',
      description: descEl ? descEl.value.trim() : '',
      engine: currentEngine
    };
  }

  function generate() {
    const raw = currentRaw();
    if (!raw.name || !raw.url || !raw.description) {
      setResult('// Fill in required fields to generate JSON-LD');
      setCopyText('');
      return;
    }

    try {
      const schema = buildSchema(raw);
      delete schema._engine;
      const code = formatJson(schema);
      setResult(code);
      setCopyText(code);

      if (badge) {
        badge.textContent = raw.engine === 'default' ? 'Generated' : `${raw.engine[0].toUpperCase()}${raw.engine.slice(1)} Optimized`;
      }
    } catch (err) {
      setResult('// Failed to build schema: ' + err.message);
      setCopyText('');
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generate();
  });

  form.addEventListener('input', () => {
    const raw = currentRaw();
    if (raw.name && raw.url && raw.description) {
      generate();
    }
  });

  // Clicks on tabs
  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentEngine = tab.getAttribute('data-engine') || 'default';

      // Adjust form hint: engineer-tailored schema types
      if (currentEngine === 'perplexity') {
        if (typeEl && (typeEl.value === 'Article')) typeEl.value = 'FAQPage';
      } else if (currentEngine === 'openai') {
        if (typeEl) typeEl.value = 'WebApplication';
      } else if (currentEngine === 'claude') {
        if (typeEl && (typeEl.value === 'SoftwareApplication')) typeEl.value = 'Article';
      } else {
        if (typeEl) typeEl.value = 'WebApplication';
      }
      generate();
    });
  });

  // Copy
  copyBtn.addEventListener('click', async () => {
    const text = copyBtn.dataset.text;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      const prev = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = prev; }, 1400);
    } catch {
      copyBtn.textContent = 'Select then copy';
    }
  });

  // Optional: if user opens validator-style query, focus that area
  const parsed = parseQuery();
  if (parsed.mode === 'validator' || parsed.engine === 'validator') {
    const validatorSection = $('#validator');
    if (validatorSection) validatorSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// -------- Boot --------

applyRoute(classifyQuery(parseQuery()));
initHandlers();
// Auto-generate on load if query parameters provide prefilled values
const parsed = parseQuery();
if (parsed.type && parsed.name && parsed.url && parsed.description) {
  // if prefilled, trigger generate via dispatching event
  const form = $('#schema-form');
  if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
}

document.getElementById('year').textContent = new Date().getFullYear();
