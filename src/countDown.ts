import { countDownManager } from './countDownManager'
import { CountDownOpt } from './types'
import { format } from './utils'

const defaultOpt: CountDownOpt = {
  interval: 1000,
  endTime: 0,
  manager: countDownManager
}

export class CountDown {
  private countDownTimer: number | undefined
  private opt: CountDownOpt
  now: number

  constructor(opt?: Partial<CountDownOpt>) {
    this.countDownTimer = undefined
    this.opt = Object.assign({}, defaultOpt, opt)
    this.now = Date.now()
    this.init()
  }

  // 倒计时
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

  // 获取倒计时的秒数
  private getCountDownSeconds() {
    return this.opt.endTime - this.now
  }

  private calculateTime(ms: number) {
    const s = ms / 1000
    const m = s / 60

    return {
      d: format(`${m / 60 / 24}`),
      h: format(`${(m / 60) % 24}`),
      m: format(`${m % 60}`),
      s: format(`${s % 60}`),
    }
  }

  clear() {
    this.countDownTimer && clearInterval(this.countDownTimer as any)
    this.opt.manager?.remove(this)
  }
}
