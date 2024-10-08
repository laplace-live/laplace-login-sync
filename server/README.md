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
│  0 │ bun-md5              │ 1,433,471 │ 697.6071984663757  │ ±0.84% │ 1433472 │
│  1 │ bun-sha1             │ 1,551,021 │ 644.7363673758401  │ ±0.72% │ 1551022 │
│  2 │ bun-sha256           │ 1,491,613 │ 670.4149196776068  │ ±0.58% │ 1491614 │
│  3 │ cryptojs-md5         │ 472,817   │ 2114.9796052612523 │ ±0.67% │ 472818  │
│  4 │ cryptojs-sha1        │ 491,150   │ 2036.0351533000203 │ ±0.71% │ 491163  │
│  5 │ cryptojs-sha256      │ 401,490   │ 2490.7163921486754 │ ±0.79% │ 401491  │
│  6 │ cryptojs-encrypt-aes │ 40,007    │ 24995.453834234893 │ ±1.59% │ 40008   │
│  7 │ cryptojs-decrypt-aes │ 51,561    │ 19394.263934683884 │ ±0.94% │ 51562   │
│  8 │ crypto-sha1          │ 361,308   │ 2767.7190880931885 │ ±1.86% │ 361309  │
│  9 │ crypto-sha256        │ 275,214   │ 3633.528256090906  │ ±1.95% │ 275215  │
│ 10 │ crypto-encrypt-aes   │ 39,431    │ 25360.605472708536 │ ±1.06% │ 39432   │
│ 11 │ crypto-decrypt-aes   │ 54,397    │ 18383.336476599507 │ ±5.97% │ 54402   │
│ 12 │ bun-md5-hmac         │ 1,021,011 │ 979.4207443209538  │ ±0.59% │ 1021012 │
│ 13 │ bun-sha1-hmac        │ 1,353,523 │ 738.8122205439716  │ ±0.50% │ 1353524 │
│ 14 │ bun-sha256-hmac      │ 1,389,993 │ 719.4277550840861  │ ±0.37% │ 1389994 │
│ 15 │ crypto-md5-hmac      │ 255,102   │ 3919.99224234597   │ ±3.15% │ 255103  │
│ 16 │ crypto-sha1-hmac     │ 241,335   │ 4143.613766698215  │ ±4.24% │ 241336  │
│ 17 │ crypto-sha256-hmac   │ 222,536   │ 4493.6358852728845 │ ±3.55% │ 222537  │
└────┴──────────────────────┴───────────┴────────────────────┴────────┴─────────┘
```

## License

GPL-3.0
