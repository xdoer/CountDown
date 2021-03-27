import { CountDownManagerOpt, CountDown } from './types'

export class CountDownManager {
  private queue: CountDown[]
  private opt: CountDownManagerOpt
  private timer: NodeJS.Timer | null
  private loading: boolean

  constructor(opt?: Partial<CountDownManagerOpt>) {
    this.opt = Object.assign({}, { debounce: 1000 * 3, getRemoteDate: () => Date.now() }, opt)
    this.queue = []
    this.timer = null
    this.loading = false
  }

  getInstance(instance?: CountDown) {
    return instance ? this.queue.find(ins => ins === instance) : this.queue
  }

  add(instance: CountDown) {
    this.queue.push(instance)
    if (!this.timer) {
      this.init()
    }
  }

  remove(instance: CountDown) {
    const idx = this.queue.findIndex((ins) => ins === instance)
    if (idx !== -1) {
      this.queue.splice(idx, 1)
    }
    if (!this.queue.length && this.timer) {
      clearInterval(this.timer as any)
      this.timer = null
    }
  }

  private init() {
    if (this.opt.debounce && this.queue.length) {
      this.timer = setInterval(() => this.getNow(), this.opt.debounce)
    }
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

export const countDownManager = new CountDownManager({ debounce: 1000 * 3, getRemoteDate: async () => Date.now() })
