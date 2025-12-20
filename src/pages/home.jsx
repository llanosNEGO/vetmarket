import CarouselBar from '../components/Principales/CarouselBar';
import ProductCarousel from '../components/ProductCarousel';
import { CategoryPopulation } from '../components/Categorias/CategoryPopulation';
import { SupportCenter } from '../components/SupportCenter';
import { Header } from '../components/Principales/Header';
import { CategoryBar } from '../components/Categorias/CategoryBar';
import { Footer } from '../components/Principales/footer';

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
