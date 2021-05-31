# count-down

JavaScript High Precision Countdown

## Docs

[English](./README.md) | [中文](./README_CN.md)

## Foreword

In the spike activity, we need a high-precision spike countdown to meet the demand. The use of local client time timing will face the problem of inaccurate client time, and the use of server-side time timing will face the problem that the request interface is difficult to manage when multi-instance countdown is used. So I developed this high-precision spike countdown timer, which effectively solved the problem.

## Features

> - High precision
> - Unified management of multiple instances
> - Flexible configuration of single instance

## Installation

```bash
npm i @xdoer/count-down
```

## Usage

```tsx
import React, { useEffect, useState } from 'react';
import { CountDown, CountDownManager } from '@xdoer/count-down';

async function getRemoteDate() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Date.now());
    }, 3000);
  });
}

export function Test() {
  const [timer, setTimer] = useState({});

  useEffect(() => {
    const offsetTime = getOffsetTimeBetweenServerAndClient();
    const countDown = new CountDown(
      {
        endTime: Date.now() + 1000 * 100,
        onStep: setTimer,
        onStop() {
          console.log('finished');
        },
        manager: new CountDownManager({
          debounce: 1000 * 3,
          getRemoteDate,
        }),
      },
      () => Date.now() + offsetTime
    );

    return () => {
      countDown.clear();
    };
  }, []);

  return <div>{JSON.stringify(timer)}</div>;
}
```

## Configuration

### CountDown Configuration Item

| Item     | Type                                                    | Optional | Default | Meaning                      |
| -------- | ------------------------------------------------------- | -------- | ------- | ---------------------------- |
| endTime  | number                                                  | -[x]     | None    | end time of countdown        |
| interval | number                                                  | -[]      | 1000ms  | countdown interval           |
| onStep   | ({ d: number, h: number, m: number, s: number}) => void | -[]      | None    | countdown callback peer step |
| onEnd    | () => void                                              | -[]      | None    | countdown callback when stop |
| manager  | CountDownManager                                        | -[]      | None    | countdown manager            |

when you pass manager into `CountDown`, it will use server-side time to fix countdown timer.

### CountDownManager Configuration Item

| Item          | Type                    | Optional | Default          | Meaning                    |
| ------------- | ----------------------- | -------- | ---------------- | -------------------------- |
| debounce      | number                  | -[]      | 3000ms           | request interface debounce |
| getRemoteDate | () => Promise\<number\> | -[]      | () => Date.now() | request interface instance |

## Reference

[可以详细的讲一下平时网页上做活动时的倒计时是怎么实现的吗？](https://www.zhihu.com/question/28896402)
