import type { Socket } from 'socket.io-client'

declare interface Window {
    socket: Socket;
}