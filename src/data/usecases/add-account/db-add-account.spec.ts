import { Encrypter } from "./db-add-account-protocols"
import { DbAddAccount } from "./db-add-account"
import { AccountModel } from "../../../domain/models/account-model"
import { AddAccountModel } from "../../../domain/usecases/add-account"
import { AddAccountRepository } from "../../protocols/add-account-repository"

interface SutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter,
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string>  {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
   
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel>  {
      const fakeAccount = { 
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
   
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut, encrypterStub, addAccountRepositoryStub
  }
}
describe('DbAddAccount Usecase', () => {
  const {sut, encrypterStub } = makeSut()
  test('Expected Encrypter with correct password', async () => {
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should Throw if encrypter throws', async () => {
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject)=> reject( new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Expected AddAccountRepository with correct values', async () => {
    const {sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})