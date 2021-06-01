type CallBack = () => any

interface CallBackMeta {
  cb: CallBack
  interval: number
  id: number
}

export class Timer {
  cbs: CallBackMeta[] = []

  private timerId: any
  private delay: number
  private count = 0
  private instanceId = 0

  constructor(delay = 1000) {
    this.delay = delay
  }

  private start() {
    this.timerId = setInterval(() => {
      for (let i = 0; i < this.cbs.length; i++) {
        const { cb, interval } = this.cbs[i]
        if (!(this.count * this.delay % interval)) {
          cb()
        }
      }
      this.count++
    }, this.delay)
  }

  private stop() {
    clearInterval(this.timerId)
  }

  add(cb: CallBack, interval = 1000) {
    const id = this.instanceId++
    this.cbs.push({ cb, interval, id })

    if (this.timerId) this.stop()

    this.start()

    return id
  }

  remove(id: number) {
    const idx = this.cbs.findIndex(item => item.id === id)

    if (idx !== -1) {
      this.cbs.splice(idx, 1)

      if (!this.cbs.length) {
        this.stop()
      }
    }
  }

  removeAll() {
    this.cbs = []
    this.stop()
  }
}

export const timer = new Timer()
