import React from "react";
import "./style.css";

const FriendCard = ({ friend, onRemoveFriend }) => {
    return (
        <div className="friendCard">
            <h4>{friend}</h4>
            <div className="friendCardButtons">
                <button onClick={() => onRemoveFriend(friend)}>Remove</button>
                <button>View Profile</button>
            </div>
        </div>
    );
}

export default FriendCard;
