import { FormEvent, useState, useEffect } from 'react';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PostProps, SetErrMsg, CommentProps } from '../types';
import Post from '../components/Post';
import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';
import axios from '../api/axios';

const PostView = () => {
  // user will most likely navigate here through a feed
  // we already have post state if user has navigated here through feed/wrapper, so make use of that
  // rather than using a loader for everything
  const location = useLocation();
  const [post, setPost] = useState(location?.state);
  const [isLoading, setIsLoading] = useState(!post ? true : false);
  const { windowWidth, setErrMsg }: { windowWidth: number, setErrMsg: SetErrMsg } = useOutletContext();
  const params = useParams();
  const [addComment, setAddComment] = useState(false);
  const [commentText, setCommentText] = useState('');

  // load post data anyway (needed in case of direct URL navigation as well)
  // update post with fetched data
  useEffect(() => {
    const URL = `/topics/${params.topicName}/comments/${params.postId}`;

    const fetchPost = async () => {
      const { data } = await axios.get<PostProps>(URL);
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
  }, [])

  const handleNewComment = async (e: FormEvent) => {
    e.preventDefault();

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
        <button type='button' onClick={() => setAddComment(true)}>+ Add Comment</button>
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
          {post.comments.map((comment: CommentProps) => (
            <li key={comment.id}>
              <Comment postId={post.id} setPost={setPost} comment={comment} setErrMsg={setErrMsg} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments! Be the first to add one!</p>
      )}
      </div>
      
    </div>
  )
}
export default PostView