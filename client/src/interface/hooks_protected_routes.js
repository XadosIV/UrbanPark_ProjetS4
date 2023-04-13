import { useContext } from "react";
import { ContextUser, initialState } from "../contexts/context_user"

const useIsConnected = () => {
    console.log("pop");
    const { userToken } = useContext(ContextUser);
    function isConn(){
        console.log("pop2");
        return userToken !== initialState.userToken;
    }
    return isConn;
}

export { useIsConnected }