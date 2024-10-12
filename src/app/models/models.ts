export interface LoginResponse {
  token: string;
  user_id: number;
  email: string;
  username: string;
  x_csrftoken?: string;
}

interface Category {
  id: number;
  name: string;
}
export interface Video {
  id: number;
  title: string;
  description: string;
  created_at: string;
  categories: Category[];
  video_file: string;
  image_file: string;
  path: string;
  imagepath: string;
}

export function newVideo(): Video {
  return {
    id: 0,
    title: '',
    description: '',
    created_at: '',
    categories: [],
    video_file: '',
    image_file: '',
    path: '',
    imagepath: ''
  };
}