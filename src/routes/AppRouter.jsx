import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '../pages/home';
import { Login } from '../pages/login';
import { Cart } from '../pages/cart';
import { ProductDetail } from '../pages/ProductDetail';
import { Welcome } from '../pages/welcome';
import { CategoryProducts } from '../pages/CategoryProducts';
import { Checkout } from '../pages/Pedidos';
import { PedidoConfirmado } from '../pages/PedidoConfirmado';
import { Historial } from '../components/pedido/Historial';


export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path='/historial' element={<Historial />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/categoria/:categoryName" element={<CategoryProducts />} />  
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/pedidos-confirmado/:id' element={<PedidoConfirmado />} />
            </Routes>
        </BrowserRouter>
    )
}