export const handleErrors = (errorResponse, setErrors) => {
    if (!errorResponse || !errorResponse.errors || !Array.isArray(errorResponse.errors)) {
        return;
    }
    const errorMessages = {};
    errorResponse.errors.forEach((error) => {
        errorMessages[error.path] = error.msg;
    });
    setErrors(errorMessages);
};
