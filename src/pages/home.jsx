import { Header } from '../components/Header';
import  {CategoryBar}  from '../components/CategoryBar';
import CarouselBar from '../components/CarouselBar';
import ProductCarousel from '../components/ProductCarousel';

export const Home = () => {
    return (
        <div>
            <Header /> 
            <CategoryBar />         
            <CarouselBar />
            <ProductCarousel />
        </div>       
            
    );
};
