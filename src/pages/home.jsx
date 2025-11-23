import { Header } from '../components/Header';
import  {CategoryBar}  from '../components/CategoryBar';
import CarouselBar from '../components/CarouselBar';
import ProductCarousel from '../components/ProductCarousel';
import { Footer } from '../components/footer';

export const Home = () => {
    return (
        <div>
            <Header /> 
            <CategoryBar />         
            <CarouselBar />
            <ProductCarousel />
            <Footer />
        </div>       
            
    );
};
