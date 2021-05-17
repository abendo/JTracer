import React, { useState } from 'react';
import './Forms.css';
import logo from '../../img/JTracer_Logo.png';
import { withRouter } from "react-router-dom";
import AuthService from "../../services/AuthService";

// https://getbootstrap.com/docs/4.3/components/forms/
// in react we use className to give class to certain tag instead of class since it follows the rules of jsx code not HTML

function RegistrationForm(props) {

    const [state, setState] = useState({
        name:"",
        email: "",
        password: "",
        confirm_password:"",
        user_type:"",
        address:"",
        phone:""
    })

    //this function handles all the changes made to the state variables
    const handleChange = (e) => {
        const { name, value } = e.target
        setState(prevState => ({
            ...prevState,
            [name]: value
        }))
        
        var address = document.getElementById("address");
        var phone = document.getElementById("phone");

        if(document.getElementById("faculty_member").checked) {
            address.type = "hidden";
            address.required = false;

            phone.type = "hidden";
            phone.required = false;

        } else if(document.getElementById("external_guest").checked) {
            address.type = "text";
            address.required = true;

            phone.type = "text";
            phone.required = true;
            
        } else {
            address.type = "hidden";
            address.required = false;

            phone.type = "hidden";
            phone.required = false;
        }

    }
    
    const handleSubmitClick = (e) => {
        e.preventDefault();
        // prevents the default form submit action to take place
        if(document.getElementById("faculty_member").checked) {
            var faculty_email = document.getElementById("email").value;
    
            if(!faculty_email.includes("@jacobs-university.de")) { 
                setState(prevState=>({
                    ...prevState,
                    error_message: "Jacobs email required. Otherwise register as an external guest."
                }))
            } else {
                if(state.password === state.confirm_password) {
                    AuthService.register(state.email, state.password, state.user_type, state.address, state.phone)
                    .then(() => {
                        redirectToSuccess();
                    })
                    .catch(()=> {
                        alert('Registration failed.');
                    })
                } else {
                    setState(prevState=>({
                        ...prevState,
                        error_message: "Passwords do not match."
                    }))
                }
            }
        } else if(document.getElementById("external_guest").checked) {
            if(state.address === "" || state.phone === "") {
                setState(prevState=>({
                    ...prevState,
                    error_message: "Please provide your address and phone number."
                }))
            } else {
                if(state.password === state.confirm_password) {
                    AuthService.register(state.email, state.password, state.user_type, state.address, state.phone)
                    .then(() => {
                        redirectToSuccess();
                    })
                    .catch(()=> {
                        alert('Registration failed.');
                    })
                } else {
                    setState(prevState=>({
                        ...prevState,
                        error_message: "Passwords do not match."
                    }))
                }
            }
        } 
    }
    
    const redirectToSuccess = () => {
        props.history.push('/registerSuccess/'); 
    }

    const redirectToLogin = () => {
        props.history.push('/login'); 
    }

    return (
        <div align="center">
            <form className="form-signin" action="http://0.0.0.0:8086/register" method="POST">
                <img className="mb-4" src={logo} alt="" width="100%"/>
                <h1 className="h3 mb-3 font-weight-normal">Please fill the details to register</h1>

                <div>
                    <label htmlFor="InputName" className="sr-only" />
                    <input type="text" className="form-control" id="name" placeholder="Enter full name" name="name" value={state.name} onChange={handleChange} required/>
                </div>

                <div>
                    <label htmlFor="InputEmail1" className="sr-only" />
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" value={state.email} onChange={handleChange} required/>
                </div>

                <div>
                    <label htmlFor="InputPassword1" className="sr-only"/>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={state.password} onChange={handleChange} required/>
                </div>

                <div>
                    <label htmlFor="InputPassword2" className="sr-only"/>
                    <input type="password" className="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm Password" value={state.confirm_password} onChange={handleChange} required/>
                </div>

                <div>
                    <label htmlFor="Address" className="sr-only"/>
                    <input type="hidden" className="form-control" id="address" name="address" placeholder="Address" value={state.address} onChange={handleChange}/>
                </div>

                <div>
                    <label htmlFor="PhoneNumber" className="sr-only"/>
                    <input type="hidden" className="form-control" id="phone" name="phone" placeholder="Phone Number" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" value={state.phone} onChange={handleChange}/>
                </div>

                <div className="usertype">
                    <span className="first">
                        <label>
                            <input type="radio" name="user_type" id="faculty_member" value="faculty_member" checked={state.user_type==='faculty_member'} onChange={handleChange} required/> Faculty
                        </label>
                     </span>
                
                    <span className="second">
                        <label>
                            <input type="radio" name="user_type" id="external_guest" value="external_guest" checked={state.user_type==='external_guest'}  onChange={handleChange}/> Guest
                        </label>
                    </span>
                </div>
                { state.error_message &&
                        <span className="error"> { state.error_message } </span> }
                <button type="submit" className="btn btn-lg btn-primary btn-block" onClick={handleSubmitClick}> Register </button>
                
                <div className="mt-2">
                    <span>Already have an account? </span>
                    <span className="RegisterHere" onClick={redirectToLogin}>Login here</span>
                </div>
            </form>
        </div>
    )
}
export default withRouter(RegistrationForm);