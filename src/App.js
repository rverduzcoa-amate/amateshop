
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Categories from './components/Categories';
import Search from './components/Search';
import Product from './components/Product';
import Account from './components/Account';

import Cart from './components/Cart';
import OrderConfirmation from './components/OrderConfirmation';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/categories' element={<Categories />} />
      <Route path='/categories/:categoryId' element={<Categories />} />
      <Route path='/search' element={<Search />} />
      <Route path='/products/:productId' element={<Product />} />
      <Route path='/account' element={<Account />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/order-confirmation' element={<OrderConfirmation />} />
    </Routes>
  );
}

export default App;
