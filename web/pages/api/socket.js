import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already attached');
    return res.end();
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  let onlineUsers = []

  io.on("connection", (socket) => {
    console.log("socket", socket.id);

    socket.on('user-online', user => {
      const findUser = onlineUsers.findIndex((onlineUser) => onlineUser?.user?.id === user.id)

      console.log(findUser);

      if (findUser >= 0) {
        onlineUsers[findUser].socketId = socket.id
      } else {
        onlineUsers.push({
          socketId: socket.id,
          user,
        })
      }

      socket.emit('users-change', onlineUsers)

      console.log(onlineUsers);
    })

    // Triggered when a peer hits the join room button.
    socket.on("join", (roomId) => {
      const {rooms} = io.sockets.adapter;
      const room = rooms.get(roomId);

      // room == undefined when no such room exists.
      if (room === undefined) {
        socket.join(roomId);
        // socket.emit("created");
      } else if (room.size === 1) {
        // room.size == 1 when one person is inside the room.
        socket.join(roomId);
        // socket.emit("joined");
      } else {
        // when there are already two people inside the room.
        // socket.emit("full");
      }
      console.log(rooms);
    });

    socket.on("message-change", (roomId, newMsg) => {
      console.log(roomId, newMsg);
      const { rooms } = io.sockets.adapter
      const room = rooms.get(roomId)

      if (room.size === 1) {
        const findUser = onlineUsers.find((onlineUser) => onlineUser.user.id === newMsg.to.id)

        if (findUser) {
          console.log("to", findUser.socketId);
          socket.to(findUser.socketId).emit('new-message', newMsg)
        }
      } else {
        socket.to(roomId).emit("update-message", newMsg)
      }
    })

    socket.on('leave', (roomId) => {
      socket.leave(roomId)
      const { rooms } = io.sockets.adapter

      console.log(`rooms`, rooms);
    })

    socket.on('user-off', (user) => {
      onlineUsers = onlineUsers.filter(onlineUser => onlineUser.user.id !== user.id)
      socket.emit('users-change', onlineUsers)
      socket.disconnect()
      console.log(onlineUsers);
    })

    socket.on('remove-users', () => {
      onlineUsers = []
      console.log("users", onlineUsers);
    })
  });
  
  return res.end();
};

export default SocketHandler;

