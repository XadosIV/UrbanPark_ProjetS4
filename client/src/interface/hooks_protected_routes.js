import { useContext } from "react";
import { ContextUser } from "../contexts/context_user"

const useIsConnected = () => {
    const { userToken } = useContext(ContextUser);
    return userToken !== undefined;
}

export { useIsConnected }