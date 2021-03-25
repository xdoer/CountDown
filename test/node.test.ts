// import { sum } from '../src';

// describe('blah', () => {
//   it('works', () => {
//     expect(sum(1, 1)).toEqual(2);
//   });
// });

import { CountDown } from '../src'

describe('node', () => {
  it('works', () => {
    new CountDown({
      endTime: Date.now() + 1000 * 100,
      onStep(value) {
        console.log(value)
      }
    })
  })
})
