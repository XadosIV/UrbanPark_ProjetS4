exports.SendError = (name, message, callback, httpCode=400) => {
    let error = new Error(message);
    error.code = name;
    error.httpCode = httpCode;
    callback(error, null);
}

exports.HandleError = (error, res) => {
    if (error.httpCode){
        res.status(error.httpCode).json({
            "code":error.code,
            "message":error.message
        })
    }else{ // Not generated by us
        console.error(error);
        res.status(500).json({
            "code":this.E_INTERNAL_ERROR,
            "message":"Une erreur est survenue."
        })
    }
}

exports.E_INTERNAL_ERROR													="E_INTERNAL_ERROR";
exports.E_EMAIL_ALREADY_USED												="E_EMAIL_ALREADY_USED";
exports.E_EMAIL_FORMAT_INVALID												="E_EMAIL_FORMAT_INVALID";
exports.E_PASSWORD_FORMAT_INVALID											="E_PASSWORD_FORMAT_INVALID";
exports.E_MISSING_PARAMETER													="E_MISSING_PARAMETER";
exports.E_UNDEFINED_USER													="E_UNDEFINED_USER";
exports.E_WRONG_PASSWORD													="E_WRONG_PASSWORD";
exports.E_CONFLICTING_PARAMETERS											="E_CONFLICTING_PARAMETERS";
exports.E_FORBIDDEN															="E_FORBIDDEN";
exports.E_USER_NOT_FOUND													="E_USER_NOT_FOUND";
exports.E_WRONG_PARAMETER													="E_WRONG_PARAMETER";
exports.E_PERMISSION_DOESNT_EXIST											="E_PERMISSION_DOESNT_EXIST";
exports.E_UNDEFINED_PARKING													="E_UNDEFINED_PARKING";
exports.E_WRONG_FLOOR														="E_WRONG_FLOOR";
exports.E_SPOT_ALREADY_EXIST												="E_SPOT_ALREADY_EXIST";
exports.E_SPOT_NOT_FOUND													="E_SPOT_NOT_FOUND";
exports.E_ROLE_NOT_FOUND													="E_ROLE_NOT_FOUND";
exports.E_DATETIME_FORMAT_INVALID											="E_DATETIME_FORMAT_INVALID";
exports.E_OVERLAPPING_SCHEDULES												="E_OVERLAPPING_SCHEDULES";
exports.E_WRONG_DATETIME_ORDER												="E_WRONG_DATETIME_ORDER";
exports.E_SCHEDULE_NOT_FOUND												="E_SCHEDULE_NOT_FOUND";
exports.E_SPOTS_IN_DIFFERENT_PARKINGS										="E_SPOTS_IN_DIFFERENT_PARKING";
exports.E_SPOTS_IN_DIFFERENT_FLOORS											="E_SPOTS_IN_DIFFERENT_FLOORS";
exports.E_WRONG_SPOT_ORDER													="E_WRONG_SPOT_ORDER";
exports.E_SPOTS_PARKING_DIFFERENT_SCHEDULE_PARKING                          ="E_SPOTS_PARKING_DIFFERENT_SCHEDULE_PARKING";
exports.E_WRONG_ID_FORMAT                                                   ="E_WRONG_ID_FORMAT";
exports.E_WRONG_FLOOR_FORMAT                                                ="E_WRONG_FLOOR_FORMAT";
exports.E_PARKING_ID_ALREADY_EXIST                                          ="E_PARKING_ID_ALREADY_EXIST";
exports.E_PARKING_NAME_ALREADY_EXIST                                        ="E_PARKING_NAME_ALREADY_EXIST";
exports.E_SPOT_TYPE_FORMAT_INVALID                                          ="E_SPOT_TYPE_FORMAT_INVALID";
exports.E_SPOT_TYPE_ALREADY_EXIST                                           ="E_SPOT_TYPE_ALREADY_EXIST";
exports.E_BUSY_SPOT                                                         ="E_BUSY_SPOT";
exports.E_TYPE_DONT_EXIST                                                   ="E_TYPE_DONT_EXIST";
exports.E_WRONG_PARAMETER_FORMAT                                            ="E_WRONG_PARAMETER_FORMAT";
exports.E_NAME_FORMAT_INVALID                                               ="E_NAME_FORMAT_INVALID";