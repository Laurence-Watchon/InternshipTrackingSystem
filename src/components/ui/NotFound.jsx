import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Illustration/Icon Area */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <h1 className="text-[12rem] font-bold text-green-600">404</h1>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-white p-6 rounded-3xl shadow-xl ring-1 ring-gray-900/5">
              <Map className="w-20 h-20 text-green-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Oops! Page not found
          </h2>
          <p className="text-gray-600 text-lg">
            It looks like the page you're looking for doesn't exist or has been moved to a new destination.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-all active:scale-95 shadow-lg shadow-green-200 min-w-[160px]"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Support Section */}
        <p className="text-sm text-gray-500 pt-8">
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
