import process from 'node:process'
import { workerData } from 'node:worker_threads'
import igniteWorkerApp from '#utils/ignite_worker_app'

const app = await igniteWorkerApp()

const { default: jobWithApp } = await import(`#jobs/app/${workerData.job}`)

try {
  await jobWithApp()
} catch (error) {
  console.error(error)

  await app!.terminate()
  process.exit(1)
}

await app!.terminate()
process.exit(0)
