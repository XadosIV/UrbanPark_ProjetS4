import { useContext } from "react";
import { ContextUser } from "../contexts/context_user";
import { permsFromRole } from "../services";

const useUpdateContext = () => {
    const { setUserId, setUserToken, setUserRole, setUserPermissions } = useContext(ContextUser);
    async function upContext(userData){
        setUserId(userData.id);
        setUserToken(userData.token);
        setUserRole(userData.role);
        const perms = await permsFromRole(userData.role);
        console.log(perms);
        const permUser = {};
        for(const key in perms.data[0]){
            if(key !== "name"){
                permUser[key] = perms.data[0][key].data[0];
            }
        }
        setUserPermissions(permUser);
    }
    return upContext;
}

export { useUpdateContext }