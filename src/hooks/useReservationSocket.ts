import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

export interface ReservationNotificationDTO {
  reservationCode: string;
  name: string;
  initDate: string;
  roomSummary: string;
}

export const useReservationSocketWithCount = (
  onNewReservation?: (data: ReservationNotificationDTO) => void
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws-reservations";
    const socket = new SockJS(WS_URL);
    const stompClient: CompatClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/reservations", (message) => {
        const data: ReservationNotificationDTO = JSON.parse(message.body);

        setCount((prev) => prev + 1);
        if (onNewReservation) onNewReservation(data); // ✅ pasa el DTO completo
      });
    });

    return () => {
      stompClient.disconnect(() => {
        console.log("WebSocket desconectado");
      });
    };
  }, [onNewReservation]);

  return {
    count,
    clearCount: () => setCount(0),
  };
};
