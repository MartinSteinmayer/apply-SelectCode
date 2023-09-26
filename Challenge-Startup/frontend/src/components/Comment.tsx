import React from 'react';
import * as api from '../api';

type CommentProps = {
  user: string;
  date: string;
  content: string;
};

export const Comment: React.FC<CommentProps> = ({ user, date, content }) => {

  return (
    <div className="border p-2 mb-2">
      <div className="font-bold">{user}</div>
      <div className="text-sm text-gray-500">{date}</div>
      <div>{content}</div>
    </div>
  );
};
