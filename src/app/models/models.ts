export interface LoginResponse {
  token: string;
  user_id: number;
  email: string;
  username: string;
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