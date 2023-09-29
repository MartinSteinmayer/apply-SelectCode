import { Project } from "../components/Project";
import { useState, useEffect } from "react";
import { ModalEditProject } from "../components/ModalEditProject";
import "../components/Project.css";
import { useNavigate } from "react-router-dom";
import * as api from "../api";

export const Projects = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [isModalEditProjectOpen, setModalEditProject] = useState<boolean>(false);
    const [wasEdited, setWasEdited] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
        try {
            const response = await api.getProjects();
            setProjects(response.data);
            console.log("Projects:", response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            navigate("/login");
        }
        };

        console.log("Fetching projects...");
        

        fetchProjects();
    }, [wasEdited, isModalEditProjectOpen]);

    const handleCreateProject = async (_name: string, _description: string) => {
        setModalEditProject(false);
    }

    const handleEditProject = async () => {
        console.log("Project edited");
        setWasEdited(!wasEdited);
    }

    return (
        <>
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4 text-center sm:text-start">Your Projects</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:w-full mx-auto">
            {projects.map((project) => (
                <Project
                name={project.name}
                description={project.description}
                isOwner={project.owner_id === localStorage.getItem("userId")}
                id={project.id}
                key={project.id + 1}
                onChange={handleEditProject}
                />
            ))}
            </div>
            <div className="mt-4 text-center">
            <button className="bg-blue-500 transition duration-300 hover:scale-105 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setModalEditProject(true)}>
                Create New Project
            </button>
            </div>
        </div>
        <ModalEditProject
        title="Create New Project"
        projectName=""
        projectDescription=""
        create={true}
        isOpen={isModalEditProjectOpen}
        onClose={() => setModalEditProject(false)}
        onSubmit={handleCreateProject}
      />
        </>
    );
};
