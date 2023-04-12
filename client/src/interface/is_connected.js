import { useContext } from "react";
import { ContexteUser } from "../contexts/contexte_user"

const useIsConnected = () => {
    const { userToken } = useContext(ContexteUser);
    return userToken !== undefined;
}

export { useIsConnected }