import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deepPurple } from '@mui/material/colors';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import axios from "axios";

export default function Home(){    
    const [userDetails, setUserDetails] = useState();
    const [bookingCreationModal, setBookingCreationModal] = useState(false);
    const [flightCreationModal, setFlightCreationModal] = useState(false);
    const [destinationAirports, setDestinationAirports] = useState([]);
    const [departureAirports, setDepartureAirports] = useState([]);
    const [departureAirportSelected, setDepartureAirportSelected] = useState("");
    const [destinationAirportSelected, setDestinationAirportSelected] = useState("");
    const [selectedFlightDetails, setSelectedFlightDetails] = useState();
    const [pageChanged, setPageChanged] = useState(false);
    const [bookedSeats, setBookedSeats] = useState(0);
    const [searchOn, setSearchOn] = useState(false);
    const [searchedFlight, setSearchedFlight] = useState([]);
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");
    const [allFlights, setAllFlights] = useState([]);
    const [toDeleteFlight, setToDeleteFlight] = useState();
    const [flightDeletionModal, setFlightDeletionModal] = useState(false);
    const [company, setCompany] = useState();
    const [destination, setDestination] = useState();
    const [departureFrom, setDepartureFrom] = useState()
    const [arrivalAt, setArrivalAt] = useState();
    const [departureTime, setDepartureTime] = useState();
    const [arrivalTime, setArrivalTime] = useState();
    const [seatsAvailable, setSeatsAvailable] = useState();
    const [price, setPrice] = useState();
    const [duration, setDuration] = useState();
    const navigate = useNavigate();
    const params = useParams();

    const handleBookingCreationModalClose = () => setBookingCreationModal(false);
    const handleBookingCreationModalShow = () => setBookingCreationModal(true);

    const handleFlightDeletionModalClose = () => setFlightDeletionModal(false);
    const handleFlightDeletionModalShow = () => setFlightDeletionModal(true);

    const handleFlightAdditionModalClose = () => setFlightCreationModal(false);
    const handleFlightAdditionModalShow = () => setFlightCreationModal(true);

    useEffect(() => {
        const checkPrevLogin = localStorage.getItem("maxjet-app");

        if (checkPrevLogin) {
            const user = JSON.parse(checkPrevLogin);
            setUserDetails((prev) => user);
            toast.success(`Hi ${user?.name}`);
        } else {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        axios.post(`/flights/get-destinations/`, {
            user_id: params.userId
        })
            .then((res) => {
                setDepartureAirports((prev) => [...prev, ...res.data.departureAirports]);
                setDestinationAirports((prev) => [...prev, ...res.data.destinationAirports]);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    useEffect(() => {
        axios.post(`/flights/get-all-flights/`, {
            user_id: params.userId
        })
            .then((res) => {
                setAllFlights((prev) => [...prev, ...res.data.allFlights]);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [pageChanged]);

    const handleBookTickets = (event) => {
        let data = {
            "user_id": params.userId,
            "flight_id": selectedFlightDetails?.id,
            "seatsToBook": bookedSeats
        };

        axios.post('/flights/book-flight/', data)
            .then((res) => {
                if(res.data.success === true){
                    handleBookingCreationModalClose();
                    toast.success("Flight Booked Successfully! Enjoy your flight!");
                    setPageChanged((prev) => !prev);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const handleAddFlight = (event) => {
        let startTime = new Date(departureTime.$d);
        let startHour = startTime.getHours();
        let startAmPm = "AM";

        let endTime = new Date(arrivalTime.$d);
        let endHour = endTime.getHours();
        let endAmPm = "AM";

        if (startHour > 11) {
            startAmPm = "PM";
            startHour -= 12;
            endAmPm = "PM"
            endHour -= 12;
        }

        if (endHour > 11) {
            endAmPm = "PM"
            endHour -= 12;
        }

        const formattedStartTime = `0${startHour}:${startTime.getMinutes()}0 ${startAmPm}`;
        const formattedEndTime = `0${endHour}:${endTime.getMinutes()}0 ${endAmPm}`;

        let data = {
            "company": company,
            "destination": destination,
            "departureFrom": departureFrom,
            "departureTime": formattedStartTime,
            "arrivalTime": formattedEndTime,
            "seatsAvailable": seatsAvailable,
            "price": price,
            "duration": duration,
            "user_id": params.userId
        }

        axios.post(`/flights/add-flight/`, data)
            .then((res) => {
                if(res.data.success && res.data.success === true){
                    handleFlightAdditionModalClose();
                    toast.success("Flight was added successfully!");
                    setPageChanged((prev) => !prev);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const handleRemoveFlight = (event) => {
        const data = {
            "user_id": params.userId,
            "flightId": toDeleteFlight.id
        }

        axios.post('/flights/remove-flight/', data)
            .then((res) => {
                if(res.data.success && res.data.success === true){
                    handleFlightDeletionModalClose();
                    toast.success("Flight removed successfully!");
                    setPageChanged((prev) => !prev);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const handleSearchFlights = (event) => {
        let startTime = new Date(selectedStartTime.$d);
        let startHour = startTime.getHours();
        let startAmPm = "AM";

        let endTime = new Date(selectedEndTime.$d);
        let endHour = endTime.getHours();
        let endAmPm = "AM";

        if (startHour > 11) {
            startAmPm = "PM";
            startHour -= 12;
            endAmPm = "PM"
            endHour -= 12;
        }

        if (endHour > 11) {
            endAmPm = "PM"
            endHour -= 12;
        }

        const formattedStartTime = `0${startHour}:${startTime.getMinutes()}0 ${startAmPm}`;
        const formattedEndTime = `0${endHour}:${endTime.getMinutes()}0 ${endAmPm}`;

        const data = {
            "startTime": formattedStartTime,
            "endTime": formattedEndTime,
            "destination": destinationAirportSelected,
            "departureFrom": departureAirportSelected
        }

        axios.post('/flights/get-flights/', data)
            .then((res) => {
                if(res.data.success === true){
                    setSearchedFlight((prev) => [...prev, res.data.flight_data]);
                    setSearchOn((prev) => true);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };
    
    return(
        <div
            style={{
                display: "flex",
                flexDirection: "column"
            }}
        >
            <div
                style={{
                    display: "flex"
                }}
            >
                {userDetails && <div
                    style={{
                        height: "100px", 
                        width: "500px",
                        margin: "30px",
                        padding: "20px",
                        borderRadius: "20px"
                    }}
                >
                    <Card sx={{background: "#2b283a", color: "white"}}>
                        <CardHeader 
                            avatar={<Avatar 
                                sx={{ 
                                    bgcolor: deepPurple[500], 
                                    width: "50px", height: '50px',
                                    border: "4px solid #2b283a",
                                    outline: "3px solid white" 
                                }}
                            >
                                {userDetails.name.substr(0,1)}
                                {userDetails.name.substr(userDetails.name - 1, 1)}
                            </Avatar>}
                            title={<Typography>Hi, {userDetails.name}👋</Typography>}
                            subheader={
                                <Typography>
                                    Currently using 
                                    {userDetails?.is_admin === false ? " NORMAL " : " ADMIN "}
                                    Dashboard
                                </Typography>
                            }
                        />
                    </Card>
                </div>}
                <Button
                    variant="contained"
                    onClick={(event) => navigate(`/my-bookings/${params.userId}`)}
                    sx={{ height: "50px", marginTop: "65px", marginRight: "35px" }}
                >
                    View My Bookings
                </Button>
                {userDetails?.is_admin && <Button
                    variant="contained"
                    onClick={handleFlightAdditionModalShow}
                    sx={{ height: "50px", marginTop: "65px", marginRight: "35px" }}
                >
                    Add New Flight
                </Button>}
                <Button
                    variant="contained"
                    onClick={(event) => {
                        localStorage.removeItem("maxjet-app");
                        navigate("/");
                    }}
                    sx={{ height: "50px", marginTop: "65px" }}
                >
                    Logout
                </Button>
            </div>
            <div
                style = {{ display: 'flex' }}
            >
                {departureAirports && <Autocomplete
                    disablePortal
                    options={[...new Set(departureAirports)]}
                    value={departureAirportSelected}
                    onChange={(event, newValue) => setDepartureAirportSelected((prev) => newValue)}
                    sx={{ width: 300, marginRight: "40px", marginLeft: "50px", marginTop: "8px" }}
                    renderInput={(params) => <TextField {...params} label="Departure Airport" />}
                />}

                {destinationAirports && <Autocomplete
                    disablePortal
                    options={[...new Set(destinationAirports)]}
                    value={destinationAirportSelected}
                    onChange={(event, newValue) => setDestinationAirportSelected((prev) => newValue)}
                    sx={{ width: 300, marginTop: "8px", marginRight: '40px' }}
                    renderInput={(params) => <TextField {...params} label="Destination Airport" />}
                />}

                <div style={{ marginRight: "40px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['TimePicker']}>
                            <TimePicker 
                                label="Start Time" 
                                value={selectedStartTime}
                                onChange={(newValue) => setSelectedStartTime((prev) => newValue)}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>

                <div style={{ marginRight: "40px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['TimePicker']}>
                            <TimePicker 
                                label="End time" 
                                value={selectedEndTime}
                                onChange={(newValue) => setSelectedEndTime((prev) => newValue)}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>

                <Button 
                    variant="contained"
                    sx={{ marginLeft: "30px", height: "50px", marginTop: "8px" }}
                    disabled={
                        departureAirportSelected == "" 
                        || destinationAirportSelected == ""
                        || selectedStartTime == ""
                        || selectedEndTime == ""
                    }
                    onClick={handleSearchFlights}
                >
                    Search Flights
                </Button>

                <Button 
                    variant="contained"
                    sx={{ marginLeft: "30px", height: "50px", marginTop: "8px" }}
                    disabled={
                        departureAirportSelected == "" 
                        || destinationAirportSelected == ""
                        || selectedStartTime == ""
                        || selectedEndTime == ""
                    }
                    onClick={(event) => {
                        setDepartureAirportSelected((prev) => "");
                        setDestinationAirportSelected((prev) => "");
                        setSelectedStartTime((prev) => "");
                        setSelectedEndTime((prev) => "");
                        setSearchOn((prev) => false);
                    }}
                >
                    Clear Selections
                </Button>
            </div>
            <TableContainer component={Paper} sx={{ margin: "30px" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Flight Name</TableCell>
                            <TableCell align="center">Flight Departure Time</TableCell>
                            <TableCell align="center">Flight Arrival Time</TableCell>
                            <TableCell align="center">Flight Departure</TableCell>
                            <TableCell align="center">Flight Destination</TableCell>
                            <TableCell align="center">Flight Duration</TableCell>
                            <TableCell align="center">Flight Price</TableCell>
                            <TableCell align="center">Seats Available</TableCell>
                            <TableCell align="center">Booking</TableCell>
                            {userDetails?.is_admin && <TableCell align="center">Booking History</TableCell>}
                            {userDetails?.is_admin && <TableCell align="center">Remove</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchOn === false && allFlights?.map((flight, flightIndex) => (
                            <TableRow
                                key={flightIndex}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{flightIndex + 1}</TableCell>
                                <TableCell component="th" scope="row" align="center">
                                    {flight.company_name}
                                </TableCell>
                                <TableCell align="center">{flight.flight_departure_time}</TableCell>
                                <TableCell align="center">{flight.flight_arrival_time}</TableCell>
                                <TableCell align="center">{flight.flight_departure_from}</TableCell>
                                <TableCell align="center">{flight.flight_destination}</TableCell>
                                <TableCell align="center">{flight.flight_duration}</TableCell>
                                <TableCell align="center">{flight.flight_price}</TableCell>
                                <TableCell align="center">{flight.no_of_seats}</TableCell>
                                <TableCell align="center">
                                    <Button 
                                        variant="contained"
                                        onClick={(event) => {
                                            setSelectedFlightDetails((prev) => flight);
                                            handleBookingCreationModalShow();
                                        }}
                                    >
                                        Book Seats
                                    </Button>    
                                </TableCell>
                                {userDetails?.is_admin && <TableCell align="center">
                                    <Button 
                                        variant="contained"
                                        onClick={(event) => {
                                            navigate(`/flight-bookings/${params.userId}/${flight.id}`)
                                        }}
                                    >
                                        View Bookings
                                    </Button>    
                                </TableCell>}
                                {userDetails?.is_admin && <TableCell align="center">
                                    <Button 
                                        variant="contained"
                                        onClick={(event) => {
                                            setToDeleteFlight((prev) => flight);
                                            handleFlightDeletionModalShow();
                                        }}
                                    >
                                        Remove Flight
                                    </Button>    
                                </TableCell>}
                            </TableRow>
                        ))}
                        {searchOn === true && searchedFlight?.map((flight, flightIndex) => (
                            <TableRow
                                key={flightIndex}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{flightIndex + 1}</TableCell>
                                <TableCell component="th" scope="row" align="center">
                                    {flight.company_name}
                                </TableCell>
                                <TableCell align="center">{flight.flight_departure_time}</TableCell>
                                <TableCell align="center">{flight.flight_arrival_time}</TableCell>
                                <TableCell align="center">{flight.flight_departure_from}</TableCell>
                                <TableCell align="center">{flight.flight_destination}</TableCell>
                                <TableCell align="center">{flight.flight_duration}</TableCell>
                                <TableCell align="center">{flight.flight_price}</TableCell>
                                <TableCell align="center">{flight.no_of_seats}</TableCell>
                                <TableCell align="center">
                                    <Button 
                                        variant="contained"
                                        onClick={(event) => {
                                            setSelectedFlightDetails((prev) => flight);
                                            handleBookingCreationModalShow();
                                        }}
                                    >
                                        Book Seats
                                    </Button>    
                                </TableCell>
                                {userDetails?.is_admin && <TableCell align="center">
                                    <Button 
                                        variant="contained"
                                        onClick={handleBookingCreationModalShow}
                                    >
                                        Remove Flight
                                    </Button>    
                                </TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                aria-labelledby="booking-creation-modal-title"
                aria-describedby="booking-creation-modal-description"
                open={bookingCreationModal}
                onClose={handleBookingCreationModalClose}
                closeAfterTransition
            >
                <Fade in={bookingCreationModal}>
                    <div
                        style={{
                            position: "fixed",
                            top: "30%",
                            left: "40%",
                            width: "400px",
                            background: "white",
                        }}
                    >  
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginLeft: "30px",
                                marginRight: "30px"
                            }}
                        >
                            <h3
                                style={{
                                    paddingBottom: "15px",
                                    borderBottom: "0.1px solid black"
                                }}
                            >
                                Book seats for flight 
                                {" " + selectedFlightDetails?.flight_departure_from + " "} 
                                to {selectedFlightDetails?.flight_destination}!
                            </h3>
                            <Autocomplete
                                disablePortal
                                options={
                                    selectedFlightDetails?.no_of_seats > 5 ? 
                                    [...new Set([1,2,3,4,5])] : 
                                    [...new Set(Array.from({ 
                                        length:  selectedFlightDetails?.no_of_seats
                                    }, (_, i) => i + 1))]
                                }
                                value={bookedSeats}
                                onChange={(event, newValue) => setBookedSeats((prev) => newValue)}
                                sx={{ width: 300, marginRight: "40px", marginLeft: "50px" }}
                                renderInput={(params) => 
                                    <TextField {...params} 
                                        label="Select Seats(Upto 5)" 
                                    />
                                }
                            />
                            {bookedSeats !== 0 && <Typography>Net Price: {bookedSeats * selectedFlightDetails?.flight_price} $</Typography>}
                            <div
                                style={{ 
                                    paddingTop: "15px", 
                                    paddingBottom: "15px",
                                    display: "flex",
                                    justifyContent: "flex-end"
                                }}
                            >
                                <Button 
                                    variant="contained" 
                                    color="error"
                                    onClick={handleBookingCreationModalClose}
                                    style={{ marginRight: "10px" }}
                                >
                                    Exit
                                </Button>
                                <Button 
                                    variant="contained"
                                    onClick={handleBookTickets}
                                    disabled={bookedSeats === 0 ? true : false}
                                >
                                    Book Seats
                                </Button>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="flight-deletion-modal-title"
                aria-describedby="flight-deletion-modal-description"
                open={flightDeletionModal}
                onClose={handleFlightDeletionModalClose}
                closeAfterTransition
            >
                <Fade in={flightDeletionModal}>
                    <div
                        style={{
                            position: "fixed",
                            top: "30%",
                            left: "40%",
                            width: "400px",
                            background: "white",
                        }}
                    >  
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginLeft: "30px",
                                marginRight: "30px"
                            }}
                        >
                            <h3
                                style={{
                                    paddingBottom: "15px",
                                    borderBottom: "0.1px solid black"
                                }}
                            >
                                Do you want to remove flight from
                                {" " + toDeleteFlight?.flight_departure_from + " "} 
                                to {toDeleteFlight?.flight_destination}!
                            </h3>
                            <div
                                style={{ 
                                    paddingTop: "15px", 
                                    paddingBottom: "15px",
                                    display: "flex",
                                    justifyContent: "flex-end"
                                }}
                            >
                                <Button 
                                    variant="contained" 
                                    color="error"
                                    onClick={handleFlightDeletionModalClose}
                                    style={{ marginRight: "10px" }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="contained"
                                    onClick={handleRemoveFlight}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="flight-creation-modal-title"
                aria-describedby="flight-creation-modal-description"
                open={flightCreationModal}
                onClose={handleFlightAdditionModalClose}
                closeAfterTransition
            >
                <Fade in={flightCreationModal}>
                    <div
                        style={{
                            position: "fixed",
                            top: "10%",
                            left: "40%",
                            width: "400px",
                            background: "white",
                        }}
                    >  
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginLeft: "30px",
                                marginRight: "30px"
                            }}
                        >
                            <h3
                                style={{
                                    paddingBottom: "15px",
                                    borderBottom: "0.1px solid black"
                                }}
                            >
                                Add Details of New Flight
                            </h3>
                            
                            <TextField 
                                value={company} 
                                placeholder="Flight Company Name" 
                                onChange={(event) => setCompany((prev) => event.target.value)}
                                sx={{ marginBottom: "15px" }}
                            />
                            <TextField 
                                value={departureFrom} 
                                placeholder="Departure From" 
                                onChange={(event) => setDepartureFrom((prev) => event.target.value)}
                                sx={{ marginBottom: "15px" }}
                            />
                            <TextField 
                                value={destination} 
                                placeholder="Destination" 
                                onChange={(event) => setDestination((prev) => event.target.value)}
                                sx={{ marginBottom: "15px" }}
                            />
                            <TextField 
                                value={seatsAvailable} 
                                placeholder="No of seats on flight" 
                                onChange={(event) => setSeatsAvailable((prev) => event.target.value)}
                                sx={{ marginBottom: "15px" }}
                            />
                            <TextField 
                                value={price} 
                                placeholder="Price per seat" 
                                onChange={(event) => setPrice((prev) => event.target.value)}
                                sx={{ marginBottom: "15px" }}
                            />
                            <TextField 
                                value={duration} 
                                placeholder="Duration of Flight" 
                                onChange={(event) => setDuration((prev) => event.target.value)}
                                sx={{ marginBottom: "15px" }}
                            />

                            <div
                                style={{ marginBottom: "15px" }}
                            >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker 
                                            label="Start time" 
                                            value={departureTime}
                                            onChange={(newValue) => setDepartureTime((prev) => newValue)}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>

                            <div
                                style={{ marginBottom: "15px" }}
                            >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker 
                                            label="End time" 
                                            value={arrivalTime}
                                            onChange={(newValue) => setArrivalTime((prev) => newValue)}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>

                            <div
                                style={{ 
                                    paddingTop: "15px", 
                                    paddingBottom: "15px",
                                    display: "flex",
                                    justifyContent: "flex-end"
                                }}
                            >
                                <Button 
                                    variant="contained" 
                                    color="error"
                                    onClick={handleBookingCreationModalClose}
                                    style={{ marginRight: "10px" }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="contained"
                                    onClick={handleAddFlight}
                                    // disabled={bookedSeats === 0 ? true : false}
                                >
                                    Add Flight
                                </Button>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
            <ToastContainer />
        </div>
    )
}