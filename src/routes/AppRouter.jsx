import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '../pages/home';
import { Login } from '../pages/login';
import { Register } from '../pages/register';
import { Cart } from '../pages/cart';
import { ProductDetail } from '../pages/ProductDetail';
import { Welcome } from '../pages/welcome';


export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />   
                <Route path="/cart" element={<Cart />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/product/:id" element={<ProductDetail />} />  
            </Routes>
        </BrowserRouter>
    )
}