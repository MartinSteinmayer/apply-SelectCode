import { Link } from 'react-router-dom';

export const VerifyEmail = () => {
  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Verify your email</h2>
        <p className="text-gray-600 mb-4">
          Please check your inbox and click on the verification link we've sent you.
        </p>
        <Link to="/login" className="text-blue-500 hover:underline">
          Go to login page
        </Link>
      </div>
    </div>
  );
};
