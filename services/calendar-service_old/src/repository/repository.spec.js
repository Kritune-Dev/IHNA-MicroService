const Controller = require('./repository')

describe('Repository', () => {
  it('should connect with a promise', () => {
    expect(typeof Controller.connect).toBe('function')
  })
})
