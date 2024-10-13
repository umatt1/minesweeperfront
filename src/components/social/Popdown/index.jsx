import React, {useState} from 'react';
import { useCookies } from 'react-cookie';
import './style.css';
import FriendRequestForm from '../../forms/requestFriend';
import PlayerApi from '../../apis/PlayerApi';
import FriendRequests from '../FriendRequests';
import Friends from '../Friends';

const playerApi = new PlayerApi();

const SocialPopdown = ({}) => {
    
    return (
        <>
            <Friends/>
            <FriendRequests/>
            <FriendRequestForm/>
        </>
    );
}

export default SocialPopdown;