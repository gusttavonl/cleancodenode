import { Encrypter } from "../../protocols/encrypter"
import { DbAddAccount } from "./db-add-account"

interface SutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter
}

const makeSut = (): any => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string>  {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut, encrypterStub 
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
})