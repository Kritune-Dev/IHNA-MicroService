const server = require('./server')

describe('Server', () => {
  it('should require a port to start', async () => {
    expect.assertions(1)
    await expect(server.start({repo: {}})).rejects.toEqual(new Error('The server must be started with an available port'))
  })

  it('should require a repository to start', async () => {
    expect.assertions(1)
    await expect(server.start({port: {}})).rejects.toEqual(new Error('The server must be started with a connected repository'))
  })
})
