type CallBack = () => any

interface CallBackMeta {
  cb: CallBack
  interval: number
}

class Timer {
  cbs: CallBackMeta[] = []

  timerId: any
  delay: number
  count = 0

  constructor(delay = 1000) {
    this.delay = delay
  }

  start() {
    this.timerId = setInterval(() => {
      for (let i = 0; i < this.cbs.length; i++) {
        const { cb, interval } = this.cbs[i]
        if (!(this.count * 1000 % interval)) {
          cb()
        }
      }
      this.count++
    }, this.delay)
  }

  stop() {
    clearInterval(this.timerId)
  }

  add(fn: CallBack, interval = 1000) {
    this.cbs.push({ cb: fn, interval })

    if (this.timerId) this.stop()
    if (this.cbs.length) {
      this.start()
    }

    // fn id
    return this.cbs.length
  }

  remove(id: number) {
    id > 0 && this.cbs.splice(id, 1)

    if (!this.cbs.length) {
      this.stop()
    }
  }
}

export const timer = new Timer()
