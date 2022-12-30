class CustomErrorHandler extends Error {

    //Constructor
    constructor (status, msg) {
        super();
        this.status = status
        this.message = msg;
    }

    static alreadyExists(message) {
        return new CustomErrorHandler(409, message);
    }

}

export default CustomErrorHandler;