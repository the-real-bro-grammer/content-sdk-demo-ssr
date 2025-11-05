import { defineConfig } from '@sitecore-content-sdk/nextjs/config';

/**
 * Central configuration for the Content SDK tooling/runtime.
 * Values resolve from env vars so both local dev and Docker containers
 * can point to the same XM Cloud CM instance without code edits.
 */
export default defineConfig({
    api: {
        edge: {
            contextId:
                process.env.SITECORE_EDGE_CONTEXT_ID ||
                process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID ||
                '',
            clientContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
            edgeUrl: process.env.SITECORE_EDGE_URL || process.env.NEXT_PUBLIC_SITECORE_EDGE_URL,
        },
        local: {
            apiKey: process.env.NEXT_PUBLIC_SITECORE_API_KEY || '',
            apiHost: process.env.NEXT_PUBLIC_SITECORE_API_HOST || '',
        },
    },
    defaultSite: process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME,
    defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    editingSecret: process.env.SITECORE_EDITING_SECRET,
    redirects: {
        enabled: true,
        locales: ['en'],
    },
    multisite: {
        enabled: true,
        useCookieResolution: () => process.env.VERCEL_ENV === 'preview',
    },
    personalize: {
        scope: process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE,
        edgeTimeout: process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT
            ? parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT, 10)
            : undefined,
        cdpTimeout: process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT
            ? parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT, 10)
            : undefined,
    },
});
