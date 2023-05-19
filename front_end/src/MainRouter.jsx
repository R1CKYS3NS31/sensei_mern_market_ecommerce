import React from 'react'
import { Link, Route, Routes } from "react-router-dom";

// pages
import { Home } from "./pages/Home";
import { Users } from './components/user/Users';
import { Signup } from './components/user/Signup';
import { Signin } from './components/auth/Signin';
import { Profile } from './components/user/Profile';
import { EditProfile } from './components/user/EditProfile';
import { PrivateRoute } from './components/auth/PrivateRoute';


export const MainRouter = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<Home />}
                // element={!user ? <SignInSide /> : <Home user={user} />}
                exact
            />
            {/* <Route
                path="/users"
                element={<Users />}
                // element={!user ? <SignInSide /> : <Home user={user} />}
                
            /> */}
            <Route path="/users" element={<Users/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/signin" element={<Signin/>} />
            <Route path="/user/edit/:userId" element={<PrivateRoute component={EditProfile}/>}/>
            <Route path="/user/:userId" element={<Profile/>} />


            {/* no route */}
            <Route
                path="*"
                element={
                    <main
                        style={{
                            padding: "1rem",
                            height: "100vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >
                        <h1>There's nothing here!</h1>
                        <Link to={"/"}>
                            <button
                                style={{
                                    textDecoration: "none",
                                    border: "none",
                                    width: 120,
                                    borderRadius: 5,
                                    padding: "20px",
                                    backgroundColor: "black",
                                    color: "white",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                Go Back Home
                            </button>
                        </Link>
                    </main>
                }
            />
        </Routes>
    )
}
