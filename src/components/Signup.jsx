import React, {useState} from 'react'
import { useNavigate} from 'react-router-dom';

function Signup(props) {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: "", email: "", password: "" })

  const hendleSubmit = async (e) => {
    e.preventDefault();
    const respons = await fetch("http://localhost:5000/api/auth/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify({ name: user.name, email: user.email, password: user.password })

    });
    const json = await respons.json()
        console.log(json);

        if(json.success){
          //redirect
          navigate("/login")
          props.showAlert("Signup successfully please login ","success")
      }
      else{
        props.showAlert("Use a valid credentials","danger")
      }
  }

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  return (
    <div className='container'>
      <h2>Create a New Account </h2>
      <form onSubmit={hendleSubmit} className="container">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Enter Your Name</label>
          <input type="taxt" className="form-control" onChange={onChange} value={user.name} id="name" name='name' aria-describedby="name" required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" onChange={onChange} value={user.email} id="email" name='email' aria-describedby="emailHelp" required />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else. </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" value={user.password} onChange={onChange} id="password" name='password' required />
        </div>
        <button type="submit" className="btn btn-primary">SignUp</button>
      </form>
    </div>
  )
}

export default Signup