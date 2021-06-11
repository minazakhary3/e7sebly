import React, { useContext } from "react";
import { useHistory } from "react-router";
import { SocketContext } from "../../Context/socket";
import "./styles.sass";

export function Home() {
    const socket = useContext(SocketContext);
    const history = useHistory();

    return (
        <div className="home-container">
            <div className="title-container">
                <h1>e7sebly</h1>
                <h2>Receipt calculation made easy </h2>
            </div>

            <div className="btn-container">
                <button
                    className="join-bttn-h"
                    onClick={() => {
                        history.push("/join");
                    }}
                >
                    Join Receipt
                </button>
                <button
                    className="create-bttn-h"
                    onClick={() => {
                        history.push("/create");
                    }}
                >
                    Create Receipt
                </button>
            </div>
        </div>
    );
}
