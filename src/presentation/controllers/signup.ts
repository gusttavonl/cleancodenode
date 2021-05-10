import { HttpResponse, HttpRequest } from '../protocols/http'
import { badRequest } from '../helper/http-helper'
import { MissingParamError } from '../error/missing-param-error'
export class SignUpController{
  handle(httpRequest: HttpRequest): any{
    if (!httpRequest.body.name){
      return badRequest( new MissingParamError('name') )
    }
    if (!httpRequest.body.email){
      return badRequest( new MissingParamError('email') )
    }
  }
}