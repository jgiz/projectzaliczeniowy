import {Login} from "./Components/Login/Login.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {Register} from "./Components/Register/Register.jsx";
import {Dashboard} from "./Components/Dashboard/Dashboard.jsx";
import {useEffect, useState} from 'react'
function App() {
    const [logined, setLogined]= useState({
        state:false
    })
    const checkLogin = () =>{
        fetch("http://localhost:3000/auth/check",{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "x-code":localStorage.getItem("code")
            }
        }).then(async(res)=>{
            const json = await res.json()
            setLogined(json)
            console.log(json)
        })
    }
    useEffect(()=>{
        checkLogin()
    },[])
    const themeMaterial = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: 'rgb(142,33,217)',
                contrastText: '#ffffff',
            }
        }
    })
    return (
        <>
            <ThemeProvider theme={themeMaterial}>
                <CssBaseline/>
                <Routes>
                    <Route path="/">
                        <Route index element={<Navigate to="/dashboard"/>}/>
                        <Route path={"dashboard"} element={<Dashboard logined={logined}/>}/>
                        <Route path={"login"} element={<Login checkLogin={checkLogin}/>}/>
                        <Route path={"register"} element={<Register/>}/>
                    </Route>
                </Routes>
            </ThemeProvider>
        </>
    )
}

export default App
