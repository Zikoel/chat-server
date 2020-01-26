import D from 'debug'

const debug = D('application')

export interface User {
  address: string
  port: number
  send: (data: string | Uint8Array) => boolean
}

export const createNewApplication = () => {

  // This is the unique mutable point for simulate memory
  let users: User[] = []
  
  return {
    addUser: (user: User) => {
      users = [...users, user]
      debug(`Added user from ${user.address}:${user.port}, ${users.length} in the chat`)
    },
    removeUser: (user: User) => {
      users = users.filter( u => u.address !== user.address || u.port !== user.port )
      debug(`Removed user from ${user.address}:${user.port}, ${users.length} in the chat`)
    },
    broadcastMessageByUser: (user: User, message: Buffer) => {
      debug(`User from ${user.address}:${user.port} sent message`)
      users
        .filter( u => u.address !== user.address || u.port !== user.port )
        .forEach( dest => {
          dest.send(message)
          debug(`   -> ${dest.address}:${dest.port}`)
        });
    }
  }

}

export type Application = ReturnType<typeof createNewApplication>