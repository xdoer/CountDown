import { setTimeoutInterval, clearTimeoutInterval } from '@xdoer/timeout-interval'
import { CountDownOpt } from './types'
import { merge } from './util'

export class CountDown {
  private opt: CountDownOpt
  private getNowTimeStamp: () => number
  private timerId: any = null
  now: number

  constructor(opt?: Partial<CountDownOpt>, getNowTimeStamp = () => Date.now()) {
    this.opt = merge({ interval: 1000, endTime: 0 }, opt)
    this.getNowTimeStamp = getNowTimeStamp
    this.now = getNowTimeStamp()
    this.init()
  }

  private init() {
    this.opt.manager ? this.useRemoteTimeToCountDown() : this.useLocalTimeToCountDown()
  }

  private useRemoteTimeToCountDown() {
    this.timerId = setTimeoutInterval(() => {
      this.now += this.opt.interval

      if (this.now >= this.opt.endTime) {
        clearTimeoutInterval(this.timerId)
        this.opt.manager?.remove(this)
        return this.opt.onEnd?.()
      }

      this.opt.onStep?.(this.calculateTime(this.opt.endTime - this.now))
    }, this.opt.interval)

    this.opt.manager?.add(this)
  }

  private useLocalTimeToCountDown() {
    let countdownSeconds = Math.round((this.opt.endTime - this.getNowTimeStamp()) / 1000)

    if (countdownSeconds < 0) return

    this.timerId = setTimeoutInterval(() => {
      this.opt.onStep?.(this.calculateTime(countdownSeconds * 1000))

      countdownSeconds--

      if (countdownSeconds < 0) {
        clearTimeoutInterval(this.timerId)
        return this.opt.onEnd?.()
      }

    }, this.opt.interval)
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
    clearTimeoutInterval(this.timerId)
    this.timerId = null
    if (this.opt.manager) {
      this.opt.manager.remove(this)
    }
  }
}
