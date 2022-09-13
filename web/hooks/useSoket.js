import { useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../providers/UserProvider";

const useSocket = () => {
  const socketCreated = useRef(false)
  const socketRef = useRef()
  const { user } = useContext(UserContext)
  useEffect(() => {
    if (!socketCreated.current && user) {
      const socketInitializer = async () => {
        await fetch('/api/socket')
      }
      try {
        socketInitializer()
        socketCreated.current = true

        socketRef.current = io('http://localhost:3000', {
          transports: ['websocket'],
          auth: user
        })
      } catch (error) {
        
      }
    }
  }, [user]);

  return [socketRef, socketCreated]
};

export default useSocket