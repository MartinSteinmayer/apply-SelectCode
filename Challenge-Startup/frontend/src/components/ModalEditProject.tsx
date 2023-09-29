import React from 'react';
import { useState } from 'react';
import * as api from '../api';

interface ModalProps {
  title: string;
  isOpen: boolean;
  projectName: string;
  projectDescription: string;
  projectId?: string;
  create?: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

export const ModalEditProject: React.FC<ModalProps> = ({ title, isOpen, onClose, onSubmit, projectName, projectDescription, projectId, create }) => {
  const [name, setName] = useState<string>(projectName);
  const [description, setDescription] = useState<string>(projectDescription);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (create) {
        const response = await api.createProject({
          name: name,
          description: description,
        });
        console.log("Project Updated:", response.data);
        onSubmit(name, description);
        onClose();
        return;
      }
      const response = await api.updateProject(projectId as string, {
        name: name,
        description: description,
      });
      console.log("Project Updated:", response.data);
      onSubmit(name, description);
      onClose();
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  if (!isOpen) return null;

  //ChatGPT generated template
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
            <div className="mt-2">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter project name"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter project description"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
