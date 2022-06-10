export default class CustomError extends Error {
  public status: number
  
  constructor(error: Error, status: number) {
    super(error.message)
    this.name = error.name
    this.status = status
    this.message = error.message
    Error.captureStackTrace(this)
  }
}
