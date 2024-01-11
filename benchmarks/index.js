import { Bench } from 'tinybench'

const bench = new Bench({ time: 10000 })

const param = '/get/your_token_here'

bench
  .add('bun-hono', async () => {
    await fetch(`http://localhost:8088${param}`)
  })
  .add('bun-express', async () => {
    await fetch(`http://localhost:8089${param}`)
  })
  .add('node-express', async () => {
    await fetch(`http://localhost:8090${param}`)
  })

await bench.run()

console.table(bench.table())
