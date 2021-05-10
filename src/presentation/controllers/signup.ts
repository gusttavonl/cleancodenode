import { HttpResponse, HttpRequest } from '../protocols/http'
import { badRequest } from '../helper/http-helper'
import { MissingParamError } from '../error/missing-param-error'
export class SignUpController{
  handle(httpRequest: HttpRequest): any{
    const requiredFields = ['name','email', 'password']
    for (const field of requiredFields){
      if (!httpRequest.body[field]){
        return badRequest( new MissingParamError(field) )
      }
    }
  }
}