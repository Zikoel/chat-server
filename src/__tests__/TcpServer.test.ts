jest.mock('net')

describe('Create new TcpServer', () => {

  beforeEach(() => {
    jest.resetModules();
  })

  it('gived a correct connection should set connection and call addUser', () => {
    const TcpServer = require('../TcpServer')

    const applicationAddUser = jest.fn()

    const server = TcpServer.createNewTcpServer({
      addUser: applicationAddUser
    })
    expect(server.on.mock.calls[0][0]).toBe('connection')

    const tcpServerConnectionCb = server.on.mock.calls[0][1]
    const connectionMock = {
      setEncoding: jest.fn(),
      on: jest.fn(),
      remoteAddress: '127.0.0.1',
      remotePort: 45664,
    }

    tcpServerConnectionCb(connectionMock)

    expect(connectionMock.setEncoding.mock.calls[0][0]).toBe('utf-8')
    expect(applicationAddUser.mock.calls.length).toBe(1)
    expect(connectionMock.on.mock.calls[0][0]).toBe('data')
    expect(connectionMock.on.mock.calls[1][0]).toBe('end')
  }),

  it('gived an incorrect connection should not set connection and call addUser', () => {
    const TcpServer = require('../TcpServer')

    const applicationAddUser = jest.fn()

    const server = TcpServer.createNewTcpServer({
      addUser: applicationAddUser
    })
    expect(server.on.mock.calls[0][0]).toBe('connection')

    const tcpServerConnectionCb = server.on.mock.calls[0][1]
    const connectionMock = {
      setEncoding: jest.fn(),
      on: jest.fn(),
      remoteAddress: '127.0.0.1',
    } // remotePort is missing

    tcpServerConnectionCb(connectionMock)

    expect(connectionMock.setEncoding.mock.calls.length).toBe(0)
    expect(applicationAddUser.mock.calls.length).toBe(0)
    expect(connectionMock.on.mock.calls.length).toBe(0)
  })

  it('shoudl call the write func when an user send a message', () => {
    const TcpServer = require('../TcpServer')

    const applicationAddUser = jest.fn()
    const applicationBroadcastMessageByUser = jest.fn()

    const server = TcpServer.createNewTcpServer({
      addUser: applicationAddUser,
      broadcastMessageByUser: applicationBroadcastMessageByUser
    })
    expect(server.on.mock.calls[0][0]).toBe('connection')

    const tcpServerConnectionCb = server.on.mock.calls[0][1]
    const connectionMock = {
      setEncoding: jest.fn(),
      on: jest.fn(),
      write: jest.fn(),
      remoteAddress: '127.0.0.1',
      remotePort: 3001
    }

    tcpServerConnectionCb(connectionMock)
    expect(applicationAddUser.mock.calls.length).toBe(1)

    const connectionOnDataCb = connectionMock.on.mock.calls[0][1]
    connectionOnDataCb(new Buffer('Hello'))

    expect(applicationBroadcastMessageByUser.mock.calls.length).toBe(1)

    const userSendFunction = applicationBroadcastMessageByUser.mock.calls[0][0].send
    userSendFunction('Hello')

    expect(connectionMock.write.mock.calls.length).toBe(1)
  })

  it('shoudl call removeUser when a connection end', () => {
    const TcpServer = require('../TcpServer')

    const applicationAddUser = jest.fn()
    const applicationremoveUser = jest.fn()

    const server = TcpServer.createNewTcpServer({
      addUser: applicationAddUser,
      removeUser: applicationremoveUser
    })
    expect(server.on.mock.calls[0][0]).toBe('connection')

    const tcpServerConnectionCb = server.on.mock.calls[0][1]
    const connectionMock = {
      setEncoding: jest.fn(),
      on: jest.fn(),
      remoteAddress: '127.0.0.1',
      remotePort: 3001
    }

    tcpServerConnectionCb(connectionMock)
    expect(applicationAddUser.mock.calls.length).toBe(1)

    const endConnectionCb = connectionMock.on.mock.calls[1][1]
    endConnectionCb({})

    expect(applicationremoveUser.mock.calls.length).toBe(1)
  })
})