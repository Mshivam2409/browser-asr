import "../styles/WhitePanel.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CheckIcon from '@material-ui/icons/Check';
import GoogleLogin from 'react-google-login';
import AnimatedCard from './AnimatedCard';
import MagnifyingGlass from '../assets/magnifying-glass.png';
import Microphone from '../assets/microphone.png';
import Recorder from './AudioRecorder.jsx'
import Player from './Player.jsx';
import Game from './Game.jsx';
import AnswerBox from './AnswerBox.jsx';
import Lobby from './Lobby.jsx';
import { useRecoilState, useRecoilValue } from "recoil";
import { SCREEN, PLAY_SCREEN, SOCKET, PROFILE, TRANSCRIPTS } from "../store";
import { useAlert } from 'react-alert';
import axios from 'axios';

// PAGES
import Dashboard from './Dashboard.jsx';
import Profile from './Profile.jsx';
import Record from './Record.jsx';
import Shop from './Shop.jsx';
import Play from './Play.jsx';
import Leaderboards from './Leaderboards.jsx';
import CreateAccount from './CreateAccount.jsx';

// ASSETS
// Sidenav
import DashboardIcon from '@material-ui/icons/Dashboard';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import BarChartIcon from '@material-ui/icons/BarChart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import StorefrontIcon from '@material-ui/icons/Storefront';
// Currency
import EnergyIcon from '../assets/energy.png';
import CoinIcon from '../assets/coin.png';

//FIREBASE
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyCiKPy60wLQMYdttnGec8BFbUUs1Y60yuE",
    authDomain: "quizzrio.firebaseapp.com",
    projectId: "quizzrio",
    storageBucket: "quizzrio.appspot.com",
    messagingSenderId: "770436468924",
    appId: "1:770436468924:web:d9203acd685d6b3b1a40b9"
  };
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
};


function LoginCardItem(props) {
    return (
        <div class="login-card-item">
            <CheckIcon style={{ color:"green" }} fontSize="small"/>
            <div class="mr-1"></div>
            {props.text}
            
        </div>
    );
}

function LoginBody(props) {
    const [screen, setScreen] = useRecoilState(SCREEN);
    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                  }).catch(function(error) {
                    // Handle error
                  });
                setScreen(-1);
            } else {
                return;
            }
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    return (
        <div class="main-body">
            <div class="login-card">
                <div class="card-title" id="login-title">Login</div>
                <br/>
                <LoginCardItem text="Unlimited games"/>
                <LoginCardItem text="Singleplayer mode"/>
                <LoginCardItem text="Party mode"/>
                <LoginCardItem text="Play with friends"/>
                <LoginCardItem text="Contribute to ASR research"/>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </div>
            {/* TODO ADD TUTORIAL SLIDES */}
        </div>
    );
}

function LoginTitle() {
    return (
        <div>
            <div class="login-title">Quizzr</div>
            <div class="login-subtitle"><b>the </b> quiz game</div>
        </div>
    );
}


function SidenavItem(props) {
    return (
        <div class="sidenav-tab-wrapper" onClick={props.setScreen}>
            {props.icon}
            <div class="sidenav-tab-label" style={{color: props.textColor}}>{props.label}</div>
        </div>
    );
}

function Sidenav(props) {
    let MainColor = "#6287F7";
    let LogoutColor = "#b52121";

    return (
        <div class="sidenav-wrapper">
            <div class="sidenav-logo-title">Quizzr</div>
            <div class="sidenav-logo-subtitle"><b>the</b> quiz game</div>
            <div class="sidenav-tabs-wrapper">
                <SidenavItem label="Profile" icon={<AccountCircleIcon style={{color: MainColor}}/>} setScreen={() => props.setScreen(1)} textColor={MainColor}/>
                <SidenavItem label="Dashboard" icon={<DashboardIcon style={{color: MainColor}}/>} setScreen={() => props.setScreen(2)} textColor={MainColor}/>
                <SidenavItem label="Play" icon={<OfflineBoltIcon style={{color: MainColor}}/>} setScreen={() => props.setScreen(3)} textColor={MainColor}/>
                <SidenavItem label="Shop" icon={<StorefrontIcon style={{color: MainColor}}/>} setScreen={() => props.setScreen(4)} textColor={MainColor}/>
                <SidenavItem label="Leaderboards" icon={<BarChartIcon style={{color: MainColor}}/>} setScreen={() => props.setScreen(5)} textColor={MainColor}/>
                <SidenavItem label="Logout" icon={<ExitToAppIcon style={{color: LogoutColor}}/>} textColor={LogoutColor} setScreen={() => firebase.auth().signOut()}/>
            </div>
        </div>
    );
}

function PageHeader(props) {
    const [screen, setScreen] = useRecoilState(SCREEN);

    return (
        <div class="page-header-wrapper">
            <div class="page-header-left-wrapper">
                <div class="page-header-title">
                    {props.title}
                </div>
                <div class="page-header-divider"></div>
                <div class="page-header-caption">
                    {props.caption}
                </div>
            </div>
            <div class="page-header-right-wrapper">
                {/* Energy */}
                <div class="page-header-energy-wrapper">
                    <div class="page-header-energy-cooldowntext"></div>
                    <div class="page-header-currency-wrapper">
                        <div class="page-header-currency-text">
                            <img class="page-header-coin-icon" src={CoinIcon} alt="Energy: "/>
                            70 / 100
                        </div>
                        <div onClick={() => {setScreen(4)}} class="page-header-currency-add page-header-currency-add-hvr-grow">
                            +
                        </div>
                    </div>
                    <div class="page-header-energy-cooldowntext">+1 in 45:07</div>
                </div>

                {/* Coins
                <div class="page-header-currency-wrapper page-header-coin-mr">
                    <div class="page-header-currency-text">
                        <img class="page-header-coin-icon" src={CoinIcon} alt="Coins: "/>
                        1000
                    </div>
                    <div class="page-header-currency-add">+</div>
                </div> */}
            </div>
        </div>
    );
}

function BigWhitePanel() {
    const [screen, setScreen] = useRecoilState(SCREEN);
    const [playScreen, setPlayScreen] = useRecoilState(PLAY_SCREEN);
    const [profile, setProfile] = useRecoilState(PROFILE);
    const alert = useAlert()
    const socket = useRecoilValue(SOCKET);
    const [transcripts, setTranscripts] = useRecoilState(TRANSCRIPTS);

    
    // connecting to socket server errors
    useEffect(() => {
        const alertListener = (data) => {
            if(data[0] === 'normal') {
                alert.show(data[1]);
            } else if(data[1] === 'error') {
                alert.error(data[1]);
            } else if(data[1] === 'success') {
                alert.success(data[1]);
            } else {
                alert.show(data[1]);
            }
        };
    
        socket.on("alert", alertListener);

        return function cleanSockets() {
            socket.off("alert", alertListener);
        }
    });

    // connecting to data flow server errors
    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
          if(user) {
            firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                axios.defaults.headers.common['Authorization'] = idToken;
                axios.get('http://localhost:5000/profile')
                    .then(function (response) {
                        // handle success
                        setProfile(response['data']);
                        console.log(response['data']);
                        setScreen(2);
                    })
                    .catch(function (error) {
                        if(!error.response) {
                            firebase.auth().signOut();
                            setScreen(0);
                            alert.error("Server connection failed");
                        } else if (error.response.status === 404) {
                            setScreen(7);
                        }
                    })
                    .then(function () {
                        // always executed
                    });
              }).catch(function(error) {
                setScreen(0);
                alert.error("Login failed");
              });
          } else {
            setScreen(0);
          }
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    // getting transcripts
    useEffect(() => {
        let transcriptsArray = [];
        let requestsArray = [];
        for(let i = 0; i < 4; i++) {
            requestsArray.push(axios.get('http://localhost:5000/question/unrec')
                .then(function (response) {
                    transcriptsArray.push(response['data']['results'][0]);
                }));
        }
        axios.all(requestsArray)
            .then(() => {
                setTranscripts(transcriptsArray);
            })
            .catch(function (error) {
                alert.error("Server connection failed");
            });
    }, []);
    

    if(screen === -1){ // Loading
        return (
            <div class="big-white-panel-wrapper">
                <div class="big-white-panel">
                    <div class="content-wrapper">
                        <div class="whitepanel-loading">
                            Loading, please wait...
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(screen === -2) { // Searching for opponent 
        return (
            <div class="big-white-panel-wrapper">
                <div class="big-white-panel">
                    <div class="content-wrapper">
                        <div class="whitepanel-loading">
                            Searching for opponent, please wait...
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(screen === 0) { // login
        return (
            <div class="login-white-panel-wrapper">
                <div class="login-white-panel">
                    <LoginTitle/>
                    <LoginBody/>
                </div>
            </div>
        );
    } else if(screen === 1) { // profile
        return (
            <div class="big-white-panel-wrapper">
                <div class="big-white-panel">
                    <div class="content-wrapper">
                        <Sidenav setScreen={setScreen}/>
                        <div class="page-body-wrapper">
                            <PageHeader title="Profile" caption="Track your statistics, match history, recordings, and rating!"/>
                            <div class="page-body-content-wrapper">
                                <Profile/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(screen === 3) { // select gamemode / lobby
        if(playScreen === 0) {
            return (
                <div class="big-white-panel-wrapper">
                    <div class="big-white-panel">
                        <div class="content-wrapper">
                            <Sidenav setScreen={setScreen}/>
                            <div class="page-body-wrapper">
                                <PageHeader title="Play" caption="Play with friends, solo, or compete on the ladder!"/>
                                <div class="page-body-content-wrapper">
                                    <Play/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div class="big-white-panel-wrapper">
                    <div class="big-white-panel">
                        <div class="content-wrapper">
                            <Sidenav setScreen={setScreen}/>
                            <div class="page-body-wrapper">
                                <PageHeader title="Play" caption="Play with friends, solo, or compete on the ladder!"/>
                                <div class="page-body-content-wrapper">
                                    <Lobby/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    } else if(screen === 4) { // Shop
        return (
            <div class="big-white-panel-wrapper">
                <div class="big-white-panel">
                    <div class="content-wrapper">
                        <Sidenav setScreen={setScreen}/>
                        <div class="page-body-wrapper">
                            <PageHeader title="Shop" caption="Earn and spend coins in the shop!"/>
                            <div class="page-body-content-wrapper">
                                <Shop/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(screen === 5) { // leaderboards
        return (
            <div class="big-white-panel-wrapper">
                <div class="big-white-panel">
                    <div class="content-wrapper">
                        <Sidenav setScreen={setScreen}/>
                        <div class="page-body-wrapper">
                            <PageHeader title="Leaderboards" caption="Check out the top players across the globe!"/>
                            <div class="page-body-content-wrapper">
                                <Leaderboards/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(screen === 6){ // in-game
        return (
            <Game/>
        );
    } else if(screen === 7){ // Create account
        return (
            <div class="big-white-panel-wrapper">
                <div class="big-white-panel">
                    <div class="content-wrapper">
                        <CreateAccount/>
                    </div>
                </div>
            </div>
        );
    } else { //dashboard
        return (
            <div class="big-white-panel-wrapper">
                <div class="big-white-panel">
                    <div class="content-wrapper">
                        <Sidenav setScreen={setScreen}/>
                        <div class="page-body-wrapper">
                            <PageHeader title="Dashboard" caption="Catch up on the latest news and updates!"/>
                            <div class="page-body-content-wrapper">
                                <Dashboard/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } 
}

export default BigWhitePanel;