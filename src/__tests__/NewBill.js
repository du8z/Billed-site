/**
 * @jest-environment jsdom
 */

import {fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill, {handleSubmit, handleChangeFile} from "../containers/NewBill.js"
import Bills from "../containers/Bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { bills } from "../fixtures/bills"
import userEvent from '@testing-library/user-event'
import { ROUTES_PATH } from "../constants/routes.js";



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then send an expense report on the newBill page", () => {
      document.body.innerHTML = NewBillUI()

    })
    describe('When i click on submit', ()=>{
    test('then newBill was send and u go back on bills page', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = NewBillUI(bills[0])

      const onNavigate = jest.fn();
      const store = null
      const newBill = new NewBill({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      const buttonSubmit = screen.getByText("Envoyer");
      const HandleSubmit = jest.fn(handleSubmit);

      buttonSubmit.addEventListener("click", HandleSubmit);
      userEvent.click(buttonSubmit);

      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
 
    
    })
    })
  })
})


