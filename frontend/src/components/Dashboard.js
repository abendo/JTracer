import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Container, Grid } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ClassIcon from '@material-ui/icons/Class';
import HistoryIcon from '@material-ui/icons/History';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CropFreeIcon from '@material-ui/icons/CropFree';
import Cookies from 'js-cookie';

import logo from '../img/JTracer_Logo.png';

import AuthService from '../services/AuthService';
import QRscan from './features/ScanQR';
import ClassOccupancy from './features/ClassOccupancy';
import History from './features/History';
import NotFound from './features/NotFound';


import {
    Switch,
    Route,
    useHistory
} from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `cals(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShring: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1, 
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginTop: 64,
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));


export default function Dashboard() {

    const [open, setOpen] = React.useState(false);

    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();

    useEffect(() => {
        if(Cookies.get('SESSION-KEY') === undefined) {
            history.push('/login');
        }

    })

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const signOut = () => {
        AuthService.signOut();
        history.push('/login');
    };

    const pushDrawerRoute = (path) => {
        history.push(path);
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift] : open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.manuButton, open && classes.hide)}
                        >
                        <MenuIcon />
                    </IconButton>
                        <Typography variant="h6" noWrap>
                            Menu
                        </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper:classes.drawerPaper,
                }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button onClick={() => pushDrawerRoute("/dashboard/")}>
                            <ListItemIcon><DashboardIcon /></ListItemIcon>
                            <ListItemText primary='Dashboard' />
                        </ListItem>

                        <ListItem button onClick={() => pushDrawerRoute("/dashboard/qrscan/")}>
                            <ListItemIcon><CropFreeIcon /></ListItemIcon>
                            <ListItemText primary='QR-Code' />
                        </ListItem>
                        
                        <ListItem button onClick={() => pushDrawerRoute("/dashboard/classoccupancy/")}>
                            <ListItemIcon><ClassIcon /></ListItemIcon>
                            <ListItemText primary='Class Occupancy' />
                        </ListItem>

                        <ListItem button onClick={() => pushDrawerRoute("/dashboard/history/")}>
                            <ListItemIcon><HistoryIcon /></ListItemIcon>
                            <ListItemText primary='History' />
                        </ListItem>

                        <ListItem button onClick={signOut}>
                            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                            <ListItemText primary="Sign Out" />
                        </ListItem>
                    </List>
                </Drawer>

                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader} />
                        <Switch>
                            <Route exact path="/dashboard">
                            <Container maxWidth="lg" className={classes.container}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <img className="mb-4" src={logo} alt="" width="100%"   />
                                    </Grid>
                                </Grid>
                            </Container>
                            </Route>

                            <Route exact path="/dashboard/qrscan/">
                                <Container maxWidth="lg" className={classes.container}>
                                    <QRscan />
                                </Container>
                            </Route>
                        
                            <Route exact path="/dashboard/classoccupancy/">
                                <Container maxWidth="lg" className={classes.container}>
                                    <ClassOccupancy />
                                </Container>
                            </Route>
                        
                            <Route exact path="/dashboard/history/"> 
                                <Container maxWidth="lg" className={classes.container}>
                                    <History />
                                </Container>
                            </Route>

                            <Route  component={NotFound} />

                        </Switch>
                </main>
        </div>
    );
}