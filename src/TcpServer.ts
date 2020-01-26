import tcp, { Server } from 'net'
import { Application } from './Application';
import D from 'debug'

const debug = D('TcpServer')

export const createNewTcpServer = (application: Application): Server => {

  const server = tcp.createServer()

  server.on('connection', (conn) => {
    if ( !conn.remoteAddress || !conn.remotePort  ) {
      debug(`Connection not valid refused`)
      return
    }

    conn.setEncoding('utf-8');
    
    const send = (data: string | Uint8Array): boolean => conn.write(data)

    const user = { address: conn.remoteAddress, port: conn.remotePort, send }
    application.addUser( user )
  
    conn.on('data', data => application.broadcastMessageByUser(user, data))
    conn.on('end', () => application.removeUser(user))
  })

  return server
}