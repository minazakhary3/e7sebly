import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../Context/socket";
import { ItemInput } from "../../Components";
import "./styles.sass";

export function Create() {
    const socket = useContext(SocketContext);
    const history = useHistory();
    const [items, setItems] = useState([{ name: "", price: "", quantity: "" }]);
    const nameRef = useRef();
    const totalRef = useRef();

    const handleQuantityChange = (value, index) => {
        let copy = [...items];

        copy[index].quantity = value;

        setItems(copy);
    };

    const handleNameChange = (value, index) => {
        let copy = [...items];

        copy[index].name = value;

        setItems(copy);
    };

    const handlePriceChange = (value, index) => {
        let copy = [...items];

        copy[index].price = value;

        setItems(copy);
    };

    const createRoom = (name, total) => {
        const creationObject = { items, name, total };

        socket.emit("createRoom", creationObject, (res) => {
            history.push({
                pathname: "/receipt/" + res.room.id,
                state: res,
            });
        });
    };

    return (
        <div className="create-container">
            <div className="create-top">
                <div className="create-header">Create Receipt</div>
                <input
                    type="text"
                    placeholder="Nickname"
                    className="c-input"
                    ref={nameRef}
                />
                <input
                    type="number"
                    min="0"
                    placeholder="Total Including Taxes"
                    className="c-input"
                    ref={totalRef}
                />
                <div className="items-container">
                    <h2>Items:</h2>
                    {items.map((item, index) => {
                        return (
                            <ItemInput
                                onQuantityChange={(value) => {
                                    handleQuantityChange(value, index);
                                }}
                                onNameChange={(value) => {
                                    handleNameChange(value, index);
                                }}
                                onPriceChange={(value) => {
                                    handlePriceChange(value, index);
                                }}
                                onRemove={() => {
                                    let copy = [...items];
                                    copy.splice(index, 1);
                                    setItems(copy);
                                }}
                                key={index}
                                quantity={item.quantity}
                                name={item.name}
                                price={item.price}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="create-bttn-container">
                <button
                    className="add-i-bttn"
                    onClick={() => {
                        setItems([
                            ...items,
                            { name: "", price: "", quantity: "" },
                        ]);
                    }}
                >
                    Add Item
                </button>
                <button
                    className="crt-r-bttn"
                    onClick={() => {
                        createRoom(
                            nameRef.current.value,
                            totalRef.current.value
                        );
                    }}
                >
                    Create
                </button>
            </div>
        </div>
    );
}
