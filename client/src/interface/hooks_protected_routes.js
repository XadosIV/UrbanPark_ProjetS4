import { useContext } from "react";
import { ContextUser, initialState } from "../contexts/context_user"

const useIsConnected = () => {
    const { userToken } = useContext(ContextUser);
    function isConn(){
        return userToken !== initialState.userToken;
    }
    return isConn;
}

export { useIsConnected }