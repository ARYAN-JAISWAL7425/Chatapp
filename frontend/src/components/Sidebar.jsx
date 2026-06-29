import React, { useState } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';
 
const Sidebar = () => {
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(null);
    const {otherUsers, selectedUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
            navigate("/login");
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    }
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (!search.trim()) {
            setFilteredUsers(null);
            return;
        }
        const matched = otherUsers?.filter((user) => user.fullName.toLowerCase().includes(search.toLowerCase()));
        if (matched && matched.length > 0) {
            setFilteredUsers(matched);
        } else {
            toast.error("User not found!");
        }
    }
    return (
        <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-auto border-r border-slate-500 p-4 flex-col`}>
            <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2'>
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); if (!e.target.value) setFilteredUsers(null); }}
                    className='input input-bordered rounded-md w-full flex-1' type="text"
                    placeholder='Search...'
                />
                <button type='submit' className='btn bg-zinc-700 text-white'>
                    <BiSearchAlt2 className='w-6 h-6 outline-none'/>
                </button>
            </form>
            <div className="divider px-3"></div> 
            <OtherUsers filteredUsers={filteredUsers}/>
            <div className='mt-2'>
                <button onClick={logoutHandler} className='btn btn-sm'>Logout</button>
            </div>
        </div>
    )
}

export default Sidebar