import React, { useEffect, useState } from 'react'
import { CountDown, CountDownManager } from '../src';

async function getRemoteDate(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Date.now())
    }, 3000)
  })
}

export function Test() {
  const [timer1, setTimer1] = useState({})
  const [timer2, setTimer2] = useState({})
  const [timer3, setTimer3] = useState({})

  useEffect(() => {

    // use local date
    const countDown1 = new CountDown({
      endTime: Date.now() + 1000 * 100,
      onStep: setTimer1
    });

    /**
     * use remote date
     * get remote date peer 3000ms
     */
    const countDown2 = new CountDown({
      endTime: Date.now() + 1000 * 200,
      onStep: setTimer2,
      manager: new CountDownManager({
        fixNow: true,
        fixNowDebounce: 1000 * 3,
        getNow: getRemoteDate,
      })
    });

    /**
     * use remote date
     * get remote date peer 5000ms
     */
    const countDown3 = new CountDown({
      endTime: Date.now() + 1000 * 300,
      onStep: setTimer3,
      manager: new CountDownManager({
        fixNow: true,
        fixNowDebounce: 1000 * 5,
        getNow: getRemoteDate,
      })
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