import React, { useContext } from "react";
import { SocketContext } from "../../Context/socket";
import "./styles.sass";

export function ItemInput({
    onNameChange,
    onQuantityChange,
    onPriceChange,
    onRemove,
    quantity,
    name,
    price,
}) {
    const socket = useContext(SocketContext);

    return (
        <div className="item-input">
            <input
                type="number"
                min="0"
                placeholder="No."
                className="q-input"
                onChange={(e) => {
                    onQuantityChange(e.target.valueAsNumber);
                }}
                value={quantity}
            ></input>
            <input
                type="text"
                placeholder="Item Name"
                className="n-input"
                onChange={(e) => {
                    onNameChange(e.target.value);
                }}
                value={name}
            ></input>
            <input
                type="number"
                placeholder="Price"
                className="p-input"
                onChange={(e) => {
                    onPriceChange(e.target.valueAsNumber);
                }}
                value={price}
            ></input>
            <button
                className="rmv-item-bttn"
                onClick={() => {
                    onRemove();
                }}
            >
                X
            </button>
        </div>
    );
}
