import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExperienceCard } from '../components/ExperienceCard';
import { useSearch } from '../context/SearchContext'; // 1. Import our hook

type Experience = {
  _id: string;
  id: number;
  title: string;
  location: string;
  description: string;
  price: number;
  imageUrl: string;
};

export const HomePage = () => {
  // 2. Get the 'searchQuery' from our context
  const { searchQuery } = useSearch();

  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all experiences once on load
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/experiences`);
        setAllExperiences(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch experiences. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []); 

  // 3. Filter the experiences based on the searchQuery
  const filteredExperiences = allExperiences.filter(exp =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 4. Show loading and error messages
  if (isLoading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-xl text-red-500">{error}</div>;
  }

  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 5. The duplicate search bar is now GONE! */}

      {/* 6. Experiences Grid (renders the *filtered* results) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredExperiences.map((exp) => (
          <ExperienceCard
            key={exp._id}
            id={exp.id}
            title={exp.title}
            location={exp.location}
            description={exp.description}
            price={exp.price}
            imageUrl={exp.imageUrl}
          />
        ))}
      </div>
      
      {/* 7. Show a message if no results are found */}
      {filteredExperiences.length === 0 && !isLoading && (
        <div className="text-center py-20 text-xl text-gray-500">
          No experiences found matching "{searchQuery}"
        </div>
      )}
    </main>
  );
};
