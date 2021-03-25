import React, { useEffect, useState } from 'react'
import { CountDown, CountDownManager, CountDownOpt } from '../src';

const manager = new CountDownManager({
  debounce: 1000 * 5,
  async getRemoteDate() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Date.now())
      }, 3000)
    })
  }
})

const getCountDownInstance = (opt: Partial<CountDownOpt>) => new CountDown({ ...opt, manager })

export function Test() {
  const [timer1, setTimer1] = useState({})
  const [timer2, setTimer2] = useState({})
  const [timer3, setTimer3] = useState({})

  useEffect(() => {
    const countDown1 = getCountDownInstance({
      endTime: Date.now() + 1000 * 100,
      onStep: setTimer1
    });
    const countDown2 = getCountDownInstance({
      endTime: Date.now() + 1000 * 200,
      onStep: setTimer2
    });
    const countDown3 = getCountDownInstance({
      endTime: Date.now() + 1000 * 300,
      onStep: setTimer3,
    });

    return () => {
      countDown1.clear()
      countDown2.clear()
      countDown3.clear()
    }
  }, [])

  return (
    <>
      <div>{JSON.stringify(timer1)}</div>
      <div>{JSON.stringify(timer2)}</div>
      <div>{JSON.stringify(timer3)}</div>
    </>
  )
}