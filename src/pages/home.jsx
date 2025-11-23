import { Header } from '../components/Header';
import  {CategoryBar}  from '../components/CategoryBar';
import CarouselBar from '../components/CarouselBar';
import ProductCarousel from '../components/ProductCarousel';
import { Footer } from '../components/footer';
import { CategoryPopulation } from '../components/CategoryPopulation';

export const Home = () => {
    return (
        <div>
            <Header /> 
            <CategoryBar />         
            <CarouselBar />
            <ProductCarousel />
            <CategoryPopulation />
            <Footer />
        </div>       
            
    );
};
