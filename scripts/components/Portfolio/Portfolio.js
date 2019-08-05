export class Portfolio {
  constructor({ element, balance, items = {} }) {
    this._el = element;
    this._balance = balance;
    this._items = items;

    this._portfolioWorth = 0;
    this._render();
  }

  addItem({ id, name, price }, amount) {
    const currentItem = this._items[id] || {
      name,
      id,
      amount: 0,
      totalPrice: 0,
    }

    currentItem.price = price;
    currentItem.amount += amount;
    currentItem.totalPrice = price * currentItem.amount;
    this._items[id] = currentItem;

    this._portfolioWorth = Object.values(this._items)
      .reduce((total, item) => total + item.totalPrice, 0);

    this._render();
  }

  updateBalance(newBalance) {
    this._balance = newBalance;
    this._render();
  }

  _render() {
    const items = Object.values(this._items);

    this._el.innerHTML = `
      <ul class="collapsible portfolio">
        <li>
          <p class="collapsible-header">
              Current balance: $${this._balance}.
              Portfolio Worth: $${this._portfolioWorth}
          </p>
          <div class="collapsible-body">
              <table class="highlight striped">
                <thead>
                   <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Total</th>
                   </tr>
                </thead>
                <tbody>
                  ${
                    items.length === 0
                      ? ''
                      : `
                        ${items.map(item => `
                          <tr data-id="${item.id}">
                              <td>${item.name}</td>
                              <td>${item.amount}</td>
                              <td>${item.price}</td>
                              <td>${item.totalPrice}</td>
                          </tr>
                        `).join('')}
                      `
                  }
                </tbody>
              </table>
            </div>
          </li>
        </ul>
    `;
    let elems = this._el.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
  }
}