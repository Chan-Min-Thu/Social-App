import { type LoaderFunction } from "react-router";
import api from "../../api/index";

export const postLoader: LoaderFunction = async () => {
  try {
    const response = await api.get(
      "/posts/cursor-pagination?take=7&skip=1&lastCursor=2bdd1456-786c-4858-b82d-98176c0c1380"
    );
    return { posts: response.data.posts };
  } catch (error) {
    console.log(error);
  }
};
