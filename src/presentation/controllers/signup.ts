import { HttpResponse, HttpRequest } from '../protocols/http'
import { badRequest, serverError } from '../helper/http-helper'
import { MissingParamError, InvalidParamError } from '../error'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
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
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if(!isValid){
        return badRequest( new InvalidParamError('email') )
      }
    } catch (error){
      return serverError()
    }
  }
}