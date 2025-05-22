import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/layout.tsx';
import HotelPages from './hotel/pages/hotelPages.tsx';
import RoomPage from './room/pages/roomPage.tsx';
import EventPage from './events/pages/eventsPages.tsx';
import ExperiencesPage from './Experiences/pages/experiencesPage.tsx';
import RestaurantPage from './Restaurant/pages/restaurantPages.tsx';
import { RoomFormPage } from './room/pages/roomFormPage.tsx';
import { LoginPages } from './login/pages/loginPages.tsx';
import { ReservationPage } from './reservation/pages/reservationPage.tsx';
import { Bounce, ToastContainer } from 'react-toastify';
import { CategoryPage } from './category/pages/categoryPage.tsx';
import { PrivateRoute } from './layout/PrivateRoute.tsx';// Ajusta la ruta según tu estructura

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginPages />} />
        <Route path="/login" element={<LoginPages />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="hotel" element={<HotelPages />} />
          <Route path="reservaciones" element={<ReservationPage />} />
          <Route path="habitaciones" element={<RoomPage />} />
          <Route path="habitaciones/new" element={<RoomFormPage />} />
          <Route path="eventos" element={<EventPage />} />
          <Route path="experiencias" element={<ExperiencesPage />} />
          <Route path="restaurante" element={<RestaurantPage />} />
          <Route path="categorias" element={<CategoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
