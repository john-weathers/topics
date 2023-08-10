import { FormEvent, useState, useEffect, useRef } from 'react';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PostProps, SetErrMsg, CommentProps } from '../types';
import Post from '../components/Post';
import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import axiosInstance from '../api/axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const PostView = () => {
  // user will most likely navigate here through a feed
  // we already have post state if user has navigated here through feed/wrapper, so make use of that
  // rather than using a loader for everything
  const location = useLocation();
  const [post, setPost] = useState(location?.state);
  const [isLoading, setIsLoading] = useState(!post ? true : false);
  const { windowWidth, setErrMsg }: { windowWidth: number, setErrMsg: SetErrMsg } = useOutletContext();
  const params = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [addComment, setAddComment] = useState(false);
  const [commentText, setCommentText] = useState('');
  const commentRef = useRef<HTMLLIElement>(null);

  // load post data anyway (needed in case of direct URL navigation as well)
  // update post with fetched data
  useEffect(() => {
    const URL = `/topics/${params.topicName}/posts/${params.postId}`;

    const fetchPost = async () => {
      const { data } = await axiosInstance.get<PostProps>(URL);
      setPost((prev: PostProps | undefined) => {
        if (prev) {
          return {
            ...prev,
            ...data,
          }
        } else {
          return data;
        }
      })
      setIsLoading(false);
    }

    fetchPost().catch((error) => {
      setErrMsg(error.message);
    })
  }, []);

  useEffect(() => {
    if (post?.version && post.version !== 1) {
      if (commentRef?.current) {
        commentRef.current.scrollIntoView(false);
      }
    }
  }, [post?.version])

  const handleNewComment = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!commentText) {
      setErrMsg('Text required to edit comment');
      return;
    }

    if (commentText.length > 1000) {
      setErrMsg('Comment too long');
      return;
    }

    const URL = `/topics/${post.topicName}/posts/${post.id}/comments`
    try {
      const { data } = await axiosPrivate.post<CommentProps>(URL, {
        text: commentText
      })
      data.ref = true;
      setAddComment(false);
      setPost((prev: PostProps) => {
        return {
          ...prev,
          version: prev.version + 1,
          comments: [...prev.comments.map((prevComment) => {
            prevComment.ref = false;
            return prevComment;
          }), data]
        }
      })
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

  if (isLoading) return (
    <div className='loading'>
      <FontAwesomeIcon icon={faSpinner} spin size='3x'/>
    </div>
  )

  return (
    <div className='expanded-post-wrapper'>
      <Post post={post} setPost={setPost} windowWidth={windowWidth} wrapped={false} setErrMsg={setErrMsg}/>
      <div className='comments'>
        <button type='button' onClick={() => {
          if (!auth?.accessToken) {
            setErrMsg(['auth required', 'You must be logged in to comment']);
            return;
          }
          setAddComment(true);
        }}>+ Add Comment</button>
        {addComment && (
          <CommentForm 
            commentText={commentText}
            setCommentText={setCommentText}
            setAddComment={setAddComment}
            setErrMsg={setErrMsg}
            handleSubmit={handleNewComment}
          />
        )}
        {post.comments.length ? (
        <ul>
          {post.comments.map((comment: CommentProps) => {
            if (comment?.ref) {
              return (
                <li key={comment.id} ref={commentRef}>
                  <Comment postId={post.id} topicName={post.topic.name} setPost={setPost} comment={comment} setErrMsg={setErrMsg} />
                </li>
              )
            } else {
              return (
                <li key={comment.id}>
                  <Comment postId={post.id} topicName={post.topic.name} setPost={setPost} comment={comment} setErrMsg={setErrMsg} />
                </li>
              )
            }
          })}
        </ul>
      ) : (
        <p>No comments! Be the first to add one!</p>
      )}
      </div>
      
    </div>
  )
}
export default PostView