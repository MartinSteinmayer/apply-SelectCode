import { useState, useEffect } from "react";
import { Comment } from "./Comment";
import * as AiIcons from "react-icons/ai";
import * as api from "../api";
import { useNavigate } from "react-router-dom";

type CommentType = {
  user: string;
  date: string;
  content: string;
};

type CommentsSidebarProps = {
  title: string;
  description: string;
  taskId: string;
  onClose: () => void;
};

export const CommentsSidebar: React.FC<CommentsSidebarProps> = ({
  title,
  description,
  taskId,
  onClose,
}) => {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const navigate = useNavigate();
  
  const addComment = async (comment: string) => {
    try {
      const response = await api.createComment(taskId, {comment: comment});
      if (response.data) {
        setComments([...comments, response.data]);
        setCommentText("");
      }
      console.log("Comment added:", response.data);
    } catch (error) {
      console.error("Error adding comment:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.getCommentsFromTask(taskId);
        setComments(response.data);
        console.log("Comments:", response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        navigate("/login");
      }
    };

    console.log("Fetching comments...");
    fetchComments();
  }, []);

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addComment(commentText);
  };


  return (
    <div className="fixed right-0 top-0 h-full w-1/3 bg-white p-4 overflow-y-auto border-l">
      <button onClick={onClose} className="absolute top-4 right-5 text-xl">
        <AiIcons.AiOutlineClose className="text-3xl" />
      </button>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="mb-6">{description}</p>
      {comments.map((comment) => (
        <Comment key={comment.id} user={comment.user_id} date={comment.created_at} content={comment.comment} />
      ))}
      <form className="mt-6" onSubmit={handleCommentSubmit}>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="comment"
        >
          Add Comment
        </label>
        <textarea
          id="comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>
      <button type="submit" className="transition duration-300 hover:scale-105 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Send Comment
      </button>
    </form>
    </div>
  );
};

export type { CommentType };
