import { useNavigate } from 'react-router-dom';
import { PostProps, SetErrMsg } from '../types';
import Post from './Post';


const PostWrapper = ({ post, windowWidth, setErrMsg }: { post: PostProps, windowWidth: number, setErrMsg: SetErrMsg }) => {
  const navigate = useNavigate();

  return (
    <li key={post.id} onClick={() => navigate(`/t/${post.topic.name}/comments/${post.id}`, { state: post })}>
      <Post post={post} windowWidth={windowWidth} wrapped={true} setErrMsg={setErrMsg}/>
    </li>
  )
}
export default PostWrapper