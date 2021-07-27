import "../styles/Leaderboards.css";
import React from "react";
import ReactDOM from "react-dom";

// ASSETS

function User(props) {
    return (
        <div class="leaderboards-board-user-wrapper">
            <div class="leaderboards-board-user-rank">
                {props.rank}
            </div>
            <div class="leaderboards-board-user-name">
                {props.username}
            </div>
            <div class="leaderboards-board-user-rating">
                {props.rating}
            </div>
        </div>
    );
}

class Leaderboards extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="leaderboards-content-wrapper">
                <div class="leaderboards-board-wrapper">
                    <div class="leaderboards-board-title-wrapper">
                        <div class="leaderboards-board-title-title">
                            Global Leaderboards
                        </div>
                        
                    </div>

                    <div class="leaderboards-board-content-wrapper">
                        <User rank="1" rating={3798} username="bob1"/>
                        <User rank="2" rating={3564} username="bob2"/>
                        <User rank="3" rating={3543} username="bob3"/>
                        <User rank="4" rating={3489} username="bob4"/>
                        <User rank="5" rating={3401} username="bob5"/>
                        <User rank="6" rating={3391} username="bob6"/>
                        <User rank="7" rating={3364} username="bob7"/>
                        <User rank="8" rating={3362} username="bob8"/>
                        <User rank="9" rating={3351} username="bob9"/>
                        <User rank="10" rating={3340} username="bob10"/>
                    </div>
                </div>
                <div class="leaderboards-distribution-content-wrapper">
                    Categories
                    <div class="leaderboards-board-title-buttons-wrapper">
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                        <div class="leaderboards-board-title-buttons"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Leaderboards;