import React, { useEffect, useState } from "react";
import LoginIcon from '@mui/icons-material/Login';
import Container from "@mui/material/Container";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from "@mui/material";

export default function Auth(props) {
    const [signInStatus, setSignInStatus] = useState(true);
    const [height, setHeight] = useState(signInStatus === "true" ? "300px" : "500px");
    const [userEmail, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [pwd, setPassword] = useState("");
    const navigate = useNavigate();
    const [showPasswd, setShowPasswd] = useState(false);

    useEffect(() => {
        const checkPrevLogin = localStorage.getItem("maxjet-app");

        if (checkPrevLogin) {
            const user = JSON.parse(checkPrevLogin);
            setSignInStatus(true);
            navigate(`/home/${user.id}`);
        }
    }, []);

    const handleLogin = (event) => {
        event.preventDefault();
        const data = {
            username: username,
            password: pwd
        }

        fetch(`/flights/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(res => {
                localStorage.setItem("maxjet-app", JSON.stringify(res.user));
                // props.handleLogIn();
                navigate(`/home/${res.user.id}`);
            })
            .catch((err) => console.log(err));
    };

    const handleRegister = (event) => {
        event.preventDefault();
        const data = {
            username: username,
            email: userEmail,
            password: pwd
        }

        fetch(`/flights/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(res => {
                localStorage.setItem("maxjet-app", JSON.stringify(res.user));
                // props.handleLogIn();
                navigate(`/home/${res.user.id}`);
            })
            .catch((err) => console.log(err));
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    const handleShowPassword = (event) => {
        setShowPasswd(prev => !prev);
    }

    return (
        <div
            style={{ 
                maxHeight: window.innerHeight, 
                background: "white", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                marginTop: '10%' 
            }}
        >
            <Container
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    backgroundColor: "#001e3c",
                    borderRadius: "10px",
                    height: signInStatus ? "350px": "425px",
                    width: "500px"
                }}
            >
                {
                    signInStatus ?
                        <form style={{ display: "flex", flexDirection: "column", marginTop: "4%" }}>
                            <h3 
                                style={{ 
                                    marginBottom: "20px", 
                                    color: "white", 
                                    textAlign: "center" 
                                }} 
                            >
                                Login to Formr
                            </h3>
                            <TextField 
                                required 
                                id="outlined-basic" 
                                label="Username" 
                                variant="outlined" 
                                sx={{ marginBottom: "30px" }} 
                                onChange={(event) => setUserName(event.target.value)} 
                                InputProps={{
                                    style: {
                                        backgroundColor: "white"
                                    }
                                }}
                            />
                            {/* <TextField 
                                required 
                                id="outlined-basic" 
                                label="Password" 
                                variant="outlined" 
                                sx={{ marginBottom: "30px" }} 
                                onChange={(event) => setPassword(event.target.value)} 
                                InputProps={{
                                    style: {
                                        backgroundColor: "white"
                                    }
                                }}
                            /> */}
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPasswd ? 'text' : 'password'}
                                value={pwd}
                                onChange={(event) => setPassword(event.target.value)}
                                sx={{backgroundColor:"white"}}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                    {showPasswd ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                placeholder="Password"
                            />
                            <Button 
                                variant="contained" 
                                startIcon={<LoginIcon />} 
                                onClick={handleLogin} 
                                disabled = { username.length > 0 && pwd.length > 0 ? false : true }
                                sx={{ marginTop: "15px" }}
                            >
                                Login
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={(event) => setSignInStatus(false)} 
                                sx={{ marginTop: "15px" }}
                            >
                                Register
                            </Button>
                        </form> :
                        <form style={{ display: "flex", flexDirection: "column", marginTop: "4%" }}>
                            <h3 style={{ marginBottom: "20px", color: "white", textAlign: "center" }} >Sign Up</h3>
                            <TextField 
                                required 
                                id="outlined-basic" 
                                label="Email" 
                                variant="outlined" 
                                sx={{ marginBottom: "30px" }} 
                                onChange={(event) => setEmail(event.target.value)} 
                                InputProps={{
                                    style: {
                                        backgroundColor: "white"
                                    }
                                }}
                            />
                            <TextField 
                                required 
                                id="outlined-basic" 
                                label="Username" 
                                variant="outlined" 
                                sx={{ marginBottom: "30px" }} 
                                onChange={(event) => setUserName(event.target.value)} 
                                InputProps={{
                                    style: {
                                        backgroundColor: "white"
                                    }
                                }}
                            />
                            {/* <TextField 
                                required 
                                id="outlined-basic" 
                                label="Password" 
                                variant="outlined" 
                                sx={{ marginBottom: "30px" }} 
                                onChange={(event) => setPassword(event.target.value)} 
                                InputProps={{
                                    style: {
                                        backgroundColor: "white"
                                    }
                                }}
                            /> */}
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPasswd ? 'text' : 'password'}
                                value={pwd}
                                onChange={(event) => setPassword(event.target.value)}
                                sx={{backgroundColor:"white"}}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                    {showPasswd ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                placeholder="Password"
                            />
                            <Button 
                                variant="contained" 
                                startIcon={<LoginIcon />} 
                                onClick={handleRegister} 
                                disabled = { userEmail.length > 0 && username.length > 0 && pwd.length > 0 ? false : true } 
                                sx={{ marginTop: "15px" }}
                            >
                                Register!
                            </Button>
                            <Button 
                                variant="contained" 
                                startIcon={<LoginIcon />} 
                                onClick={(event) => setSignInStatus(true)} sx={{ marginTop: "15px" }}
                            >
                                Already Registered? Login
                            </Button>
                        </form>
                }
            </Container>
        </div>
    );
};