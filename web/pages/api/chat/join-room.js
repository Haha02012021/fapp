export default (req, res) => {
    if (req.method === "POST") {
      // get message
      const roomId = req.body;
  
      // dispatch to channel "message"
      res?.socket?.server?.io?.socket.join(roomId)
  
      // return message
      res.status(201).json(roomId);
    }
  };
  