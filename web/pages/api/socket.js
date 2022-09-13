import { Server } from 'socket.io';
import axios from './axios';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    return res.end();
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  let onlineUsers = new Map()
  let chatRooms = new Map()

  io.on("connection", async (socket) => {
    onlineUsers.set(socket.handshake.auth.id, socket.id)
    socket.emit('users-change', Array.from(onlineUsers).map(([userId, socketId]) => ({userId, socketId})))

    if (chatRooms.size === 0) {
      const allChatsRes = await axios.get('chat/get-all')
        .then(res => res.data)
        .catch(err => {
          return {
            success: false,
            message: err.message,
          }
        })
      if (allChatsRes.success) {
        for (const chat of allChatsRes.data) {
          const chatMap = new Map()
          for (const member of chat.members) {
            chatMap.set(member.id, { socketId: '', inRoom: false })
          }
          chatRooms.set(chat.roomId, chatMap)
        }
      }
    }

    if (chatRooms.size > 0) {
      for (const chatRoom of chatRooms.values()) {
        if (chatRoom.has(socket.handshake.auth.id)) {
          chatRoom.set(socket.handshake.auth.id, { ...chatRoom.get(socket.handshake.auth.id), socketId: socket.id })
        }
      }
    }

    // Triggered when a peer hits the join room button.
    socket.on("join", (roomId, user) => {
      socket.join(roomId)

      const chatRoom = chatRooms.get(roomId)
      chatRoom.set(user.id, { socketId: socket.id, inRoom: true, })
    });

    socket.on("message-change", (roomId, newMsg) => {
      socket.emit('users-change', onlineUsers)
      
      const chatRoom = chatRooms.get(roomId)

      for (const member of chatRoom.values()) {
        if (!member.inRoom) {
          socket.to(member.socketId).emit("new-message", roomId, newMsg)
        }
      }
    })

    socket.on('leave', (roomId, user) => {
      socket.leave(roomId)
      const chatRoom = chatRooms.get(roomId)

      chatRoom.set(user.id, { socketId: socket.id, inRoom: false })
    })

    socket.on('user-off', (user) => {
      onlineUsers.delete(user.id)
      socket.emit('users-change', onlineUsers)
      socket.disconnect()
    })

    socket.on('remove-users', () => {
      onlineUsers = new Map()
    })
  });
  
  return res.end();
};

export default SocketHandler;

