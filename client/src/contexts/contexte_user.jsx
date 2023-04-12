import React from "react";

export default React.createContext({
    userId: undefined,
    setUserId: valueId => {},
    userToken: undefined,
    setUserToken: valueToken => {},
    userRole: undefined,
    setUserRole: valueRole => {},
    userPermissions: {
        see_other_users: false,
        modify_spot_users: false,
        modify_role_users: false,
        delete_other_user: false
    },
    setUserPermission: valuePermissions => {}
})