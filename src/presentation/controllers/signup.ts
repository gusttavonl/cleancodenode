import { HttpResponse, HttpRequest, Controller, EmailValidator  } from '../protocols/'
import { badRequest, serverError } from '../helper/http-helper'
import { MissingParamError, InvalidParamError } from '../error'
export class SignUpController implements Controller{
  private readonly emailValidator: EmailValidator
  constructor(emailValidator: EmailValidator){
    this.emailValidator = emailValidator
  }
  handle(httpRequest: HttpRequest): HttpResponse{
    try{
      const requiredFields = ['name','email', 'password', 'passowrdConfirmation']
      for (const field of requiredFields){
        if (!httpRequest.body[field]){
          return badRequest( new MissingParamError(field) )
        }
      }
      if(httpRequest.body.password !== httpRequest.body.passowrdConfirmation){
        return badRequest( new InvalidParamError('passowrdConfirmation') )
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if(!isValid){
        return badRequest( new InvalidParamError('email') )
      }
    } catch (error){
      return serverError()
    }
  }
}