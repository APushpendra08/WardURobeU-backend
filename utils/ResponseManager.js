function Rp(message, statusCode = 200, result = true){
    return {status: statusCode, message: message}
}

module.exports = {Rp}