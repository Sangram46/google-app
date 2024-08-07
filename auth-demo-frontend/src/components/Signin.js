
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import {refreshTokenSetup}  from '../services/refreshToken';
// import { GoogleLogin } from '@leecheuk/react-google-login';
// import { GoogleLogin } from 'react-google-login';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';

const clientId = "855612561721-95c9hbf997q5g6v237l122vf6jusmn33.apps.googleusercontent.com";

function Signin() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await AuthService.signin(formData);
            navigate('/tasks');
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    // const onSuccess = async (response) => {
    //     try {
    //         const res = await AuthService.googleSignin(response.tokenId);
    //         if (res.accessToken) {
    //             navigate('/tasks');
    //         }
    //     } catch (error) {
    //         alert(error.response.data.message);
    //     }
    // };

    // const onFailure = (response) => {
    //     console.log('Google Sign In was unsuccessful. Try again later.');
    // };

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
            <h2 style={{ marginLeft:"500px",color:"#007FFF",}}>Login</h2>
            <div style={{border:"2px solid #007FFF",width:"400px",padding:"20px",borderRadius:"10px",marginLeft:"500px",boxShadow: "0 4px 18px 0 rgba(0, 0, 0, 0.2)"}}>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <button type="submit">Login</button>
                <p style={{marginLeft:"40px"}}>Don't have an account? 
                    <Link to="/signup">Sign Up</Link> </p>
            </form>
            {/* <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
            /> */}
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

export default Signin;
