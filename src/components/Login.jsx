import React, { useState } from 'react'
import { useNavigate, NavLink } from "react-router-dom";

function Login(props) {
    const  navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' })

    const hendleSubmit = async (e) => {
        e.preventDefault();
        const respons = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })

        });
        const json = await respons.json()
        console.log(json);
        if(json.success){
            //redirect
            localStorage.setItem('token',json.authToken)
            props.showAlert("Logged in successfully","success")
            navigate("/")

        }
        else{
           props.showAlert("Use a valid credentials","danger")
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (<>
        <form onSubmit={hendleSubmit} className="container">
            <h2>Login Your Account</h2>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name='email' aria-describedby="emailHelp" />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else. </div>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" value={credentials.password} onChange={onChange} id="password" name='password' />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <div className='container d-flex align-items-center justify-content-sm-end'>
        New to eNotebook?<NavLink className="nav-link" aria-current="page" to="/signup">Create an Account</NavLink>
        </div>
        </>
    )
}

export default Login;