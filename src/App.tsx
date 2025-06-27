import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

function App() {
  useEffect(() => {
    const socket = new SockJS(import.meta.env.VITE_WS_URL);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("🟢 Conectado a WebSocket");

      client.subscribe("/topic/reservations", (message) => {
        console.log("📥 LLEGÓ MENSAJE:", message.body);
      });
    });
  }, []);

  return <div>Probando WebSocket...</div>;
}

export default App;
