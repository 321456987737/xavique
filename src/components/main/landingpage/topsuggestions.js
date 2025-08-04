import React from 'react'

const Topsuggestions = () => {
  const cards = [
    {
      BgColor: "bg-green-400",
      category: "men",
      subcategory: "jewelery",
      image: "/link",
    },
    {
      BgColor: "bg-cyan-400",
      category: "men",
      subcategory: "shoes",
      image: "/link",
    },
    {
      BgColor: "bg-red-400",
      category: "men",
      subcategory: "accessories",
      image: "/link",
    },
    {
      BgColor: "bg-pink-400",
      category: "women",
      subcategory: "begs",
      image: "/link",
    },
    {
      BgColor: "bg-yellow-400",
      category: "women",
      subcategory: "jewelery",
      image: "/link",
    },
    {
      BgColor: "bg-orange-400",
      category: "women",
      subcategory: "shoe",
      image: "/link",
    },
    {
      BgColor: "bg-gray-400",
      category: "women",
      subcategory: "shoe",
      image: "/link",
    },
    {
      BgColor: "bg-slate-400",
      category: "women",
      subcategory: "shoe",
      image: "/link",
    },
  ];

  return (
    <div className="w-full flex items-center justify-center px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`h-[280px] w-full ${card.BgColor} rounded-lg shadow-md flex items-center justify-center text-white text-lg font-semibold`}
          >
            {card.category} — {card.subcategory}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topsuggestions;
