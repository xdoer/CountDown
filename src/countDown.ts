import { CountDownOpt } from './types'

export class CountDown {
  private timer: NodeJS.Timer | number | undefined
  private opt: CountDownOpt
  private getNowTimeStamp: () => number
  now: number

  constructor(opt?: Partial<CountDownOpt>, getNowTimeStamp = () => Date.now()) {
    this.timer = undefined
    this.opt = Object.assign({}, { interval: 1000, endTime: 0 }, opt)
    this.getNowTimeStamp = getNowTimeStamp
    this.now = getNowTimeStamp()
    this.init()
  }

  private init() {
    this.opt.manager ? this.useRemoteDateCountDown() : this.useLocalDateCountDown()
  }

  private useRemoteDateCountDown() {
    this.timer = setInterval(() => {
      this.now += this.opt.interval

      if (this.now >= this.opt.endTime) {
        this.clear()
        return this.opt.onEnd?.()
      }

      this.opt.onStep?.(this.calculateTime(this.opt.endTime - this.now))
    }, this.opt.interval)

    this.opt.manager?.add(this)
  }

  private useLocalDateCountDown() {
    let count = 0
    let countdownSeconds = Math.round((this.opt.endTime - this.getNowTimeStamp()) / 1000)

    if (countdownSeconds < 0) return

    const startTime = this.getNowTimeStamp()

    const localCountDown = () => {
      this.opt.onStep?.(this.calculateTime(countdownSeconds * 1000))
      countdownSeconds--

      if (countdownSeconds < 0) {
        this.clear()
        return this.opt.onEnd?.()
      }

      const offset = this.getNowTimeStamp() - (startTime + count * this.opt.interval)
      const nextTime = this.opt.interval - offset
      count++

      this.timer = setTimeout(() => { localCountDown() }, nextTime)
    }
    localCountDown()
  }

  private calculateTime(ms: number) {
    const s = ms / 1000
    const m = s / 60
    const format = (v: number) => Number.parseInt('' + v, 10)

    return {
      d: format(m / 60 / 24),
      h: format((m / 60) % 24),
      m: format(m % 60),
      s: format(s % 60),
    }
  }

  clear() {
    this.opt.manager ? clearInterval(this.timer as any) : clearTimeout(this.timer as any)
    this.opt.manager?.remove(this)
  }
}
