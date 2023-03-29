import React, { useEffect, useContext } from "react";
import { AuthContext } from '../AuthProvider/AuthProvider';

const Logout = () => {
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        logout();
    }, []);

    return null;
}

export default Logout;
