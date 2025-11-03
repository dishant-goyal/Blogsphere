import { createContext, useContext, useState } from "react";

export const AuthContext=createContext()

export default function AuthProvider({children}){
    const existingUser=localStorage.getItem('User');

    const [authUser,setAuthUser]=useState(existingUser?JSON.parse(existingUser):undefined)

    return(
        <AuthContext.Provider value={[authUser,setAuthUser]}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth=()=>useContext(AuthContext);