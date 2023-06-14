import numpy as np
from typing import List
import cv2

def sample_pixels(begin: float, end:float, n: int) -> np.ndarray:
    """
    Sample pixel values of an affine function, which is equal
    to "begin" on the far left and "end on the far right.
    """
    x_coords = 0.5 + np.arange(n, dtype=np.float32)
    return begin + (end-begin) * x_coords / n

def equirec_to_cubemap(equirec: np.ndarray, out_size: int) -> List[np.ndarray]:
    """Convert an equirectangular image to a list of cubefaces (FRBLUD)"""
    height, width = equirec.shape[:2]
    u, v = np.meshgrid(sample_pixels(-1, 1, out_size),
                       sample_pixels(-1, 1, out_size),
                       indexing="ij")
    ones = np.ones((out_size, out_size), dtype=np.float32)

    list_xyz = [
            (v, u, ones),   # FRONT
            (ones, u, -v),  # RIGHT
            (-v, u, -ones), # BACK
            (-ones, u, v),  # LEFT
            (v, -ones, u),  # UP
            (v, ones, -u)   # DOWN
    ]

    faces = []

    r = np.sqrt(u**2 + v**2 + 1) # Same values for each face
    for x, y, z in list_xyz:
        # Camera Convestion RIGHT_DOWN_FRONT
        phi = np.arcsin(y/r) # in [-pi/2, pi/2]
        theta = np.arctan2(x, z) # in [-pi, pi]

        phi_map = (phi/np.pi + 0.5) * height
        theta_map = (theta/(2*np.pi) + 0.5) * width

        #Opencv shift
        theta_map -= 0.5
        phi_map -= 0.5

        faces.append(cv2.remap(equirec, theta_map, phi_map, cv2.INTER_CUBIC,
                               borderMode=cv2.BORDER_WRAP))
        
        return faces
