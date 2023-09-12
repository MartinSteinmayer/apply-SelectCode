# Blob Detection Algorithm

## Segmentation of the paper

- I started with applying a greyscale filter to the image and then used a canny filter to detect the edges in the image. After that i found the contours of the image and sorted them in descending order with base on the contour area and used the contour with the largest area as the contour of the paper. I then used the contour and the `get_rectangle_vertices()` function to find the rectangle and then used it in the `four_point_transform()` to find the homography matrix and applied it to warp the image and get the top view of the paper. 

## Blob Detection, Clustering of the blobs and Calculation of the distance between the two centers of the blob clusters

- I used the top view of the paper to find the contours of the blobs and then used the contours to find the center of each cluster and filtered the blobs based on their occurrence probability. After that i used the center of the clusters to find the distance between the two clusters, effectively getting an approximate distance between sit bones.

## Additional

- The functions used were primarily given by ChatGPT and it also gave me a good starting point for the rest of the code, especially with numpy and opencv. I've also added a few `cv2.imshow()` functions to show the intermediate steps of the code.

## Learnings

- I had never worked with anything in the area of Computer Vision, the closest being one PGDP exercise in which we had to implement a Seam Carving algorithm in java from scratch (very annoying btw), so I really had to get a lot of help from ChatGPT and the internet in general, but it was a very good learning experience. As a game engineer, CV is a very powerful tool and I'm certain the demand for it will only get higher in the future.