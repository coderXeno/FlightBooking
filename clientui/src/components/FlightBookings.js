import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios";

export default function FlightBookings(){
    const params = useParams();
    const [bookings, setBookings] = useState([]);
    const [flightDetails, setFlightDetails] = useState();
    const [netEarnings, setNetEarnings] = useState();

    useEffect(() => {
        const data = {
            "user_id": params.userId,
            "flight_id": params.flightId
        };

        axios.post("/flights/flight-bookings/", data)
            .then((res) => {
                setBookings((prev) => [...prev, ...res.data.bookings]);
                setFlightDetails((prev) => res.data.flightDetails);
                setNetEarnings((prev) => res.data.netEarnings);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    return(
        <div>
            <div
                style={{ margin: "30px" }}
            >
                <h3>
                    All Bookings for Flight No. {flightDetails?.id + " "} 
                    from {" " + flightDetails?.flight_departure_from + " "} 
                    to {" " + flightDetails?.flight_destination}
                </h3>
                {netEarnings && <h4>
                    Net Earnings from the flight for {flightDetails?.company_name}: {netEarnings}
                </h4>}
            </div>
            <TableContainer component={Paper} sx={{ margin: "30px" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Consumer Name</TableCell>
                            <TableCell align="center">Seats Booked</TableCell>
                            <TableCell align="center">Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings?.map((flight, flightIndex) => (
                            <TableRow
                                key={flightIndex}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{flightIndex + 1}</TableCell>
                                <TableCell align="center">{flight.consumer_name}</TableCell>
                                <TableCell component="th" scope="row" align="center">
                                    {flight.number_of_seats}
                                </TableCell>
                                <TableCell align="center">{flight.total_price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};