import React, { createContext, useState, useEffect } from "react";
const context = createContext(null);


const UserProvider = ({ children }) => {
    const [user, setUser] = userState({})

    userEffect(() => {
        fetch("http://locahost:8888/google/account")
        .then((res) => res.json())
        .then((res) => setUser(res))
        .catch(err => {
            console.log(err)
        })
    }, [])


    return(
        <context.Provider value={user}>
            {children}
        </context.Provider>
    )
}

UserProvider.context = context;

export default UserProvider;
