
import { Link } from 'react-router-dom';

export const ResultPage = () => {
  return (
    <div className="max-w-md mx-auto text-center py-20">
      {/* Green Checkmark Icon */}
      <svg
        className="w-24 h-24 text-green-500 mx-auto mb-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Booking Confirmed
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Ref ID: <span className="font-semibold">HUF56&SO</span>
      </p>

      <Link to="/">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow">
          Back to Home
        </button>
      </Link>
    </div>
  );
};
