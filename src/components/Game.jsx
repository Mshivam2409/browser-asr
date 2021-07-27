import "../styles/Game.css";
import React from "react";
import ReactDOM from "react-dom";
import socketIOClient from "socket.io-client";
import AnswerBox from "./AnswerBox.jsx";
const ENDPOINT = "http://127.0.0.1:5000"; // change to real endpoint

function makeUsername(length) {
    var result           = 'guest';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
    }
    return result;
}

function TeamCard(props) {
    if(props.color === "red") {
        return (
            <div class="game-team-wrapper game-team-red">
                <div class="game-team-title">
                    Team Red
                </div>
                <div class="game-team-body">
                        
                </div>
            </div>
        )
    } else if(props.color === "yellow") {
        return (
            <div class="game-team-wrapper game-team-yellow">
                <div class="game-team-title">
                    Team Yellow
                </div>
                <div class="game-team-body">
                        
                </div>
            </div>
        )
    }
    
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            round: 0,
            question: 0,
            buzzed: false,
            username: makeUsername(5),
            questionTime: 0,
            buzzTime: 0,
            gapTime: 0,
            inGame: false,
            answerText: "",
        };
        this.setBuzzTime = this.setBuzzTime.bind(this);
        this.setQuestionTime = this.setQuestionTime.bind(this);
        this.setGapTime = this.setGapTime.bind(this);
        this.buzz = this.buzz.bind(this);
        this.gotBuzzed = this.gotBuzzed.bind(this);
        this.startGame = this.startGame.bind(this);
        this.socket = socketIOClient(ENDPOINT);
    }

    componentDidMount(){
        this.socket.on("buzzed", data => {
            console.log(data);
            // this.gotBuzzed(data['username']);
        });
        this.socket.on("gamestate", data => {
            this.setState({
                inGame: data[0],
                round: data[1],
                question: data[2],
                questionTime: data[3].toFixed(1),
                buzzTime: data[4].toFixed(1),
                gapTime: data[5].toFixed(1),
            })
        });
        this.socket.on("answered", data => {
            console.log(data);
            // this.setBuzzTime(time);
        });
    }

    setBuzzTime(time) {
        this.setState({buzzTime: time});
    }

    setQuestionTime(time) {
        this.setState({questionTime: time});
    }

    setGapTime(time) {
        this.setState({gapTime: time});
    }

    gotBuzzed(buzzer1) {
        this.setState({buzzer: buzzer1})
    }

    buzz(props) {
        this.socket.emit("buzz", {
            username: this.state.username,
        });
    }

    startGame(props) {
        this.socket.emit("startgame", {}); 
        this.setState({inGame: true});

        let interval = setInterval(() => {
            if(!this.state.inGame) {
                clearInterval(interval);
            } else {
                this.socket.emit('getstate', {})
            }
        }, 100)
    }

    render() {
        return (
            <div class="game1-big-white-panel-wrapper">
                <TeamCard color="red"/>
                <div class="game1-big-white-panel">
                    <div class="game1-content-wrapper">
                        <div class="game-content-wrapper">
                            <div class="game-header">
                                Round: {this.state.round} / Question: {this.state.question} / Time remaining: {this.state.questionTime}
                            </div>
                            <div class="game-transcriptbox">
                                
                            </div>
                            <AnswerBox/>
                            {/* {!this.state.inGame &&
                                <div onClick={this.startGame} class="buzz-button">
                                    Start Game
                                </div>
                            }
                            
                            <div>
                                Username: {this.state.username}
                            </div>
                            <div>
                                R: {this.state.round} / Q: {this.state.question}
                            </div>
                            <div>
                                Time left in gap: {this.state.gapTime}
                            </div>
                            <div>
                                Time left in question: {this.state.questionTime}
                            </div>
                            <div>
                                Time left in buzz: {this.state.buzzTime}
                            </div>
                            <div onClick={this.buzz} class="buzz-button">
                                {this.state.buzzed ? "Buzzed!" : "Buzz in"}
                            </div> */}
                            
                        </div>
                    </div>
                </div>
                <TeamCard color="yellow"/>
            </div>
            
            
        )
    }
}

export default Game;