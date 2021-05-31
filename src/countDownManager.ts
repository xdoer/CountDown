import { timer } from './Timer'
import { CountDownManagerOpt, CountDown } from './types'

export class CountDownManager {
  private queue: CountDown[]
  private opt: CountDownManagerOpt
  private loading: boolean

  id = -1

  constructor(opt?: Partial<CountDownManagerOpt>) {
    this.opt = Object.assign({}, { debounce: 1000 * 3, getRemoteDate: () => Date.now() }, opt)
    this.queue = []
    this.loading = false
  }

  getInstance(instance?: CountDown) {
    return instance ? this.queue.find((ins) => ins === instance) : this.queue
  }

  add(instance: CountDown) {
    this.queue.push(instance)
    this.id = timer.add(() => this.getNow(), this.opt.debounce)
  }

  remove(instance: CountDown) {
    const idx = this.queue.findIndex((ins) => ins === instance)
    if (idx !== -1) {
      this.queue.splice(idx, 1)
    }
    timer.remove(this.id)
  }

  private async getNow() {
    if (this.loading) return
    this.loading = true
    try {
      const start = Date.now()
      const nowStr = await this.opt.getRemoteDate()
      const end = Date.now()
      this.queue.forEach((instance) => (instance.now = new Date(nowStr).getTime() + end - start))
    } catch (e) {
      console.log('fix time fail', e)
    }
    this.loading = false
  }
}

export const countDownManager = new CountDownManager({
  debounce: 1000 * 3,
  getRemoteDate: async () => Date.now(),
})
