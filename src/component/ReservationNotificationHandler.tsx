
import { useReservationSocketWithCount } from "../hooks/useReservationSocket";
import Swal from "sweetalert2";

const ReservationNotificationHandler = () => {
  useReservationSocketWithCount((data) => {
    Swal.fire({
      title: '📢 Nueva reserva',
      html: `
        <b>Nombre:</b> ${data.name}<br />
        <b>Código:</b> ${data.reservationCode}<br />
        <b>Fecha:</b> ${data.initDate}<br />
        <b>Resumen:</b> ${data.roomSummary}
      `,
      icon: 'info',
      toast: true,
      position: 'top-end',
      timer: 6000,
      showConfirmButton: false,
    });
  });

  return null; // Este componente no necesita renderizar nada visual
};

export default ReservationNotificationHandler;
