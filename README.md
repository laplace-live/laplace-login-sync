# LAPLACE Login Sync

LAPLACE Login Sync based on CookieCloud. See `README.orig.md` for original info.

## Changes

- Server: Node.js -> Bun
- Server: Express.js -> Hono
- Extension: Simpler UI
- Extension: i18n

## Benchmarks

The new server delivers a roughly 40% increase in performance. Tested on the Apple M2 Max.

```
┌─────────┬────────────────┬─────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name      │ ops/sec │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼────────────────┼─────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'bun-hono'     │ '5,206' │ 192054.40348383566 │ '±1.12%' │ 52069   │
│ 1       │ 'bun-express'  │ '4,180' │ 239192.77248372967 │ '±0.83%' │ 41808   │
│ 2       │ 'node-express' │ '3,612' │ 276843.9688278622  │ '±0.84%' │ 36122   │
└─────────┴────────────────┴─────────┴────────────────────┴──────────┴─────────┘
```
