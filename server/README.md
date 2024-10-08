# laplace-login-sync-server

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.js
```

## Container

```yaml
laplace-login-sync:
  image: ghcr.io/laplace-live/laplace-login-sync-server:latest
  restart: always
  env_file: ./laplace-login-sync.env
  volumes:
    - laplace-login-sync-vol:/app/data
```

This project was created using `bun init` in bun v1.0.21. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Server Benchmarks

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

## Crypto Benchmarks

Tested on the Apple M2 Max with bun 1.1.30 and node 22.9.0

```
┌────┬──────────────────────┬───────────┬────────────────────┬────────┬─────────┐
│    │ Task Name            │ ops/sec   │ Average Time (ns)  │ Margin │ Samples │
├────┼──────────────────────┼───────────┼────────────────────┼────────┼─────────┤
│  0 │ bun-md5              │ 1,502,979 │ 665.3451542934496  │ ±0.51% │ 1502980 │
│  1 │ bun-md5-hmac         │ 1,030,209 │ 970.6763446289069  │ ±0.61% │ 1030210 │
│  2 │ bun-sha1             │ 1,551,651 │ 644.4746566886785  │ ±0.65% │ 1551652 │
│  3 │ bun-sha1-hmac        │ 1,345,203 │ 743.3818558371571  │ ±0.49% │ 1345204 │
│  4 │ bun-sha256           │ 1,477,263 │ 676.9273103729837  │ ±0.59% │ 1477900 │
│  5 │ bun-sha256-hmac      │ 1,365,551 │ 732.3049594599747  │ ±0.46% │ 1365552 │
│  6 │ cryptojs-md5         │ 467,368   │ 2139.6382858091006 │ ±0.63% │ 467369  │
│  7 │ cryptojs-sha1        │ 499,332   │ 2002.6737207429233 │ ±0.70% │ 499333  │
│  8 │ cryptojs-sha256      │ 390,950   │ 2557.8697816358876 │ ±1.00% │ 390951  │
│  9 │ cryptojs-encrypt-aes │ 44,944    │ 22249.834753592786 │ ±0.85% │ 44945   │
│ 10 │ cryptojs-decrypt-aes │ 49,704    │ 20118.719364250755 │ ±1.35% │ 49705   │
│ 11 │ crypto-sha1          │ 341,152   │ 2931.239068688091  │ ±1.51% │ 341153  │
│ 12 │ crypto-sha256        │ 266,735   │ 3749.0363467986845 │ ±1.78% │ 266736  │
│ 13 │ crypto-encrypt-aes   │ 35,155    │ 28444.814284904656 │ ±1.96% │ 35156   │
│ 14 │ crypto-decrypt-aes   │ 61,753    │ 16193.336561193217 │ ±2.63% │ 61754   │
└────┴──────────────────────┴───────────┴────────────────────┴────────┴─────────┘
```

## License

GPL-3.0
