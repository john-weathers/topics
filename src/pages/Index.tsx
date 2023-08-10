import { useOutletContext } from 'react-router-dom';
import { PostProps, SetErrMsg } from '../types';
import useAuth from '../hooks/useAuth';
import Account from '../components/Account';
import PostWrapper from '../components/PostWrapper';

const Index = () => {
  const { auth } = useAuth();
  const { feed, windowWidth, setErrMsg }: { feed: PostProps[], windowWidth: number, setErrMsg: SetErrMsg }  = useOutletContext();

  return (
    <div className='feed home'>
      {!auth?.accessToken && (
        <Account popup={false} setErrMsg={setErrMsg} />
      )}
      <>
        {feed.length ? (
          <ul className='posts'>
            {feed.map((post) => <PostWrapper post={post} windowWidth={windowWidth} setErrMsg={setErrMsg} />)}
          </ul>
        ) : (
          <div>
            <h1>No posts! 😟</h1>
            <p>You can fix this: check out a topic and get to posting!</p>
          </div>
        )}
      </>
    </div>
  )
}
export default Index