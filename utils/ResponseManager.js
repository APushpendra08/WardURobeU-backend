function Rp(message, statusCode = 200, result = true){
    if(statusCode != 200){
        return {status: statusCode, error: message, success: false}
    }
    else {
        return {status: statusCode, message: message, success: true}
    }
}

function Rpo(extra, message = null, statusCode = 200){
    extra.status = statusCode
    if(message) extra.message = message
    extra.success = true
    return extra
}

module.exports = {Rp, Rpo}