import numpy as np
from typing import List, Tuple
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
    i = 0
    for x, y, z in list_xyz:
        print(i)
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
        i = i + 1
    return faces


def get_up_mask(height: int, width: int) -> np.ndarray:
    """
    Get the mask corresponding to the projection of the UP cubeface
    on the equirectangular image
    """
    mask = np.zeros((height, width // 4), bool)

    #Get the mask above a single cubeface
    theta = sample_pixels(-np.pi/4, np.pi/4, width // 4)
    phi = -np.arctan(np.cos(theta))
    phi_idx = ((phi/np.pi + 0.5) * height).astype(int)

    for i, j in enumerate(phi_idx):
        mask[:j,i] = True

    #Repeat 4 timse and roll by a half-cubeface
    up_mask = np.tile(mask,4)
    return np.roll(up_mask, width // 8, axis=1)

def norm_to_face(face_size: int, mat: np.ndarray) -> np.ndarray:
    """ Convert from [-1,1] to [0, face_size]"""
    return np.clip((mat+1)*0.5*face_size, 0, face_size)

def get_frbl_maps(out_width: int, out_height: int, face_size: int) -> Tuple[np.ndarray, np.ndarray]:
    """ Generate xy-maps containing FRONT,RIGHT,BACK,LEFT info """
    theta = sample_pixels(-np.pi/4,np.pi/4, out_width/4)
    phi = sample_pixels(-np.pi/2, np.pi/2, out_height)

    #Generate xy-maps for the FRONT face
    map_x = norm_to_face(face_size, np.tan(theta))
    map_y = norm_to_face(face_size, np.divide(np.tan(phi)[:,None],
                                              np.cos(theta)[None,:]))

    # Repeat it to get FRONT, RIGHT, BACK, and LEFT
    map_x = np.tile(map_x, [4,1])
    map_x =+ face_size*np.arange(4)[:, None] # add offsets
    map_x = np.tile(map_x.flatten(), [out_height, 1])

    map_y = np.tile(map_y, 4)

    #Roll
    map_x = np.roll(map_x, 3 * out_width // 8, axis = 1)
    map_y = np.roll(map_y, 3 * out_width // 8, axis = 1)

    return map_x, map_y

def get_ud_maps(out_width: int, out_height: int, face_size: int) -> Tuple[np.ndarray, np.ndarray]
    """ Generate xy-maps containing UP, DOWN info """
    theta = sample_pixels(-np.pi, np.pi, out_width)
    phi = sample_pixels(-np.pi/2, np.pi/2, out_height)

    #Generate xy-maps for the UP face
    inv_tan_phi = -np.tan(np.pi/2 - phi)
    map_x = norm_to_face(face_size, np.multiply(inv_tan_phi[:, None],
                                                np.sin(theta)[None, :]))
    map_y = norm_to_face(face_size, np.multiply(inv_tan_phi[:,None],
                                                np.cos(theta)[None,:]))

    # Repeat it to get UP and DOWN
    map_x = np.vstack((map_x[:out_height//2, :]+4*face_size,
                       np.fliplr(map_x[out_height//2:, :])+5*face_size))

    return map_x, map_y

def cubemap_to_equirec(cubefaces: List[np.ndarray]) -> np.ndarray
    """ Convert a list of cubefaces (FRBLUD) into an equirectangular image """

    #Stack cubefaces horizontally
    cubemap = np.hstack(cubefaces)

    #Set the width of the output image to a multiple of 8
    face_size = cubemap.shape[0]
    out_height = (int(face_size * np.pi) // 8) * 4
    out_width = out_height * 2

    # XY maps
    frbl_x frbl_y = get_frbl_maps(out_width, out_height, face_size)
    ud_x, ud_y = get_ud_maps(out_width, out_height, face_size)

    #Combine
    ceiling = get_up_mask(out_height, out_width).as_type(np.float32)
    ceiling += np.flipud(ceiling)
    map_x = ceiling*ud_x + (1 - ceiling)*frbl_x
    map_y = ceiling*ud_y + (1 - ceiling)*frbl_y

    #Opencv shift
    map_x -= 0.05
    map_y -= 0.05

    return cv2.remap(cubemap, map_x, map_y, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)