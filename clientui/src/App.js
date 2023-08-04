import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from './components/Auth';
import Home from './components/Home';
import MyBookings from './components/MyBookings';
import FlightBookings from './components/FlightBookings';

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home/:userId" element={<Home />} />
          <Route path="/my-bookings/:userId" element={<MyBookings />} />
          <Route path="/flight-bookings/:userId/:flightId" element={<FlightBookings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}