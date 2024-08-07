import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import {refreshTokenSetup}  from '../services/refreshToken';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';

const clientId = "855612561721-95c9hbf997q5g6v237l122vf6jusmn33.apps.googleusercontent.com";

function Signup() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            await AuthService.signup(formData);
            navigate('/signin');
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const onSuccess = (res) => {
        console.log('Login Success: currentUser:', res.profileObj);
        navigate('/tasks');
        refreshTokenSetup(res);
      };
    
      const onFailure = (res) => {
        console.log('Login failed: res:', res);
        alert(
          `Failed to login.`
        );
      };

    return (
        <div>
            <h2 style={{ marginLeft:"500px",color:"#007FFF",}}>Sign Up</h2>
            <div style={{border:"2px solid #007FFF",width:"400px",padding:"20px",borderRadius:"10px",marginLeft:"500px",boxShadow: "0 4px 18px 0 rgba(0, 0, 0, 0.2)"}}>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required />
                <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                <button type="submit">Sign Up</button>
                <p style={{marginLeft:"40px"}}>Already have an account? 
                <Link to="/signin">Login</Link> </p>
            </form>
            <div style={{ marginLeft:"50px",width:"250px"}}>
            <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
        // clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
      </GoogleOAuthProvider>
      </div>
      </div>
        </div>
    );
}

export default Signup;
