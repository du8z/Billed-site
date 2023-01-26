/**
 * @jest-environment jsdom
 */

import {fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill, {handleSubmit} from "../containers/NewBill.js"
import Bills from "../containers/Bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { bills } from "../fixtures/bills"
import userEvent from '@testing-library/user-event'



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then send an expense report on the newBill page", () => {
      document.body.innerHTML = NewBillUI()

    })
    describe('When i click on submit', ()=>{
      test('I should be sent on Bills with My expense reports ', ()=>{

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: 'a@a'
        }))
        document.body.innerHTML = NewBillUI(bills[0])

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
  
        const store = null
        const newBill = new NewBill({
          document, onNavigate, store, bills:bills, localStorage: window.localStorage})
  
  
  
  
        const submit = screen.getByTestId('btn-submit-newBill')
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        submit.addEventListener('click', handleSubmit)
        fireEvent.click(submit)
        expect(handleSubmit).toHaveBeenCalled()
        const Test = screen.queryByTestId("btn-new-bill")
        expect(Test).toBeTruthy()


      })
    })
  })
})
