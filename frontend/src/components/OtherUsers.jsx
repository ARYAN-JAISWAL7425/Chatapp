import React from 'react'
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import {useSelector} from "react-redux";


const OtherUsers = ({ filteredUsers }) => {
    // my custom hook
    useGetOtherUsers();
    const {otherUsers} = useSelector(store=>store.user);
    const displayUsers = filteredUsers || otherUsers;
    if (!displayUsers) return;

    return (
        <div className='overflow-auto flex-1'>
            {
                displayUsers.map((user)=>{
                    return (
                        <OtherUser key={user._id} user={user}/>
                    )
                })
            }

        </div>
    )
}

export default OtherUsers