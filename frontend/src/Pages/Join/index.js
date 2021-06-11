import React, { useContext, useRef } from "react";
import { useHistory, useLocation } from "react-router";
import { SocketContext } from "../../Context/socket";
import "./styles.sass";

export function Join({ match }) {
    const socket = useContext(SocketContext);
    const history = useHistory();
    const location = useLocation();
    const idRef = useRef();
    const nameRef = useRef();

    let joinReceipt = (id, name) => {
        socket.emit("joinRoom", { id, name }, (res) => {
            history.push({
                pathname: "/receipt/" + res.room.id,
                state: res,
            });
        });
    };

    return (
        <div className="join-container">
            <div className="join-top">
                <div className="join-header">
                    <h1>Join Receipt</h1>
                </div>
            </div>
            <div className="join-body">
                <input
                    type="text"
                    className="r-id-input"
                    placeholder="Nickname"
                    ref={nameRef}
                />
                {!match.params.id && (
                    <input
                        type="text"
                        className="r-id-input"
                        placeholder="Receipt ID"
                        ref={idRef}
                    />
                )}

                <button
                    className="join-bttn"
                    onClick={() => {
                        if (match.params.id) {
                            joinReceipt(match.params.id, nameRef.current.value);
                        } else {
                            joinReceipt(
                                idRef.current.value,
                                nameRef.current.value
                            );
                        }
                    }}
                >
                    Join
                </button>
            </div>
        </div>
    );
}
