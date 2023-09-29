import { Task, taskType } from "../components/Task";
import { useState, useEffect } from "react";
import { CommentsSidebar } from "../components/CommentsSidebar";
import "../components/Task.css";
import * as api from "../api";
import { useNavigate } from "react-router-dom";
import { CollaboratorsSidebar } from "../components/CollaboratorsSidebar";

export const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentTask, setCurrentTask] = useState<taskType | null>(null);
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [openCollaborators, setOpenCollaborators] = useState<boolean>(false);
  const [commentsKey, setCommentsKey] = useState<number>(0);
  const navigate = useNavigate();

  const handleOpenComments = (task: any) => {
    setCurrentTask(task);
    setCommentsKey((prevKey) => prevKey + 1);
    setOpenComments(true);
  };

  const handleCloseComments = () => {
    setCurrentTask(null);
    setOpenComments(false);
  };

  const handleOpenCollaborators = (task: any) => {
    setOpenCollaborators(true);
    setCurrentTask(task);
  };

  const handleCloseCollaborators = () => {
    setOpenCollaborators(false);
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
                assignedTo={true}
                onOpenCollaborators={() => handleOpenCollaborators(task)}
              />
            ))}
        </div>
      </div>
      {currentTask && openComments && (
        <CommentsSidebar
          key={commentsKey}
          title={currentTask.title}
          description={currentTask.description}
          taskId={currentTask.id}
          onClose={handleCloseComments}
        />
      )}
      {openCollaborators && (
        <CollaboratorsSidebar
          taskId={currentTask?.id}
          onClose={handleCloseCollaborators}
          isOpen={openCollaborators}
          title={currentTask?.title as string}
          showAddCollaborators={false}
        />
      )}
    </>
  );
};
