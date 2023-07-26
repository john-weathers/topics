import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostProps } from '../types';
import Post from './Post';


const PostWrapper = ({ post, windowWidth, setErrMsg }: { post: PostProps, windowWidth: number, setErrMsg: Dispatch<SetStateAction<string>> }) => {
  const navigate = useNavigate();

  return (
    <div className='post-wrapper' onClick={() => navigate(`/t/${post.topic.name}/comments/${post.id}`, { state: post })}>
      <Post post={post} windowWidth={windowWidth} wrapped={true} setErrMsg={setErrMsg}/>
    </div>
  )
}
export default PostWrapper