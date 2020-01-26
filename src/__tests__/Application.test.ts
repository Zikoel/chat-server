import { createNewApplication } from '../Application'

describe('Send broadcast message', () => {
  it('should send any message if there is only one user', () => {
    const user1 = {
      address: '127.0.0.1',
      port: 3001,
      send: jest.fn()
    }

    const app = createNewApplication()
    app.addUser(user1)

    app.broadcastMessageByUser(user1, new Buffer('Hello'))

    expect(user1.send.mock.calls.length).toBe(0)
  }),

  it('should send message to all users but the sender if there are more than two users', () => {
    const user1 = {
      address: '127.0.0.1',
      port: 3001,
      send: jest.fn()
    }

    const user2 = {
      address: '127.0.0.2',
      port: 3002,
      send: jest.fn()
    }

    const user3 = {
      address: '127.0.0.3',
      port: 3003,
      send: jest.fn()
    }

    const app = createNewApplication()
    app.addUser(user1)
    app.addUser(user2)
    app.addUser(user3)

    app.broadcastMessageByUser(user1, new Buffer('Hello'))

    expect(user1.send.mock.calls.length).toBe(0)
    expect(user2.send.mock.calls.length).toBe(1)
    expect(user3.send.mock.calls.length).toBe(1)
  })

  it('should not send message to deleted user', () => {
    const user1 = {
      address: '127.0.0.1',
      port: 3001,
      send: jest.fn()
    }

    const user2 = {
      address: '127.0.0.2',
      port: 3002,
      send: jest.fn()
    }

    const user3 = {
      address: '127.0.0.3',
      port: 3003,
      send: jest.fn()
    }

    const app = createNewApplication()
    app.addUser(user1)
    app.addUser(user2)
    app.addUser(user3)

    app.broadcastMessageByUser(user1, new Buffer('Hello'))

    expect(user1.send.mock.calls.length).toBe(0)
    expect(user2.send.mock.calls.length).toBe(1)
    expect(user3.send.mock.calls.length).toBe(1)

    app.removeUser(user3)
    app.broadcastMessageByUser(user1, new Buffer('Hello'))

    expect(user1.send.mock.calls.length).toBe(0)
    expect(user2.send.mock.calls.length).toBe(2)
    expect(user3.send.mock.calls.length).toBe(1)
  })
})