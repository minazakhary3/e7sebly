import React, { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { SocketContext } from "../../Context/socket";
import { Item } from "../../Components";
import "./styles.sass";

export function Receipt({ match }) {
    const socket = useContext(SocketContext);
    const history = useHistory();
    const location = useLocation();

    const [room, setRoom] = useState(location.state.room);
    const [total, setTotal] = useState(0);

    console.log(location.state.userID);

    socket.on("receiptUpdate", (room) => {
        console.log(room);
        console.log("UPDATED");
        setRoom(room);

        for (let i = 0; i < room.users.length; i++) {
            if (room.users[i].id === location.state.userID) {
                setTotal(room.users[i].total);
            }
        }
    });

    console.log(room.items);

    return (
        <div className="receipt-container">
            <div className="receipt-top">
                <div className="receipt-header">
                    <div className="inv-link">Copy Invite Link</div>
                    <h1>Receipt {match.params.id}</h1>
                    <div className="end-receipt">End Receipt</div>
                </div>
                <h1>Items:</h1>
                <div className="receipt-items">
                    {room.items.map((item, index) => {
                        return (
                            <Item
                                key={index}
                                name={item.name}
                                price={item.price}
                                quantity={item.quantity}
                                users={item.users}
                                onSelected={() => {
                                    console.log(index + " has been clicked");
                                    socket.emit(
                                        "itemSelected",
                                        {
                                            roomID: location.state.room.id,
                                            item,
                                        },
                                        (room) => {
                                            console.log(room);
                                        }
                                    );
                                }}
                                onDeselected={() => {
                                    socket.emit(
                                        "itemDeselected",
                                        {
                                            roomID: location.state.room.id,
                                            item,
                                        },
                                        (room) => {
                                            console.log(room);
                                        }
                                    );
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="receipt-total">
                <div className="shd-pay">
                    <h1>You Should Pay:</h1>
                </div>
                <div className="ttl">
                    <h1>{total}</h1>
                </div>
            </div>
        </div>
    );
}
