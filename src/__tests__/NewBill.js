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
      new NewBill({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      const buttonSubmit = screen.getByText("Envoyer");
      const HandleSubmit = jest.fn(handleSubmit);

      buttonSubmit.addEventListener("click", HandleSubmit);
      userEvent.click(buttonSubmit);

      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
 
    
    })
    })

    test("handleChangeFile with jpg file", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        email: 'a@a.com'
      }))
      document.body.innerHTML = NewBillUI(bills[0])
    
      const onNavigate = jest.fn()
      const store = {
        bills: jest.fn(() => ({
          create: jest.fn(() => Promise.resolve({
            fileUrl: 'file-url',
            key: 'key'
          }))
        }))
      }
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage
      })
    
      const img = document.createElement('i')
      img.setAttribute('data-bill-url', 'https://example.com/bill.jpg')
    
      const e = {
        target: { value: 'path/to/file.jpg' },
        preventDefault: jest.fn()
      }
    
      const ChangeFile = jest.fn(() => newBill.handleChangeFile(e))
      img.addEventListener('click', ChangeFile)
    
      userEvent.click(img)
      await Promise.resolve()
      expect(ChangeFile).toHaveBeenCalled()
      expect(newBill.fileUrl).toBe('file-url')
    })
    
  })
})


