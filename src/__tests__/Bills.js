/**
 * @jest-environment jsdom
 */

import { getByTestId, screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills, { handleClickIconEye, getBills, handleClickNewBill } from "../containers/Bills.js"
import router from "../app/Router.js";
import userEvent from '@testing-library/user-event'
import DashboardFormUI from "../views/DashboardFormUI.js"
import Dashboard, { filteredBills, cards } from "../containers/Dashboard.js"
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import 'bootstrap';



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'a@a'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList[0]).toEqual("active-icon") // active-icon = surbrillance 
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test('then when I click on the bill icon the modal must open', async () => {

      const onNavigate = () => {
        document.body.innerHTML = `
        <div id="modaleFile" style="width: 500px;">
          <div class="modal-body"></div>
        </div>
      `;
      }

      const store = null

      const bill = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })
      const icon = document.createElement('i');
      icon.setAttribute("data-bill-url", "https://example.com/bill.jpg");

      const handleClickIconEye = jest.fn(bill.handleClickIconEye(icon))
      icon.addEventListener('click', handleClickIconEye)
      userEvent.click(icon)
      expect(handleClickIconEye).toHaveBeenCalled()


    })

    test('then when i click on button NewBill modal should open', () => {
      const onNavigate = jest.fn();
      const store = null;
      const bill = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })
      
      const buttonNewBill = screen.getByText("Nouvelle note de frais");
      const handleClickNewBill = jest.fn(bill.handleClickNewBill());

      buttonNewBill.addEventListener("click", handleClickNewBill);
      userEvent.click(buttonNewBill);
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);

    })

    test('getBills returns the expected data', () => {
      const store = {
        bills: jest.fn().mockReturnValue({
          list: jest.fn().mockReturnValue(Promise.resolve([
            { date: '2022-01-01', status: 'pending' },
            { date: '2022-02-01', status: 'accepted' },
            { date: '2022-03-01', status: 'refused' }
          ]))
        })
      }
    
      const bill = new Bills({
        document,
        onNavigate: jest.fn(),
        store,
        bills: [],
        localStorage: window.localStorage
      })
    
      
      return bill.getBills().then(data => {
        expect(data).toEqual([
          { date: '1 Jan. 22', status: 'En attente' },
          { date: '1 Fév. 22', status: 'Accepté' },
          { date: '1 Mar. 22', status: 'Refused' }
        ])
      })
    })
    
  })
})














/* 
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
 
    const onNavigate = () => {
    document.body.innerHTML = BillsUI(bills[0])

    }
  

    const store = null

    const bill = new Bills({
      document, onNavigate, store, bills, localStorage: window.localStorage
    })
    const buttonNewBill = screen.getByText('Nouvelle note de frais')
    const handleClickNewBill = jest.fn(bill.handleClickNewBill())
    
    buttonNewBill.addEventListener('click', handleClickNewBill)
    userEvent.click(buttonNewBill)
    expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['NewBill']) */