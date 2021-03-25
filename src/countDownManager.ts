import { CountDownManagerOpt, CountDown } from './types'

export class CountDownManager {
  private queue: CountDown[]
  private opt: CountDownManagerOpt
  private fixNowDebounceTimer: NodeJS.Timer | number | undefined

  constructor(opt?: Partial<CountDownManagerOpt>) {
    this.opt = Object.assign({}, { fixNow: false, fixNowDebounce: 1000 * 3, getNow: () => Date.now() }, opt)
    this.queue = []
    this.fixNowDebounceTimer = undefined
  }

  getInstances() {
    return this.queue
  }

  add(instance: CountDown) {
    this.queue.push(instance)
    if (!this.fixNowDebounceTimer) {
      this.init()
    }
  }

  remove(instance: CountDown) {
    const idx = this.queue.findIndex((ins) => ins === instance)
    if (idx !== -1) {
      this.queue.splice(idx, 1)
    }
    if (!this.queue.length && this.fixNowDebounceTimer)
      clearInterval(this.fixNowDebounceTimer as any)
  }

  private init() {
    if (this.opt.fixNow && this.queue.length) {
      this.fixNowDebounceTimer = setInterval(() => this.getNow(), this.opt.fixNowDebounce)
    }
  }

  private async getNow() {
    try {
      const start = Date.now()
      const nowStr = await this.opt.getNow()
      const end = Date.now()
      this.queue.forEach((instance) => (instance.now = new Date(nowStr).getTime() + end - start))
    } catch (e) {
      console.log('修正时间失败', e)
    }
  }
}

export const countDownManager = new CountDownManager({ fixNow: true, fixNowDebounce: 1000 * 3, getNow: async () => Date.now() })
