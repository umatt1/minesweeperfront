import React, {useState} from 'react';
import { useCookies } from 'react-cookie';
import './style.css';
import FriendRequestForm from '../../forms/requestFriend';
import PlayerApi from '../../apis/PlayerApi';
import FriendRequests from '../FriendRequests';

const playerApi = new PlayerApi();

const SocialPopdown = ({}) => {
    
    return (
        <>
            <FriendRequests/>
            <FriendRequestForm/>
        </>
    );
}

export default SocialPopdown;