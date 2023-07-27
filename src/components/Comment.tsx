import { useState, FormEvent, Dispatch, SetStateAction } from 'react';
import { CommentProps, PostProps, SetErrMsg } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen } from '@fortawesome/free-solid-svg-icons';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import CommentForm from './CommentForm';
import RatingPanel from './RatingPanel';
import useAuth from '../hooks/useAuth';

type CommentComponentProps = { 
  postId: string,
  setPost: Dispatch<SetStateAction<PostProps>>, 
  comment: CommentProps, 
  setErrMsg: SetErrMsg,
}

const Comment = ({ postId, setPost, comment, setErrMsg }: CommentComponentProps) => {
  const [ratingVote, setRatingVote] = useState<'+' | '-' | ''>(comment.rated);
  const [postedAt, setPostedAt] = useState(() => {
    const date = comment.created;
    const timeElapsed = Math.round((Date.now() - date.getTime()) / 1000);
    if (timeElapsed < 5) {
      return 'Just now'
    }
    else if (timeElapsed < 60) {
      return `${Math.round(timeElapsed)} seconds ago`
    } else if (timeElapsed < (60 * 60)) {
      const minutes = Math.round(timeElapsed / 60);
      return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
    } else if (timeElapsed < (60 * 60 * 24)) {
      const hours = Math.round(timeElapsed / (60 * 60));
      return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    } else {
      return `${date.toLocaleDateString()}`;
    }
  });
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [ownsComment, setOwnsComment] = useState(auth?.username === comment.user.username ? true : false);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editText, setEditText] = useState('');

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    
    // const response = axiosPrivate.patch()
  }

  const handleVote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth?.accessToken) {
      setErrMsg(['auth required', 'You must be logged in to vote']);
      return;
    }

    const vote = e.currentTarget?.ratingvote?.value;
    if (vote) {
      setRatingVote(prev => prev === vote ? '' : vote);
      // SERVER CALL (vote and vote type)
      // set post on success, filter appropriate values
    } else {
      setErrMsg('Invalid value provided');
      return;
    }
  }

  return (
    <div className={ownsComment ? 'comment owner' : 'comment'}>
      <div className='comment-header'>
        <div>
          <span>Posted by {comment.user.username}|{comment.user.rating}</span>
          {ownsComment && <FontAwesomeIcon icon={faCheck} size='xl'/>}
        </div>
        <span>{postedAt}</span>
      </div>
      <div className='comment-body'>
        {!toggleEdit ? (
          <>
            <p>{comment.text}</p>
            {comment.edited && (
              <span><i>edited</i></span>
            )}
          </>
        ) : (
            <CommentForm previousComment={comment.text} commentText={editText} setCommentText={setEditText} setAddComment={setToggleEdit} setErrMsg={setErrMsg} handleSubmit={handleEdit}/>
        )}
      </div>
      <div className='comment-footer'>
          <RatingPanel rating={comment.rating} handleVote={handleVote} voteStatus={ratingVote} voteType='ratingvote'/>
          {(ownsComment && !toggleEdit) && (
            <button type='button' onClick={() => setToggleEdit(true)}>
              <FontAwesomeIcon icon={faPen} size='xl'/>
              <span>edit</span>
            </button>
          )}
      </div>
      {/* not adding comment replies at the moment, but may add in a recursive Reddit style system in the future */}
    </div>
  )
}
export default Comment