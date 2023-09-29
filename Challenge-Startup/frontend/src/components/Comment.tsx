import React from 'react';
import * as api from '../api';

type CommentProps = {
  userId: string;
  date: string;
  content: string;
};

export const Comment: React.FC<CommentProps> = ({ userId, date, content }) => {
  const dateObject = new Date(date);
  const dateString = dateObject.toUTCString();
  const [userObject, setUserObject] = React.useState<string>('');

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.getUser(userId);
        console.log('User:', response.data);
        setUserObject(response.data.email);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    console.log('Fetching user...');
    fetchUser();
  }, []);

  return (
    <div className="border p-2 mb-2">
      <div className="font-bold">{userObject}</div>
      <div className="text-sm text-gray-500">{dateString}</div>
      <div>{content}</div>
    </div>
  );
};
