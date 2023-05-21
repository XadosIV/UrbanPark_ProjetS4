import { useContext } from "react";
import { ContextUser, initialState } from "../contexts/context_user";
import { permsFromRole } from "../services";

const useUpdateContext = () => {
    const { setUserId, setUserToken, setUserRole, setUserPermissions } = useContext(ContextUser);
    async function upContext(userData){
        setUserId(userData.id);
        setUserToken(userData.token);
        setUserRole(userData.role);
        let permUser = undefined;
        if(userData.setPerms){
            permUser = {};
            const perms = await permsFromRole(userData.role);
            for(const key in perms.data[0]){
                if(key !== "name"){
                    permUser[key] = perms.data[0][key].data[0];
                }
            }
        }
        setUserPermissions(permUser);
    }
    return upContext;
}

const useResetContext = () => {
    const { setUserId, setUserToken, setUserRole, setUserPermissions } = useContext(ContextUser);
    function resetContext(){
        window.sessionStorage.setItem("userId", initialState.userId);
        window.sessionStorage.setItem("userToken", initialState.userToken);
        window.sessionStorage.setItem("userRole", initialState.userRole);
        window.sessionStorage.setItem("userPermissions", initialState.userPermissions);
        setUserId(initialState.userId);
        setUserToken(initialState.userToken);
        setUserRole(initialState.userRole);
        setUserPermissions(initialState.userPermissions);
    }
    return resetContext;
}

export { useUpdateContext, useResetContext }