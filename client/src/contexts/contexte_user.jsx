import React from "react";

const initialState = {
    userId: undefined,
    setUserId: valueId => {},
    userToken: undefined,
    setUserToken: valueToken => {},
    userRole: undefined,
    setUserRole: valueRole => {},
    userPermissions: undefined,
    setuserPermissions: valuePermissions => {}
};

const ContexteUser = React.createContext(initialState);

export { initialState, ContexteUser }