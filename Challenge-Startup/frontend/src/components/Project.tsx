import React, { useEffect } from "react";
import { useState } from "react";
import { ModalEditProject } from "./ModalEditProject";
import { ModalAssignTask } from "./ModalAssignTask";
import { Link } from "react-router-dom";
import * as api from "../api";

interface ProjectProps {
  name: string;
  description: string;
  isOwner?: boolean;
  id: string;
}

export const Project: React.FC<ProjectProps> = ({
  name,
  description,
  isOwner,
  id,
}) => {
    const [isModalEditProjectOpen, setModalEditProject] = useState(false);
    const [isModalAssignTaskOpen, setModalAssignTask] = useState(false);
    const [userTaskCount, setUserTaskCount] = useState(0);
    const [collaboratorCount, setCollaboratorCount] = useState(0);

    useEffect(() => {
        const fetchUsersFromProject = async () => {
            try {
                const response = await api.getUsersFromProject(id);
                console.log("Users from project:", response.data);
                setCollaboratorCount(response.data.length);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };

        const fetchTasksFromUser = async () => {
            try {
                const response = await api.getTasksFromUserAndProject(id, localStorage.getItem("userEmail") as string);
                console.log("Tasks from user:", response.data);
                setUserTaskCount(response.data.length);
            } catch (error) {
                console.error("Error fetching project:", error);
            } 
        };

        fetchTasksFromUser();
        fetchUsersFromProject();
    }, []);

  return (
    <div className="flex sm:flex-col justify-between items-center sm:items-start bg-white p-4 rounded-md shadow-md mb-4">
      <div className="flex flex-col">
        <h3 className="text-xl font-semibold mb-2">{name}{isOwner && (<span className="text-sm text-gray-500">(owner)</span>)}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-gray-500">Tasks assigned to you: {userTaskCount}</p>
      <p className="text-gray-500 mb-2">
        Total Collaborators: {collaboratorCount}
      </p>
      </div>
      <div className="flex flex-col justify-center items-center sm:flex-row">
      
      <Link to={`/projects/${id}`}>
        <button className="transition duration-300 hover:scale-105 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          View Project
        </button>
      </Link>
      {isOwner && (
        <button className="transition duration-300 hover:scale-105 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 sm:ml-5 mt-3 sm:mt-0" onClick={() => setModalEditProject(true)}>
          Edit Project
        </button>
      )}
      {isOwner && (
        <button className="transition duration-300 hover:scale-105 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 sm:ml-5 mt-3 sm:mt-0" onClick={() => setModalAssignTask(true)}>
          Assign Task
          </button>
        )}
      </div>
      <ModalEditProject
        title="Edit Project"
        isOpen={isModalEditProjectOpen}
        onClose={() => setModalEditProject(false)}
        onSubmit={() => {}}
        projectDescription={description}
        projectName={name}
      />
      <ModalAssignTask
        title="Assign Task"
        isOpen={isModalAssignTaskOpen}
        onClose={() => setModalAssignTask(false)}
        onSubmit={() => {}}
      />
    </div>
  );
};

export type ProjectType = {
  name: string;
  description: string;
  userTaskCount: number;
  collaboratorCount: number;
  isOwner?: boolean;
  id: string;
};
