import { HttpResponse, HttpRequest, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helper/http-helper'
import { MissingParamError, InvalidParamError } from '../../error'

export class SignUpController implements Controller{
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount){
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
    try{

      const { name, email, password, passwordConfirmation } = httpRequest.body
      const requiredFields = ['name','email', 'password', 'passwordConfirmation']
      for (const field of requiredFields){
        if (!httpRequest.body[field]){
          return badRequest( new MissingParamError(field) )
        }
      }
      if(password !== passwordConfirmation){
        return badRequest( new MissingParamError('passwordConfirmation') )
      }
      const isValid = this.emailValidator.isValid(email)
      if(!isValid){
        return badRequest( new InvalidParamError('email') )
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error){
      return serverError()
    }
  }
}