# Answers to the questions in the challenge

### Local Kubernetes Cluster: Set up a local Kubernetes cluster using k3d, Docker Desktop, or Minikube. Document the steps you followed and any challenges you faced during the setup.

- I used Docker Desktop to set up a local Kubernetes cluster. I followed the steps from `https://docs.docker.com/desktop/kubernetes/` and it was quite easy to set up. I had some problems with the cluster not starting but i solved it by restarting Docker Desktop.

### Static Site Deployment: Create a static HTML site using PicoCSS, featuring a recipe of your choice (bonus points for a fun recipe from ChatGPT!). Decide on the deployment strategy for this site in a Kubernetes cluster. Would you build a custom docker image, use a persistent volume mount, or employ a ConfigMap? Justify your choice.

- I would build a custom Docker image, it's easier to version, roll back if necessary, and distribute across multiple nodes. And the other options are far to complex for a simple static website.

### Kubernetes Manifests: Write Kubernetes manifests to deploy this site to your cluster. Expose the site using a NodePort on port 80.

- First, i created a dockerfile to make a Docker image with Nginx to serve the static website. I then created a deployment and a service to expose the site using NodePort. The site is accessible at `localhost:30163`.

###  Ingress Controller: Implement an Ingress controller (another nginx instance) to manage access to your services. You can deploy it via Helm (use Helmfile) or use one of the default methods provided. Include the yaml configuration file in your submission and explain your choice of ingress controller (nginx vs traefik).

- I got the Ingress Controller from `https://artifacthub.io/packages/helm/ingress-nginx/ingress-nginx#configuration` and used Helm to deploy it. I chose Nginx because it's the most popular Ingress controller and it's the one I'm most familiar with.

### Database Deployment Opinion: Share your personal opinion on deploying a Postgres database on a Kubernetes cluster versus using a managed service. Discuss potential pros and cons. If you were to deploy Postgres on a cluster, which operator would you use and how would you expose the databases?

- I think it depends heavily on the level of skill in Kubernetes and Cloud Computing in general and overall will of the people working on the project. Deploying it manually certainly will be cheaper if a lot of computing power is needed, but it will require a lot of work. In my own opinion using a managed service is better because it's easier to maintain and, most of the time, more secure. 

- If i were to deploy a Postgres Database on a cluster I would use the operator from CrunchyData and expose the databases to the applications within the cluster using a ClusterIP service.
    



