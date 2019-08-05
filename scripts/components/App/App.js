import { Table } from '../Table/Table.js';
import { Portfolio } from '../Portfolio/Portfolio.js';
import { TradeWidget } from '../TradeWidget/TradeWidget.js';
import { DataService } from '../../services/DataService.js';

export class App {
  constructor({ element }) {
    this._el = element;
    this._userBalance = 10000;
    this._render();

    DataService.getCurrencies(data => {
      this._data = data;
      this._initTable();
    });

    this._initPortfolio();
    this._initTradeWidget();
  }

  _tradeItem(id) {
    const coin = this._data.find(coin => coin.id === id);
    this._tradeWidget.trade(coin);
  }

  _initTable() {
    this._table = new Table({
      data: this._data,
      element: this._el.querySelector('[data-element=table]'),
    });

    this._table.on('rowClick', e => this._tradeItem(e.detail));
  }

  _initPortfolio() {
    this._portfolio = new Portfolio({
      element: this._el.querySelector('[data-element="portfolio"]'),
      balance: this._userBalance,
    });
  }

  _initTradeWidget() {
    this._tradeWidget = new TradeWidget({
      element: this._el.querySelector('[data-element="trade-widget"]'),
    });

    this._tradeWidget.on('buy', e => {
      const { item, amount } = e.detail;

      const purchasePrice = item.price * amount;
      this._userBalance -= purchasePrice;

      this._portfolio.addItem(item, amount);
      this._portfolio.updateBalance(this._userBalance);
    })
  }

  _render() {
    this._el.innerHTML = `
      <div class="row">
        <div class="col s12">
            <h1>Tiny Crypto Market</h1>
        </div>
      </div>


      <div class="row">
          <div class="col s12" data-element="table"></div>
      </div>
      <div class="col s6 offset-s6" data-element="portfolio"></div>
      <div data-element="trade-widget"></div>
    `;
  }
}
