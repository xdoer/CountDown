import { CountDownManagerOpt, CountDown } from './types'

export class CountDownManager {
  private queue: CountDown[]
  private opt: CountDownManagerOpt
  private fixNowDebounceTimer: number | undefined

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
    // 没有倒计时时清空计时器
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
      const nowStr = await this.opt.getNow()
      this.queue.forEach((instance) => (instance.now = new Date(nowStr).getTime()))
    } catch (e) {
      console.log('修正时间失败', e)
    }
  }
}

export const countDownManager = new CountDownManager({ fixNow: true, fixNowDebounce: 1000 * 3, getNow: () => Date.now() })
