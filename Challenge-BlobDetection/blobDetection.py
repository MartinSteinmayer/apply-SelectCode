import cv2
import numpy as np
from sklearn.mixture import GaussianMixture

def get_rectangle_vertices(points):
    # Compute the convex hull of the provided points
    hull = cv2.convexHull(np.array(points))

    # Compute the centroid of the convex hull
    M = cv2.moments(hull)
    cX = int(M["m10"] / M["m00"])
    cY = int(M["m01"] / M["m00"])

    # Use the centroid to determine labels for the 4 hull vertices:
    topmost = tuple(hull[hull[:, :, 1].argmin()][0])
    bottommost = tuple(hull[hull[:, :, 1].argmax()][0])
    leftmost = tuple(hull[hull[:, :, 0].argmin()][0])
    rightmost = tuple(hull[hull[:, :, 0].argmax()][0])

    return [topmost, rightmost, bottommost, leftmost]

def order_points(pts):
    sorted_pts = sorted(pts, key=lambda coord: coord[0] + coord[1])
    top_left = sorted_pts[0]
    bottom_right = sorted_pts[3]
    
    # Check which point has the bigger x between the middle two points
    if sorted_pts[1][0] > sorted_pts[2][0]:
        top_right = sorted_pts[1]
        bottom_left = sorted_pts[2]
    else:
        top_right = sorted_pts[2]
        bottom_left = sorted_pts[1]
        
    return np.array([top_left, top_right, bottom_right, bottom_left])


def four_point_transform(image, pts):
    # Points on the rectangle
    rectangle = np.array([
     [0, 0],
     [image.shape[1] - 1, 0],
     [image.shape[1] - 1, image.shape[0] - 1],
     [0, image.shape[0] - 1]], dtype="float32")  # Change to float32

    # Make sure the points are also float32
    pts = pts.astype("float32")
    
    # Transform matrix
    M = cv2.getPerspectiveTransform(pts, rectangle)

    # Apply transform
    return cv2.warpPerspective(image, M, (image.shape[1], image.shape[0]))

image = cv2.imread('example.jpg')
grayImage = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

t_lower = 50  # Lower Threshold
t_upper = 150  # Upper threshold
  
# Applying the Canny Edge filter
edges = cv2.Canny(grayImage, t_lower, t_upper)

# Find contours
contours, hierarchy  = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
contours = sorted(contours, key=cv2.contourArea, reverse=True)

# Approximate contours to rectangle
peri = cv2.arcLength(contours[0], True)
rect = cv2.approxPolyDP(contours[0], 0.01* peri, True)

newPoints = get_rectangle_vertices(rect)
rect = np.array(newPoints, dtype="int32").reshape((-1, 1, 2))

cv2.drawContours(image, [rect], -1, (0, 255, 0), 2)
cv2.imshow("Contour", image)
cv2.waitKey(0)

ordered_rect = order_points(rect.reshape(4,2)).reshape(-1, 2)[:4]

warped = four_point_transform(grayImage, ordered_rect)

cv2.imshow("Warped", warped)
cv2.waitKey(0)


# Load the image
binary = cv2.threshold(warped, 128, 255, cv2.THRESH_BINARY)[1]

img_width = binary.shape[1]
img_height = binary.shape[0]

# Show the binary image
cv2.imshow("Binary", binary)
cv2.waitKey(0)

# Blob detection
params = cv2.SimpleBlobDetector_Params()
params.filterByArea = True
params.minArea = 0.1
params.maxArea = 100 
detector = cv2.SimpleBlobDetector_create(params)
keypoints = detector.detect(binary)

im_with_keypoints = cv2.drawKeypoints(binary, keypoints, np.array([]), (0,0,255), cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
 
# Show keypoints
cv2.imshow("Keypoints", im_with_keypoints)
cv2.waitKey(0)


# Filter out blobs near the edges
margin = 20 
keypoints = [kp for kp in keypoints if margin < kp.pt[0] < img_width-margin and margin < kp.pt[1] < img_height-margin]

# Extract blob positions
X = np.array([kp.pt for kp in keypoints])

# Use GMM to get centroids
gmm = GaussianMixture(n_components=2).fit(X)
probabilities = gmm.predict_proba(X)


# Set a threshold to filter out blobs based on their occurrence probability
threshold = 0.5 
X_filtered = X[np.max(probabilities, axis=1) > threshold]

# Calculate the dimensions of the rectangle in the image
rect_width_pixel = np.linalg.norm(ordered_rect[0] - ordered_rect[1])
rect_height_pixel = np.linalg.norm(ordered_rect[0] - ordered_rect[3])
offset = 2 # 2cm offset from the edge of the rectangle (1cm from each side)

# Assuming A4 paper
width_cm = 20.0 - offset
height_cm = 29.7 - offset
width_ratio = width_cm / rect_width_pixel
height_ratio = height_cm / rect_height_pixel

print("centroids:" , gmm.means_)

# Decompose the centroid differences into x and y components
delta_x_pixel = gmm.means_[0][0] - gmm.means_[1][0]
delta_y_pixel = gmm.means_[0][1] - gmm.means_[1][1]

# Convert pixel differences to cm
delta_x_cm = delta_x_pixel * width_ratio
delta_y_cm = delta_y_pixel * height_ratio

# Compute the final distance in cm using Pythagoras
centroid_distance_cm = np.sqrt(delta_x_cm**2 + delta_y_cm**2)

print(f"Real distance between centroids: {centroid_distance_cm:.2f} cm")