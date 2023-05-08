import { useContext } from "react";
import { ContextUser, initialState } from "../contexts/context_user"

const useIsConnected = () => {
    const { userToken } = useContext(ContextUser);
    function isConn(){
        return userToken !== initialState.userToken;
    }
    return isConn;
}

const useIsGerantOuGardien = () => {
    const { userRole } = useContext(ContextUser);
    function isConn(){
        return userRole === "Gérant" || userRole === "Gardien";
    }
    return isConn;
}

export { useIsConnected, useIsGerantOuGardien }