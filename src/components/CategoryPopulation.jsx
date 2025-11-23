export const CategoryPopulation = () => {
  const categories = [
    {
      id: 1,
      name: "Caninos",
      image: "/images/perro.webp",
      description: "Alimentos, snacks y accesorios para perros",
      color: "from-blue-500 to-blue-800"
    },
    {
      id: 2,
      name: "Gatos",
      image: "/images/gato.webp", 
      description: "Todo para el cuidado de tu gato",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 3,
      name: "Otras Especies",
      image: "/images/cuy.webp",
      description: "Productos para aves, roedores y más",
      color: "from-green-500 to-green-600"
    },
    {
      id: 4,
      name: "Veterinaria",
      image: "/images/veterinaria.webp",
      description: "Medicamentos y cuidados profesionales",
      color: "from-red-500 to-red-60"
    }
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Categorías Populares
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 transform cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <div className="relative p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 mb-4 flex items-center justify-center">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {category.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};