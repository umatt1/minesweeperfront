import IncomingFriendRequest from "../../forms/incomingFriendRequest";
import React, {useState} from "react";
import "./style.css";
import { useCookies } from "react-cookie";
import PlayerApi from "../../apis/PlayerApi";

const playerApi = new PlayerApi();

const FriendRequests = ({}) => {
    const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);

    return (
    <div className="friendRequests">
        <h2>Incoming friend requests</h2>
        {/* {["player"].map(requester => {
            return <IncomingFriendRequest requester={requester}/>
        })} */}
    </div>)
}

export default FriendRequests;