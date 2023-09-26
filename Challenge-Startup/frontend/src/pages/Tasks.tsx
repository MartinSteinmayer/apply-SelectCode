import { Task, taskType } from "../components/Task";
import { useState, useEffect } from "react";
import { CommentsSidebar } from "../components/CommentsSidebar";
import "../components/Task.css";
import * as api from "../api";
import { useNavigate } from "react-router-dom";

export const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentTask, setCurrentTask] = useState<taskType | null>(null);
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
        const response = await api.getTasksFromUser();
        setTasks(response.data);
        console.log("Projects:", response.data);
      } catch (error) {
        console.error("Error fetching Tasks:", error);
        navigate("/login");
      }
    };

    console.log("Fetching Tasks...");
    fetchTasks();
  }, []);

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center lg:text-start mx-auto sm:mx-0">
          Your Tasks
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:w-full mx-auto grid-tasks">
          {tasks
            .sort((a, b) => {
              if (a.status === "Finished" && b.status !== "Finished") return 1;
              if (a.status !== "Finished" && b.status === "Finished") return -1;
              return 0;
            })
            .map((task) => (
              <Task
                title={task.title}
                description={task.description}
                onOpenComments={() => handleOpenComments(task)}
                project={task.project_id}
                showProjectName={true}
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
