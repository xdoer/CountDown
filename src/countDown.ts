import { CountDownOpt } from './types'

const defaultOpt: CountDownOpt = {
  interval: 1000,
  endTime: 0,
}

export class CountDown {
  private countDownTimer: NodeJS.Timer | number | undefined
  private opt: CountDownOpt
  now: number

  constructor(opt?: Partial<CountDownOpt>) {
    this.countDownTimer = undefined
    this.opt = Object.assign({}, defaultOpt, opt)
    this.now = Date.now()
    this.init()
  }

  private init() {
    this.countDownTimer = setInterval(() => {
      this.now += this.opt.interval

      if (this.now >= this.opt.endTime) {
        this.clear()
        return this.opt.onEnd?.()
      }

      this.opt.onStep?.(this.calculateTime(this.getCountDownSeconds()))
    }, this.opt.interval)

    this.opt.manager?.add(this)
  }

  private getCountDownSeconds() {
    return this.opt.endTime - this.now
  }

  private calculateTime(ms: number) {
    const s = ms / 1000
    const m = s / 60

    return {
      d: Number.parseInt(`${m / 60 / 24}`, 10),
      h: Number.parseInt(`${(m / 60) % 24}`, 10),
      m: Number.parseInt(`${m % 60}`, 10),
      s: Number.parseInt(`${s % 60}`, 10),
    }
  }

  clear() {
    this.countDownTimer && clearInterval(this.countDownTimer as any)
    this.opt.manager?.remove(this)
  }
}
