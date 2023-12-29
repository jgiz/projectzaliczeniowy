import {Box, Button, Card, Grid, Stack, styled, TextField, Typography} from "@mui/material";
import {Link} from 'react-router-dom'
import {useState} from "react";
import {useNavigate} from "react-router-dom";
export const Login = (props) => {
    const navigate = useNavigate();
    const LoginCard = styled(Card)(({theme}) => ({
        minWidth: '20vw',
        minHeight: '22vh',
        padding: theme.spacing(3),
        wordWrap: "break-word"
    }));
    const [error,setError] = useState(false)
    const handleSubmit = (event) => {
        event.preventDefault();
        const username = event.target.login.value
        const password = event.target.password.value
        fetch("http://localhost:3000/auth/create",{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                email:username,
                password:password,
            })
        }).then(async(res)=>{
            const json = await res.json()
            if (res.status >= 200 && res.status < 300)
            {
                localStorage.setItem('code',json.data.code)
                props.checkLogin()
                navigate('/dashboard')
            }
            else{
                setError(true)
            }

        })
    }
    return (
        <><Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '90vh' }}
        >
            <Grid item xs={3}>
                <LoginCard elevation={24} square={false}>
                    <form onSubmit={handleSubmit}>
                        <Stack direction="column" spacing={2}>
                            <Typography  variant="h4">Zaloguj się</Typography>

                            <TextField id="login"  error={error} helperText={error?"Niepoprawne dane logowania":""} label="Email..." variant="standard" type="email" fullWidth autoFocus/>
                            <TextField id="password" error={error} helperText={error?"Niepoprawne dane logowania":""} label="Hasło..." variant="standard" type="password" fullWidth/>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end', width:'100%'}} spacing={2}>
                                <Stack direction="row" spacing={2}>
                                    <Link to="/register" style={{all:'unset'}}>
                                        <Button variant="">Zarejstruj się</Button>
                                    </Link>
                                    <Button type="submit" variant="contained">Zaloguj się</Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </form>
                </LoginCard>
            </Grid>
        </Grid></>
    )
}
