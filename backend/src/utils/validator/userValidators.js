export const registerUserRequestValidator = function(reqBody) {
    if (reqBody === undefined || reqBody === null) return false;
    
    // check if every required fields are present
    if ([ "firstName", "lastName", "email", "password", "confirmPassword" ].some((field) => {
        if (!reqBody.has(field)) return true;
        else return false;
    })) return false;

    // if any field has no value
    if ([...reqBody].some((field) => field.trim() === "")) return false;

    return true;
};