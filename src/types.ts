export interface CountDownManagerOpt {
  fixNow: boolean
  fixNowDebounce: number
  getNow(): Promise<number>
}

export interface CountDown {
  now: number
  clear(): void
}

export interface CountDownManager {
  getInstances(): CountDown[]
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
