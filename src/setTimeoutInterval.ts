export type CallBack = (timerId: NodeJS.Timeout) => any

export function setTimeoutInterval(cb: CallBack, interval = 1000) {
  let count = 0
  let now = Date.now()
  let timerId: any = null

  function countdown() {
    const offset = Date.now() - (now + count * interval)
    const nextTime = interval - offset
    count++

    cb(timerId)

    timerId = setTimeout(() => {
      countdown()
    }, nextTime)
  }

  countdown()
}
