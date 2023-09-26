import { useState, useEffect } from "react";
import { taskType } from "../components/Task";
import { Task } from "../components/Task";
import { CommentsSidebar } from "../components/CommentsSidebar";
import * as api from "../api";
import { useNavigate, useParams } from "react-router-dom";

export const ProjectPage = () => {
  const { projectId = "" } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentTask, setCurrentTask] = useState<taskType | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const navigate = useNavigate();

  const handleOpenComments = (task: any) => {
    setCurrentTask(task);
  };

  const handleCloseComments = () => {
    setCurrentTask(null);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.getTasksFromProject(projectId);
        setTasks(response.data);
        console.log("Projects:", response.data);
      } catch (error) {
        console.error("Error fetching Tasks:", error);
        navigate("/login");
      }
    };

    const fetchProject = async () => {
      try {
        const response = await api.getProject(projectId);
        setProjectName(response.data.name);
        console.log("Project:", response.data);
      } catch (error) {
        console.error("Error fetching Project:", error);
        navigate("/login");
      }
    };

    console.log("Fetching Tasks...");
    fetchTasks();
    console.log("Fetching Project...");
    fetchProject();
  }, []);

  return (
    <>
      <div className="container mx-auto p-4">
        <h2>Project: {projectName}</h2>
        <h2 className="text-2xl font-semibold mb-4 text-center lg:text-start mx-auto sm:mx-0">
          Your Tasks
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:w-full mx-auto grid-tasks">
          {tasks.map((task) => (
            <Task
              title={task.title}
              description={task.description}
              onOpenComments={() => handleOpenComments(task)}
              project={task.project}
              status={task.status}
              key={task.id}
              id={task.id}
            />
          ))}
        </div>
      </div>
      {currentTask && (
        <CommentsSidebar
          title={currentTask.title}
          description={currentTask.description}
          taskId={currentTask.id}
          onClose={handleCloseComments}
        />
      )}
    </>
  );
};
