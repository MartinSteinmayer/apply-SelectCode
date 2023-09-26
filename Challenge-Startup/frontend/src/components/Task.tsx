import React, { useState, useEffect } from "react";
import "./Task.css";
import * as api from "../api";
import { useNavigate } from "react-router-dom";

type taskType = {
  title: string;
  project: string;
  description: string;
  status: string;
  id: string;
  onOpenComments: () => void;
  showProjectName?: boolean;
};

export const Task: React.FC<taskType> = ({
  title,
  description,
  project,
  status,
  showProjectName,
  id,
  onOpenComments,
}) => {
  const [currentStatus, setStatus] = useState<string>(status);
  const [changingStatus, setChangingStatus] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const navigate = useNavigate();

  const handleStatusChange = () => {
    switch (currentStatus) {
      case "Todo":
        setStatus("In-progress");
        break;
      case "In-progress":
        setStatus("Finished");
        break;
      case "Finished":
        setStatus("Todo");
        break;
      default:
        break;
    }
  };

  const handleStatusConfirm = async () => {
    try {
      const response = await api.updateTaskStatus(id, {status: currentStatus});
      console.log("Task status updated:", response.data);
    } catch (error) {
      console.error("Error updating task status:", error);
      navigate("/login");
    }
    setChangingStatus(false);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.getCommentsFromTask(id);
        setComments(response.data);
        console.log("Comments:", response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        navigate("/login");
      }
    };

    const fetchCollaborators = async () => {
      try {
        const response = await api.getAssigneesFromTask(id);
        setCollaborators(response.data);
        console.log("Collaborators:", response.data);
      } catch (error) {
        console.error("Error fetching collaborators:", error);
        navigate("/login");
      }
    };

    console.log("Fetching comments...");
    fetchComments();
    console.log("Fetching collaborators...");
    fetchCollaborators();

    console.log(showProjectName);

    if (!showProjectName) return;
    const fetchProjectName = async () => {
      try {
        console.log(project)
        const response = await api.getProject(project);
        setProjectName(response.data.name);
        console.log("Project:", response.data);
      } catch (error) {
        console.error("Error fetching project:", error);
        navigate("/login");
      }
    };

    console.log("Fetching project name...");
    fetchProjectName();
  }, []);

  

  return (
    <div className="border p-4 mb-4 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-2 h-full flex-col sm:flex-row">
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg font-semibold">
              {title}{" "}
              {showProjectName && (
                <span className="text-sm text-gray-500">({projectName})</span>
              )}
            </h3>
            <p className="mb-2 task-description">{description}</p>
          </div>
          <div className="flex space-x-3">
            <button
              className="transition duration-300 hover:scale-105 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={onOpenComments}
            >
              View Comments
            </button>
            <button
              className="transition duration-300 hover:scale-105 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => {
                handleStatusChange();
                setChangingStatus(true);
              }}
            >
              Update Status
            </button>
          </div>
        </div>

        <div className="text-center flex flex-col mt-5 sm:mt-0">
          <h3
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              currentStatus === "Todo"
                ? "bg-red-200 text-red-800"
                : currentStatus === "In-progress"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {currentStatus}
          </h3>
          {changingStatus && (
            <button
              className="transition text-xs duration-300 hover:scale-105 bg-blue-500 text-white px-2 py-2 m-2 rounded-md hover:bg-blue-600"
              onClick={handleStatusConfirm}
            >
              Confirm Status
            </button>
          )}
          <div className="text-sm text-gray-500">
            {comments.length} comments
          </div>
          <div className="text-sm text-gray-500">
            {collaborators?.length} collaborators
          </div>
        </div>
      </div>
    </div>
  );
};

export type { taskType };
