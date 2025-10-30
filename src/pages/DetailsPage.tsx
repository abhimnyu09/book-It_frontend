import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- (Types) ---
type ExperienceDetails = {
  longDescription: string;
  about: string;
  image: string;
};
type Experience = {
  _id: string;
  id: number;
  title: string;
  price: number;
  details: ExperienceDetails;
};
type BookedSlot = {
  experience: {
    date: string;
    time: string;
  }
};

// --- (Dummy data for slots) ---
const dates = ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'];
const times = [
  { time: '07:00 am', left: '4 left' },
  { time: '09:00 am', left: '2 left' },
  { time: '11:00 am', left: '5 left' },
  { time: '1:00 pm', left: 'Sold out' },
];

export const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [experience, setExperience] = useState<Experience | null>(null); // State is Experience OR null
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchDetailsAndAvailability = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [detailsRes, availabilityRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/experiences/${id}`),
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/experiences/${id}/availability`)
        ]);

        setExperience(detailsRes.data);

        const booked = new Set<string>();
        (availabilityRes.data as BookedSlot[]).forEach(slot => {
          booked.add(`${slot.experience.date}-${slot.experience.time}`);
        });
        setBookedSlots(booked);

      } catch (err) {
        setError('Failed to fetch experience. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailsAndAvailability();
  }, [id]); 

  // --- 7. Handle loading, error, and "not found" states ---
  // We check for loading and error first.
  if (isLoading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-xl text-red-500">{error}</div>;
  }

  // *** THIS IS THE FIX ***
  // If we are not loading, and there's no error, BUT 'experience' is still
  // null (e.g., API returned nothing), we show "Not Found" and stop.
  // After this check, TypeScript KNOWS 'experience' cannot be null.
  if (!experience) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Experience not found</h1>
        <Link to="/" className="text-yellow-500 hover:underline mt-4">
          Back to Home
        </Link>
      </div>
    );
  }

  // --- Code is Safe From Here ---
  // Because of the 'if (!experience)' check above, TypeScript
  // knows that 'experience' is 100% of type 'Experience' here.
  // The red lines on 'title', 'details', 'price', and 'experience.id' will disappear.
  
  const { title, details, price } = experience; // This is now safe

  const taxes = 59;
  const subtotal = price * quantity;
  const total = subtotal + taxes;
  const isSelectionComplete = selectedDate && selectedTime;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="text-gray-700 hover:text-gray-900 mb-4"
      >
        &larr; Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img
            src={details.image}
            alt={title}
            className="w-full h-96 object-cover rounded-xl shadow-lg mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-lg text-gray-700 mb-6">{details.longDescription}</p>

          {/* Date Picker */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Choose date</h2>
            <div className="flex space-x-3">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedDate === date
                      ? 'bg-yellow-400 border-yellow-400 font-bold'
                      : 'bg-white border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Choose time</h2>
            <div className="flex flex-wrap gap-3">
              {times.map((slot) => {
                const slotKey = `${selectedDate}-${slot.time}`;
                const isBooked = bookedSlots.has(slotKey);
                const isSoldOut = slot.left === 'Sold out';

                return (
                  <button
                    key={slot.time}
                    disabled={isSoldOut || isBooked || !selectedDate}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`px-4 py-3 rounded-lg border w-40 text-left ${
                      (isSoldOut || isBooked)
                        ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                        : !selectedDate
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-gray-300 hover:border-gray-500'
                    } ${
                      selectedTime === slot.time
                        ? 'border-yellow-500 border-2'
                        : ''
                    }`}
                  >
                    <span className="font-bold">{slot.time}</span>
                    <br />
                    <span className="text-sm text-gray-500">
                      {isBooked ? 'Booked' : slot.left}
                    </span>
                  </button>
                );
              })}
            </div>
            {!selectedDate && (
              <p className="text-sm text-yellow-700 mt-2">Please select a date first</p>
            )}
            <p className="text-sm text-gray-500 mt-2">All times are in IST (GMT +5:30)</p>
          </div>
          
          {/* About section */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">About</h2>
            <p className="text-gray-700">{details.about}</p>
          </div>
        </div>

        {/* Price Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border p-6 sticky top-24">
             <h3 className="text-2xl font-bold mb-4">Price Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Starts at</span>
                <span className="font-bold">₹{price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Quantity</span>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} className="w-8 h-8 rounded-full border border-gray-400 disabled:opacity-50">-</button>
                  <span className="font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 rounded-full border border-gray-400">+</button>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes</span>
                <span>₹{taxes}</span>
              </div>
            </div>
            <hr className="my-4 border-t-2" />
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            
            <Link
              to="/checkout"
              state={{
                experienceId: experience.id, // This is now safe
                experienceTitle: title,
                date: selectedDate,
                time: selectedTime,
                quantity: quantity,
                subtotal: subtotal,
                taxes: taxes,
                total: total,
              }}
              className={!isSelectionComplete ? 'pointer-events-none' : ''}
            >
              <button
                disabled={!isSelectionComplete}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg shadow disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSelectionComplete ? 'Confirm' : 'Please select date & time'}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
