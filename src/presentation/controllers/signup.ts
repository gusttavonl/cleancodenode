import { HttpResponse, HttpRequest } from '../protocols/http'
import { badRequest } from '../helper/http-helper'
import { MissingParamError } from '../error/missing-param-error'
import { Controller } from '../protocols/controller'
export class SignUpController implements Controller{
  handle(httpRequest: HttpRequest): HttpResponse{
    const requiredFields = ['name','email', 'password', 'passowrdConfirmation']
    for (const field of requiredFields){
      if (!httpRequest.body[field]){
        return badRequest( new MissingParamError(field) )
      }
    }
  }
}