import React, { useRef, useState, useEffect } from 'react';
import { TextField, Button, Link } from '@mui/material';

import axios from '../api/axios';
const LOGIN_URL = '/authentication/sign_in';

const Login = () => {
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [errMsg, setErrMsg] = useState();
    const [success, setSuccess] = useState(false);
    const [userName, setUsername] = useState();

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(JSON.stringify({ email, password }))
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({
                    "user": {
                        "email": email,
                        "password": password
                    }
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': true
                    },
                    withCredentials: false
                }
            );
            console.log(JSON.stringify(response?.data));
            console.log(JSON.stringify(response))
            const accessToken = response?.data?.api_token;
            const roles = response?.data?.role;
            setUsername(response?.data?.name);
            setEmail('');
            setPassword('');
            setSuccess(true); // !!
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('MissingEsername or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Faild');
            }
        }
        // console.log(email, password);
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Hi, {userName}!</h1>
                    <br />
                    {/* <p>
                        <a href="#">Go to Home</a>
                    </p> */}
                </section>
            ) : (
                <section>
                    <h1> Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="email"
                            type="text"
                            id='email'
                            ref={emailRef}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            style={{ width: 400 }}
                            sx={{
                                mb: '2rem'
                            }}
                        /> <br />
                        <TextField
                            label="password"
                            type="password"
                            id='password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            style={{ width: 400 }}
                            sx={{
                                mb: '2rem'
                            }}
                        /> <br />
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ width: 400 }}
                        >
                            Log In
                        </Button>
                        <p>
                            <span className='line'>
                                {/* router link here */}
                                <Link href="#">Sing Up</Link>
                            </span>
                        </p>
                    </form>
                </section>
            )}
        </>
    )
}

// const userData = {
//     email: "user1@mail.com",
//     password: 123456
//     }
//     axios.post('https://example.com/createUser', userData)
//     .then(res => {
//        responseData = res.data
//        if (responseData.status == 'success') {
//          const user = responseData.user
//          ...
//        } else {
//          alert('Something went wrong while creating account')
//        }
//     })


export default Login;