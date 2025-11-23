import { Header } from '../components/Header';
import  {CategoryBar}  from '../components/CategoryBar';
import CarouselBar from '../components/CarouselBar';
import ProductCarousel from '../components/ProductCarousel';
import { Footer } from '../components/footer';
import { CategoryPopulation } from '../components/CategoryPopulation';
import { SupportCenter } from '../components/SupportCenter';

export const Home = () => {
    return (
        <div>
            <Header /> 
            <CategoryBar />         
            <CarouselBar />
            <ProductCarousel />
            <CategoryPopulation />
            <SupportCenter />
            <Footer />
        </div>       
            
    );
};
