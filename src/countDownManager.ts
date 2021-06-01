import { timer } from './Timer'
import { CountDownManagerOpt, CountDown } from './types'
import { merge } from './util'

export class CountDownManager {
  private queue: CountDown[] = []
  private opt: CountDownManagerOpt
  private loading = false
  private timerId = -1

  constructor(opt?: Partial<CountDownManagerOpt>) {
    this.opt = merge({ debounce: 1000 * 3, getRemoteDate: () => Date.now() }, opt)
  }

  getInstance(instance?: CountDown) {
    return instance ? this.queue.find((ins) => ins === instance) : this.queue
  }

  add(instance: CountDown) {
    this.queue.push(instance)
    this.timerId = timer.add(() => this.getNow(), this.opt.debounce)
  }

  remove(instance: CountDown) {
    const idx = this.queue.findIndex((ins) => ins === instance)
    if (idx !== -1) {
      this.queue.splice(idx, 1)
    }
    if (!this.queue.length) {
      timer.remove(this.timerId)
    }
  }

  private async getNow() {
    if (this.loading) return
    this.loading = true
    try {
      const start = Date.now()
      const nowStr = await this.opt.getRemoteDate()
      const end = Date.now()
      this.queue.forEach((instance) => (instance.now = new Date(nowStr).getTime() + (end - start) / 2))
    } catch (e) {
      console.log('fix time fail', e)
    }
    this.loading = false
  }
}

export const countDownManager = new CountDownManager()
