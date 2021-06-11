import React, { useContext, useState } from "react";
import { SocketContext } from "../../Context/socket";
import "./styles.sass";

export function Item({
    name,
    quantity,
    price,
    onSelected,
    onDeselected,
    users,
}) {
    const socket = useContext(SocketContext);
    const [selected, setSelected] = useState(false);

    console.log("USERS: ");
    console.log(users);

    return (
        <div
            className={"item " + (selected && "slctd")}
            onClick={() => {
                if (selected) {
                    onDeselected();
                } else {
                    onSelected();
                }
                setSelected(!selected);
            }}
        >
            <div className="item-q">{quantity}</div>
            <div className="item-mid">
                <h2>{name}</h2>
                <div className="item-users">
                    {users &&
                        users.map((user) => {
                            return <p>{user.userName},</p>;
                        })}
                </div>
            </div>
            <div className="item-p">{price}</div>
        </div>
    );
}
