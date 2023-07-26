import { Dispatch, SetStateAction } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { PostProps } from '../types';
import Post from '../components/Post';

// TODO: create view wrapper where instead of receiving post details via props, they are come from state (check to make sure post matches) and useEffect fetch
// for main view when clicked on, need to edit Post and PostWrapper accordingly
const PostView = () => {
  const { state }: { state: PostProps } = useLocation();
  const { windowWidth, setErrMsg }: { windowWidth: number, setErrMsg: Dispatch<SetStateAction<string>> } = useOutletContext();

  return (
    <Post post={state} windowWidth={windowWidth} wrapped={false} setErrMsg={setErrMsg}/>
  )
}
export default PostView