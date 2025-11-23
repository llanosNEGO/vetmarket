export const SupportCenter = () => {
  const supportOptions = [
    {
        id: 1,
        title: "Consultas Frecuentes",
        img: "/images/faq.svg",
    },  
    {
        id: 2,
        title: "Testimonios",
        img: "/images/testimonials.svg",
    },
    {
        id: 3,
        title: "Contacta Groomers",
        img: "/images/groomers.svg",
    }
  ];

    return (
    <div className="bg-gray-50 w-full mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Conoce más y comunícate
      </h2>
        <div className="grid grid-cols-1 md:grid-cols-3"> 
            {supportOptions.map((option) => (
                <div 
                    key={option.id} 
                    className=" p-10 flex flex-col items-center text-center"
                >
                    <div className="mb-4">
                        <img src={option.img} alt={option.title} className="w-16 h-16 object-contain" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {option.title}  
                    </h3>
                </div>
            ))}
        </div>
    </div>
    );
};