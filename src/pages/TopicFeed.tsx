import { useOutletContext, useLoaderData, Params } from 'react-router-dom';
import { PostProps, SetErrMsg } from '../types';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import Account from '../components/Account';
import PostWrapper from '../components/PostWrapper';

export const loader = async ({ params }: { params: Params }) => {
  if (!params?.topicName) {
    return;
  } else {
    const response = await axios.get(`/topics/${params.topicName}`);
    return response.data;
  }
}

const TopicFeed = () => {
  const posts = useLoaderData() as PostProps[] | [];
  const { auth, setAuth } = useAuth();
  const { windowWidth, setErrMsg }: { windowWidth: number, setErrMsg: SetErrMsg }  = useOutletContext();

  return (
    <div className='feed topics'>
      {!auth?.accessToken && (
        <Account popup={false} setErrMsg={setErrMsg} />
      )}
      <>
        {posts.length ? (
          <ul className='posts'>
            {posts.map((post) => <PostWrapper post={post} windowWidth={windowWidth} setErrMsg={setErrMsg} />)}
          </ul>
        ) : (
          <div>
            <h1>No posts! 😟</h1>
            <p>You can fix this: get to posting!</p>
          </div>
        )}
      </>
    </div>
  )
}
export default TopicFeed