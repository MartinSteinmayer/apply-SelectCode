# Challenge Report for Martin Steinmayer

## Challenge Name: Docker

### Status

Please update the status of the challenge:

- [ ] Not Started
- [ ] Partially Completed
- [X] Fully Completed

*(Check the box that applies to your status)*

### Solution (if applicable)

I have made a simple Deno server that returns a counter that increments every time the server is called. The server is running in a docker container and the counter is stored in a redis database that is also running in a docker container. The server is also using a docker volume to store logs and a docker network to comunicate with the second server that shows the current value of the counter.


### Approach

I read through the documentation from Deno and Redis to understand how to use them. I had a bit of trouble because the version of Deno i used was the latest, and it had significant changes in relation to http request (so i had to do it mostly without help from chatGPT haha). After that I started to implement the server, the redis database connection, the dockerfile and the docker-compose file. For the second server i made another dockerfile and copied almost everything from the first server. For the docker volume and network chatGPT helped me a lot and i was able to do it quite smoothly.


### Learnings

I learned a lot about docker (especially docker volumes and docker network) and redis, and also about the new features of Deno. It was a great opportunity to practice my skills with docker and redis and to learn more about Deno.
