export interface CountDownManagerOpt {
  debounce: number
  getRemoteDate(): Promise<number>
}

export interface CountDown {
  now: number
}

export interface CountDownManager {
  add(countDown: CountDown): void
  remove(countDown: CountDown): void
}

export interface CountDownDateMeta {
  d: number
  h: number
  m: number
  s: number
}

export interface CountDownOpt {
  interval: number
  endTime: number
  manager?: CountDownManager
  onStep?(value: CountDownDateMeta): void
  onEnd?(): void
}

export type TimerCallBack = () => any

export interface TimerCallBackMeta {
  cb: TimerCallBack
  interval: number
  id: number
}
