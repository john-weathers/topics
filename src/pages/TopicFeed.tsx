import { FormEvent, useState } from 'react';
import { useOutletContext, useLoaderData, useParams, Params, useNavigate } from 'react-router-dom';
import { PostProps, SetErrMsg } from '../types';
import axios from 'axios';
import axiosInstance from '../api/axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import Account from '../components/Account';
import PostWrapper from '../components/PostWrapper';
import PostForm from '../components/PostForm';

export const loader = async ({ params }: { params: Params }) => {
    const response = await axiosInstance.get(`/topics/${params.topicName}`);
    return response.data;
}

type RouteParams = {
  topicName: string,
}

const TopicFeed = () => {
  const postData = useLoaderData() as PostProps[] | [];
  const { topicName } = useParams() as RouteParams;
  const { auth } = useAuth();
  const { windowWidth, setErrMsg }: { windowWidth: number, setErrMsg: SetErrMsg }  = useOutletContext();
  const axiosPrivate = useAxiosPrivate();
  const [posts, setPosts] = useState(postData.length ? postData : []);
  const [addPost, setAddPost] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleNewPost = async (e: FormEvent) => {
    e.preventDefault();

    if (!title) {
      setErrMsg('Title required');
      return;
    }

    if (title.length > 140) {
      setErrMsg('Title too long');
      return;
    }

    if (!description) {
      setErrMsg('Description required');
      return;
    }

    if (description.length > 1000) {
      setErrMsg('Description too long');
      return;
    }

    const URL = `/topics/${topicName}/posts/create`;
    try {
      const { data } = await axiosPrivate.post<PostProps>(URL, {
        title,
        description,
      })
      // data.ref = true;
      // setPosts((prev: PostProps[] | []) => [data, ...prev]);
      navigate(`/t/${data.topic.name}/comments/${data.id}`, { state: data });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setErrMsg('Username Taken');
        } else if (err.response?.status === 400) {
          setErrMsg('Complete all fields as instructed');
        } else {
          setErrMsg('Registration Failed');
        }
      } else {
        setErrMsg('No Server Response');
      }
    }

  }

  return (
    <div className='feed topics'>
      {!auth?.accessToken && (
        <Account popup={false} setErrMsg={setErrMsg} />
      )}
      <h1>{topicName[0].toUpperCase() + topicName.slice(1).toLowerCase()}</h1>
      {!addPost ? (
        <div className='view'>
          <button type='button' onClick={() => {
            if (!auth?.accessToken) {
              setErrMsg(['auth required', 'You must be logged in to post']);
              return;
            }
            setAddPost(true);
          }}>+ Post</button>
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
        </div>
      ) : (
        <div className='add'>
          <h2>Add New Post</h2>
          <PostForm 
            title={title} 
            setTitle={setTitle} 
            description={description} 
            setDescription={setDescription} 
            setAddPost={setAddPost}
            setErrMsg={setErrMsg}
            handleSubmit={handleNewPost} 
          />
        </div>
      )}
      
    </div>
  )
}
export default TopicFeed