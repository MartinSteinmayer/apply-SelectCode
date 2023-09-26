import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../api";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getProjects();
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
        navigate("/login");
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await api.getTasksFromUser();
        console.log(response.data);
        const activeTasks = response.data.filter(
          (task : any) => task.status !== "Finished"
        );
        console.log(activeTasks);
        setTasks(activeTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
        navigate("/login");
      }
    };

    fetchTasks();
    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Your Workspace</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Projects</h3>
            <p className="text-gray-600 mb-4">
              You have {projects.length} active projects.
            </p>
            <Link to="/projects">
              <button className="bg-blue-500 transition duration-300 hover:scale-105 text-white px-4 py-2 rounded hover:bg-blue-600">
                View Projects
              </button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Tasks</h3>
            <p className="text-gray-600 mb-4">
              You have {tasks.length} active tasks.
            </p>
            <Link to="/tasks">
              <button className="bg-blue-500 transition duration-300 hover:scale-105 text-white px-4 py-2 rounded hover:bg-blue-600">
                View Tasks
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
