import {expect} from 'chai'
import {checkOverlap} from './overlap'

describe('checkOverlap', () => {
  it('partial overlap', () => {
    expect(checkOverlap({start: 14, end: 17}, {start: 16, end: 19})).equal(1)
  })

  it('partial overlap (opposite)', () => {
    expect(checkOverlap({start: 16, end: 19}, {start: 14, end: 17})).equal(1)
  })

  it('full overlap', () => {
    expect(checkOverlap({start: 14, end: 17}, {start: 13, end: 18})).equal(3)
  })

  it('no overlap', () => {
    expect(checkOverlap({start: 14, end: 17}, {start: 19, end: 21})).equal(0)
  })
})
