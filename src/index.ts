import { createNewApplication } from './Application';
import { createNewTcpServer } from './TcpServer';
import D from 'debug'

const debug = D('boot')
const app = createNewApplication()
const server = createNewTcpServer(app)

debug('Server listening on port 10000')
server.listen(10000)