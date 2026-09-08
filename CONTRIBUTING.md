# Contributing

Read [CLAUDE.md](CLAUDE.md) and verify the current code before editing. This
repository deploys to production from `main`.

## Cache rule: version identity CSS; keep config and modules under `/js/`

`vercel.json` gives `/assets/(.*)` the header
`Cache-Control: public, max-age=31536000, immutable`. Browsers can retain an asset
at that URL for a year, even after a new deployment.

- **Identity CSS ships by filename version.** When changing the shipped identity
  stylesheet, create the next filename (for example,
  `/assets/css/tpa-identity-v2.css` to `/assets/css/tpa-identity-v3.css`) and update
  every active reference in the same change. Do not overwrite a published
  version or rely on a redeploy, hard refresh or query string as the release fix.
  Retain the previous version while cached pages or rollback releases reference
  it.
- **Shared runtime configuration stays in `/js/config/`; shared ES modules stay
  in `/js/lib/`.** For example, use `/js/config/funnels.js` and
  `/js/lib/commerce-ui.js`. Keep their imports under `/js/`, outside the immutable
  `/assets/` rule. Do not move these files into `/assets/` for tidiness.
- Check the actual references before editing a shared-looking asset. Some pages
  still contain inline CSS and scripts; an unused file cannot change the page.

## Verification

Run the existing functional checks for runtime changes:

```bash
node --test tests/*.test.cjs
git diff --check
```

After merging, fetch `origin/main` and record its exact SHA. Confirm production
against that revision, including the changed HTML, its versioned identity CSS
and any changed `/js/` dependencies. Check successful responses and appropriate
content types so an HTML fallback cannot pass as a stylesheet or module.

When Vercel deployment metadata is accessible, confirm the production domain is
assigned to a READY deployment whose `githubCommitSha` matches that revision.
When the MCP connection cannot access the project's team, byte-compare the
decoded production response bodies with `git show <recorded-origin/main-SHA>:<path>`
(for example, download with `curl --compressed` and compare with `cmp`). Compare
the actual page-referenced URLs, not only cache-busted URLs. Record which paths
matched and the source SHA; this verifies those served files, not a deployment
ID or every route.

Keep provider transmission separate from local instrumentation: an event in
`window.__tpaEvents` is local evidence, not proof of an external analytics sink.
