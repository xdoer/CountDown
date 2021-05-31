import { timer } from './Timer'
import { CountDownOpt } from './types'

export class CountDown {
  private opt: CountDownOpt
  private getNowTimeStamp: () => number
  now: number

  constructor(opt?: Partial<CountDownOpt>, getNowTimeStamp = () => Date.now()) {
    this.opt = Object.assign({}, { interval: 1000, endTime: 0 }, opt)
    this.getNowTimeStamp = getNowTimeStamp
    this.now = getNowTimeStamp()
    this.init()
  }

  private init() {
    this.opt.manager ? this.useRemoteDateCountDown() : this.useLocalDateCountDown()
  }

  private useRemoteDateCountDown() {
    const that = this
    let id = -1
    function count() {
      that.now += that.opt.interval

      if (that.now >= that.opt.endTime) {
        timer.remove(id)
        that.opt.manager?.remove(that)
        return that.opt.onEnd?.()
      }

      that.opt.onStep?.(that.calculateTime(that.opt.endTime - that.now))
    }

    id = timer.add(count, that.opt.interval)

    this.opt.manager?.add(this)
  }

  private useLocalDateCountDown() {
    let count = 0
    let countdownSeconds = Math.round((this.opt.endTime - this.getNowTimeStamp()) / 1000)

    if (countdownSeconds < 0) return

    const startTime = this.getNowTimeStamp()

    let timerId: any = null

    const countDown = () => {
      this.opt.onStep?.(this.calculateTime(countdownSeconds * 1000))
      countdownSeconds--

      if (countdownSeconds < 0) {
        clearTimeout(timerId)
        return this.opt.onEnd?.()
      }

      const offset = this.getNowTimeStamp() - (startTime + count * this.opt.interval)
      const nextTime = this.opt.interval - offset
      count++

      timerId = setTimeout(() => {
        countDown()
      }, nextTime)
    }
    countDown()
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
}
