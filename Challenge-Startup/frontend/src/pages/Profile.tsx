import React from 'react';
import { user } from '../api';

export const Profile = () => {
    const [email, setEmail] = React.useState<string>('');

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await user();
                console.log('User:', response.data);
                setEmail(response.data.data[0].email);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        console.log('Fetching user...');
        fetchUser();
    }, []);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100">
        <div className="flex flex-col items-center mt-10 text-center">
          <h2 className="w-full font-semibold mb-2" style={{fontSize:50}}>Welcome!</h2>
          <h3 className="w-full text-gray-600" style={{fontSize:25}}>{email}</h3>
      </div>
    </div>
  );
};
