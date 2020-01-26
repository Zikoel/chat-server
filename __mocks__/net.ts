'use strict';

const server = {
  on: jest.fn()
}

interface FakeNet {
  createServer: () => typeof server
}

const net = jest.genMockFromModule('net');

(net as FakeNet).createServer = () => server

module.exports = net