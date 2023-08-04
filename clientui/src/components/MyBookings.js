import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function MyBookings(){
    const [userDetails, setUserDetails] = useState();
    const [bookingsData, setBookingsData] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkPrevLogin = localStorage.getItem("maxjet-app");

        if (checkPrevLogin) {
            const user = JSON.parse(checkPrevLogin);
            setUserDetails((prev) => user);
        } else {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        axios.post(`/flights/get-user-bookings/`, {
            "user_id": params.userId
        })
            .then((res) => {
                setBookingsData((prev) => [...prev, ...res.data.bookings]);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    return(
        <div>
            <TableContainer component={Paper} sx={{ margin: "30px" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Ticket</TableCell>
                            <TableCell align="center">Flight Name</TableCell>
                            <TableCell align="center">Flight Departure Time</TableCell>
                            <TableCell align="center">Flight Arrival Time</TableCell>
                            <TableCell align="center">Flight Departure</TableCell>
                            <TableCell align="center">Flight Destination</TableCell>
                            <TableCell align="center">Seats Booked</TableCell>
                            <TableCell align="center">Total Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookingsData?.map((flight, flightIndex) => (
                            <TableRow
                                key={flightIndex}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{flightIndex + 1}</TableCell>
                                <TableCell align="center">{flight.id}</TableCell>
                                <TableCell component="th" scope="row" align="center">
                                    {flight.company_name}
                                </TableCell>
                                <TableCell align="center">{flight.flight_departure_time}</TableCell>
                                <TableCell align="center">{flight.flight_arrival_time}</TableCell>
                                <TableCell align="center">{flight.flight_departure_from}</TableCell>
                                <TableCell align="center">{flight.flight_destination}</TableCell>
                                <TableCell align="center">{flight.number_of_seats}</TableCell>
                                <TableCell align="center">{flight.total_price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}