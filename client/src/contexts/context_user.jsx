import React from "react";

const initialState = {
    userId: undefined,
    setUserId: valueId => {},
    userToken: "",
    setUserToken: valueToken => {},
    userRole: undefined,
    setUserRole: valueRole => {},
    userPermissions: undefined,
    setUserPermissions: valuePermissions => {}
};

const ContextUser = React.createContext(initialState);

export { initialState, ContextUser }