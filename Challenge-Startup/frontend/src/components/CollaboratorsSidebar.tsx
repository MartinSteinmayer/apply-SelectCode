import React, { useState, useEffect } from "react";
import * as AiIcons from "react-icons/ai";
import * as api from "../api";
import { useNavigate } from "react-router-dom";

type CollaboratorType = {
  id: string;
  name: string;
  email: string;
};

type CollaboratorSidebarProps = {
  title: string;
  taskId?: string;
  projectId?: string;
  onClose: () => void;
  showAddCollaborators?: boolean;
  isOpen: boolean;
};

export const CollaboratorsSidebar: React.FC<CollaboratorSidebarProps> = ({
  title,
  taskId,
  projectId,
  showAddCollaborators,
  onClose,
  isOpen,
}) => {
  const [collaborators, setCollaborators] = useState<CollaboratorType[]>([]);
  const [collaboratorEmail, setCollaboratorEmail] = useState<string>("");
  const [collaboratorAdded, setCollaboratorAdded] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        let response;
        if (taskId) {
          response = await api.getAssigneesFromTask(taskId);
        } else if (projectId) {
          response = await api.getUsersFromProject(projectId);
        }

        if (response && response.data) {
          setCollaborators(response.data);
          console.log("Collaborators:", response.data);
        }
      } catch (error) {
        console.error("Error fetching collaborators:", error);
        navigate("/login");
      }
    };

    console.log("Fetching collaborators...");
    fetchCollaborators();
  }, [collaboratorAdded]);

  const addCollaborator = async () => {
    try {
      console.log("TaskId:", taskId)
      console.log("ProjectId:", projectId)
      const response = await api.assignTask(
        projectId as string,
        taskId as string,
        { user_email: collaboratorEmail }
      );

      if (response && response.data) {
        setCollaborators([...collaborators, response.data]);
        setCollaboratorEmail("");
        console.log("Collaborator added:", response.data);
        setCollaboratorAdded(!collaboratorAdded);
      }
    } catch (error) {
      console.error("Error adding collaborator:", error);
      navigate("/login");
    }
  };



  if (collaborators.length === 0 || !isOpen) {
    return null;
  }

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white p-4 overflow-y-auto border-l">
      <button onClick={onClose} className="absolute top-4 right-5 text-xl">
        <AiIcons.AiOutlineClose className="text-3xl" />
      </button>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <ul>
        {collaborators.map((collaborator) => (
          <li key={collaborator.id}>
            <strong>{collaborator.name}</strong> ({collaborator.email})
          </li>
        ))}
      </ul>
      {showAddCollaborators && (
        <div className="mb-4">
          <input
            type="email"
            value={collaboratorEmail}
            onChange={(e) => setCollaboratorEmail(e.target.value)}
            placeholder="Enter email"
            className="border px-2 py-1 mr-2 mt-5"
          />
          <button
            onClick={addCollaborator}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Collaborator
          </button>
        </div>
      )}
    </div>
  );
};

export type { CollaboratorType };
