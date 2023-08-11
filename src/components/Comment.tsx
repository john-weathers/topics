import { useState, FormEvent, Dispatch, SetStateAction } from 'react';
import { CommentProps, PostProps, SetErrMsg } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import CommentForm from './CommentForm';
import RatingPanel from './RatingPanel';
import useAuth from '../hooks/useAuth';

type CommentComponentProps = { 
  postId: string,
  topicName: string,
  setPost: Dispatch<SetStateAction<PostProps>>, 
  comment: CommentProps, 
  setErrMsg: SetErrMsg,
}

const Comment = ({ postId, topicName, setPost, comment, setErrMsg }: CommentComponentProps) => {
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
  const [rating, setRating] = useState(comment.rating);

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!editText) {
      setErrMsg('Text required to edit comment');
      return;
    }

    if (editText.length > 1000) {
      setErrMsg('Comment too long');
      return;
    }

    const URL = `/topics/${topicName}/posts/${postId}/comments/${comment.id}`
    // only one post so update below to include update of entire post?
    // if so, include functionality to scroll to that specific comment if practicable given time constraints
    try {
      // rather than return the entire post, going to replace old comment with fresh one
      const { data } = await axiosPrivate.patch<CommentProps>(URL, {
        text: editText,
      })
      data.ref = true;
      // FUTURE TODO: integrate caching library and more complex state management
      setPost((prev) => {
        return {
          ...prev,
          comments: prev.comments.map((prevComment) => {
            if (prevComment.id !== comment.id) {
              prevComment.ref = false;
              return prevComment;
            } else {
              return data;
            }
          })
        }
      });
      setToggleEdit(false);
      setEditText('');
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

  const handleVote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth?.accessToken) {
      setErrMsg(['auth required', 'You must be logged in to vote']);
      return;
    }

    const vote = e.currentTarget?.ratingvote?.value;
    if (vote) {
      const prevVote = ratingVote;
      const prevRating = rating;
      setRatingVote(prev => prev === vote ? '' : vote);
      setRating(prev => {
        if (prevVote === '' && (vote === '+' || vote === '-')) {
          return vote === '+' ? prev + 1 : prev - 1;
        } else if (prevVote === '+' && vote === '+') {
          return prev - 1;
        } else if (prevVote === '-' && vote === '-') {
          return prev + 1;
        } else if (prevVote === '-' && vote === '+') {
          return prev + 2;
        } else {
          return prev - 2;
        }
      });
      const URL = `/topics/${topicName}/posts/${postId}/comments/${comment.id}/vote`;
      try {
        await axiosPrivate.patch(URL, {
          vote,
        });
      } catch (err) {
        setRatingVote(prevVote);
        setRating(prevRating);
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
          <RatingPanel rating={rating} handleVote={handleVote} voteStatus={ratingVote} voteType='ratingvote'/>
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