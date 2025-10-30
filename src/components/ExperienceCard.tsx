import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link

type ExperienceCardProps = {
  id: number; // 2. Add id to the props
  imageUrl: string;
  title: string;
  location: string;
  description: string;
  price: number;
};

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  id, // Get id from props
  imageUrl,
  title,
  location,
  description,
  price,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {/* Image */}
      <img
        className="h-48 w-full object-cover"
        src={imageUrl}
        alt={title}
      />

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
            {location}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4 h-10">{description}</p>
        
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-gray-900">
            From ₹{price}
          </p>
          
          {/* 3. Wrap the button in a Link */}
          <Link to={`/details/${id}`}>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg text-sm">
              View Details
            </button>
          </Link>
          
        </div>
      </div>
    </div>
  );
};