import { useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../providers/UserProvider";

const useSocket = () => {
  const socketCreated = useRef(false)
  const socketRef = useRef()
  const { user } = useContext(UserContext)
  useEffect(() => {
    if (!socketCreated.current) {
      const socketInitializer = async () => {
        await fetch('/api/socket')
      }
      try {
        socketInitializer()
        socketCreated.current = true

        socketRef.current = io('http://localhost:3000', {
          transports: ['websocket']
        })
      } catch (error) {
        console.log(error)
      }
    }
  }, []);

  return [socketRef, socketCreated]
};

export default useSocket