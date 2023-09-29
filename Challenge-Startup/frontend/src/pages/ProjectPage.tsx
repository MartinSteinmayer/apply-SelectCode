import { useState, useEffect } from "react";
import { taskType } from "../components/Task";
import { Task } from "../components/Task";
import { CommentsSidebar } from "../components/CommentsSidebar";
import * as api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { ModalAssignTask } from "../components/ModalAssignTask";
import { CollaboratorsSidebar } from "../components/CollaboratorsSidebar";

export const ProjectPage = () => {
  const { projectId = "" } = useParams<{ projectId: string }>();
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [otherTasks, setOtherTasks] = useState<any[]>([]);
  const [currentTask, setCurrentTask] = useState<taskType | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [commentsKey, setCommentsKey] = useState<number>(0);
  const [onOpenComments, setOnOpenComments] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isModalAssignTaskOpen, setModalAssignTask] = useState(false);
  const [taskUpdated, setTaskUpdated] = useState<boolean>(false);
  const [openCollaborators, setOpenCollaborators] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleOpenComments = (task: any) => {
    setCurrentTask(task);
    setCommentsKey((prevKey) => prevKey + 1);
    setOnOpenComments(true);
  };

  const handleCloseComments = () => {
    setCurrentTask(null);
    setOnOpenComments(false);
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
        const response = await api.getTasksFromProject(projectId);
        const tasks = response.data;
        const usersTasks = await api.getTasksFromUser();

        setUserTasks(tasks.filter(
          (task: any) =>
            usersTasks.data.some((userTask: any) => userTask.id === task.id))
        );

        setOtherTasks(
          tasks.filter(
            (task: any) =>
              !usersTasks.data.some((userTask: any) => userTask.id === task.id)
          )
        );
        console.log("Projects:", response.data);
      } catch (error) {
        console.error("Error fetching Tasks:", error);
        navigate("/login");
      }
    };

    const fetchProject = async () => {
      try {
        const response = await api.getProject(projectId);
        const project = response.data;
        setIsOwner(project.owner_id === localStorage.getItem("userId"));
        setProjectName(project.name);
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
  }, [taskUpdated]);

  const handleTaskAssignment = async (_taskName: string, _userEmail: string) => {
    setTaskUpdated(!taskUpdated); // just to trigger useEffect
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="mb-1 mt-1">Project: {projectName}</h2>
        <div className="" style={{minHeight: 300}}>
          <h2 className="text-2xl font-semibold mb-4 text-center lg:text-start mx-auto sm:mx-0">
            Your Tasks
          </h2>
          <hr className="mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:w-full mx-auto grid-tasks">
            {userTasks.map((task) => (
              <Task
                title={task.title}
                description={task.description}
                onOpenComments={() => handleOpenComments(task)}
                project={task.project_id}
                status={task.status}
                key={task.id}
                id={task.id}
                assignedTo={true}
                onOpenCollaborators={() => handleOpenCollaborators(task)}

              />
            ))}
          </div>
        </div>
        {isOwner && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center lg:text-start mx-auto sm:mx-0">
              Other Tasks
            </h2>
            <hr className="mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:w-full mx-auto grid-tasks">
              {otherTasks.map((task) => (
                <Task
                  title={task.title}
                  description={task.description}
                  onOpenComments={() => handleOpenComments(task)}
                  project={task.project_id}
                  status={task.status}
                  key={task.id}
                  id={task.id}
                  assignedTo={false}
                  onOpenCollaborators={() => handleOpenCollaborators(task)}
                  showProjectName={false}
                />
              ))}
            </div>
          </div>
        )}
        {isOwner && (
          <button
            className="transition duration-300 hover:scale-105 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 sm:ml-5 mt-3 sm:mt-0"
            onClick={() => setModalAssignTask(true)}
          >
            Assign Task
          </button>
        )}
      </div>
      {currentTask && onOpenComments && (
        <CommentsSidebar
          title={currentTask.title}
          description={currentTask.description}
          taskId={currentTask.id}
          onClose={handleCloseComments}
          key={commentsKey}
        />
      )}
      <ModalAssignTask
        title="Assign Task"
        isOpen={isModalAssignTaskOpen}
        onClose={() => setModalAssignTask(false)}
        onSubmit={handleTaskAssignment}
        projectId={projectId}
      />
      {openCollaborators && (
        <CollaboratorsSidebar
          title="Collaborators"
          projectId={projectId}
          taskId={currentTask?.id}
          isOpen={openCollaborators}
          onClose={handleCloseCollaborators}
          showAddCollaborators={isOwner}
        />
      )}
    </>
  );
};
