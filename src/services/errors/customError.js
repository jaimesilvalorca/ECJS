export const customError = (key,info=null,cause=null)=>{
    const errorMessage = errors[key] || 'Error desconcido'

    const customError = new Error(errorMessage)
    customError.name = 'Custom Error'
    customError.info = info
    customError.cause = cause
    return customError
}