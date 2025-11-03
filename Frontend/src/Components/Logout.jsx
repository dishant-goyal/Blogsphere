import React from 'react'
import {useAuth} from "../context/AuthProvider"
import { Navigate,useNavigate } from 'react-router-dom'

function Logout() {
    const [authUser,setAuthUser]=useAuth()
    const navigate=useNavigate()
    const handleLogout=()=>{
        try {
            setAuthUser(null)
            localStorage.removeItem("User")
            alert("logout successfully")
            navigate('/')
        } catch (error) {   
         console.log(error)   
        }
    }
  return (
    <div>
        <button className='px-3 py-2 bg-violet-500 text-white rounded-md cursor-pointer' onClick={handleLogout}>
            Logout
        </button>
    </div>
  )
}

export default Logout