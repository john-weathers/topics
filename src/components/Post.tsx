import { useState, FormEvent, Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faPen } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { PostProps, SetErrMsg } from '../types';
import RatingPanel from './RatingPanel';
import axios from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import PostForm from './PostForm';

// numbers corresponse to ranks, 1 being hottest, 10 being least hot
const hotnessStyling: { [rank: string]: [string, string] } = {
  '1': ['Hottest!', '#fa0202'],
  '2': ['Hot hot hot!', '#fa3802'],
  '3': ['Hot!', '#fa6a02'],
  '4': ['Hot!', '#fa6a02'],
  '5': ['Still warm.', '#fa9b02'],
  '6': ['Luke warm.', '#fabc02'],
  '7': ['Room temp.', '#fafa02'],
  '8': ['Cold.', '#02e5fa'],
  '9': ['Colder.', '#02b0fa'],
  '10': ['Coldest.', '#024dfa'],
}

type PostComponentProps = { 
  post: PostProps,
  setPost?: Dispatch<SetStateAction<PostProps>>, 
  windowWidth: number, 
  wrapped: boolean, 
  setErrMsg: SetErrMsg 
}

const Post = ({ post, setPost, windowWidth, wrapped, setErrMsg }: PostComponentProps) => {
  const [ratingVote, setRatingVote] = useState<'+' | '-' | ''>(post.rated);
  const [relVote, setRelVote] = useState<'+' | '-' | '' | undefined>(post.topic?.relStatus?.voted);
  const [postRating, setPostRating] = useState(post.rating);
  const [relRating, setRelRating] = useState(() => {
    if (post.topic?.relStatus) {
      return post.topic.relStatus.keep - post.topic.relStatus.replace;
    } else {
      return 0;
    }
  })
  const [postedAt, setPostedAt] = useState(() => {
    const date = post.created;
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
  const [ownsPost, setOwnsPost] = useState(auth?.username === post.user.username ? true : false);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [description, setDescription] = useState('');

  const handleEditPost = async (e: FormEvent) => {
    e.preventDefault();

    if (!description) {
      setErrMsg('Description required');
    }

    if (description.length > 1000) {
      setErrMsg('Description too long');
    }

    const URL = `/topics/${post.topic}/posts/${post.id}`;

    try {
      await axiosPrivate.patch(URL, {
        description,
      })
      if (setPost) {
        setPost((prev) => {
          return {
            ...prev,
            description,
            edited: true,
          }
        });
      }
      setToggleEdit(false);
      setDescription('');
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
    e.stopPropagation();
    if (!auth?.accessToken) {
      setErrMsg(['auth required', 'You must be logged in to vote']);
      return;
    }

    const raV = e.currentTarget?.ratingvote?.value;
    const reV = e.currentTarget?.relvote?.value;
    if (raV) {
      const prevRatingVote = ratingVote;
      const prevPostRating = postRating;
      setRatingVote(prev => prev === raV ? '' : raV);
      setPostRating(prev => {
        if (prevRatingVote === '' && (raV === '+' || raV === '-')) {
          return raV === '+' ? prev + 1 : prev - 1;
        } else if (prevRatingVote === '+' && raV === '+') {
          return prev - 1;
        } else if (prevRatingVote === '-' && raV === '-') {
          return prev + 1;
        } else if (prevRatingVote === '-' && raV === '+') {
          return prev + 2;
        } else {
          return prev - 2;
        }
      });
      const URL = `/topics/${post.topic.name}/posts/${post.id}/vote`;
      try {
        await axiosPrivate.patch(URL, {
          vote: raV,
        });
      } catch (err) {
        setRatingVote(prevRatingVote);
        setPostRating(prevPostRating);
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
      
    } else if (reV) {
      const prevRelVote = relVote;
      const prevRelRating = relRating;
      setRelVote(prev => prev === reV ? '' : reV);
      setRelRating(prev => {
        if (prevRelVote === '' && (reV === '+' || reV === '-')) {
          return reV === '+' ? prev + 1 : prev - 1;
        } else if (prevRelVote === '+' && reV === '+') {
          return prev - 1;
        } else if (prevRelVote === '-' && reV === '-') {
          return prev + 1;
        } else if (prevRelVote === '-' && reV === '+') {
          return prev + 2;
        } else {
          return prev - 2;
        }
      });
      const URL = `/topics/${post.topic.name}/relegation/vote`
      try {
        await axiosPrivate.patch(URL, {
          vote: reV,
        });
      } catch (err) {
        setRelVote(prevRelVote);
        setRelRating(prevRelRating);
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
    <div 
      className={wrapped && !ownsPost 
        ? 'wrapped-post' 
        : wrapped && ownsPost
        ? 'wrapped-post owner'
        : 'expanded-post'}
    >
      {(windowWidth > 768 && wrapped) && (
        <RatingPanel rating={postRating} handleVote={handleVote} voteStatus={ratingVote} voteType='ratingvote'/>
      )}
      <div className='main-panel'>
        <div className='post-header'>
          <Link to={`/topics/${post.topic.name}`} onClick={(e) => e.stopPropagation()}>{post.topic.name}</Link>
          <div className='status-panel'>
            {!post.topic?.relStatus ? (
              <>
                <span>{hotnessStyling[post.topic.ranking][0]}</span>
                <span style={{ backgroundColor: hotnessStyling[post.topic.ranking][1] }}></span>
              </>
            ) : (
              <>
                <span>Topic in relegation danger!</span>
                <RatingPanel rating={relRating} handleVote={handleVote} voteStatus={relVote ? relVote : ''} voteType='relvote'/>
              </>
            )}
          </div>
        </div>
        <div className='post-details'>
          <span>{post.title}</span>
          <div>
            <span>Posted by {post.user.username}|{post.user.rating}</span>
            {ownsPost && <FontAwesomeIcon icon={faCheck} size='xl'/>}
          </div>
          <span>{postedAt}</span>
          {(ownsPost && !toggleEdit)} && (
            <button type='button' onClick={() => setToggleEdit(true)}>
              <FontAwesomeIcon icon={faPen} size='xl'/>
              <span>edit</span>
            </button>
          )
        </div>
        {!toggleEdit ? (
          <div className='post-body'>
            {wrapped && post.description.length > 300 ? (
              <p>{post.description.slice(0, 300).trim() + '...'}</p>
            ) : (
              <p>{post.description}</p>
            )}
            {post.edited && (
            <span><i>edited</i></span>
            )}
          </div>
        ) : (
          <div className='edit'>
            <PostForm 
              title={post.title} 
              prevDescription={post.description} 
              description={description}
              setDescription={setDescription}
              setAddPost={setToggleEdit}
              setErrMsg={setErrMsg}
              handleSubmit={handleEditPost}
            />
          </div>
        )}    
        
        <div className='post-footer'>
          <div>
            {(!wrapped || windowWidth <= 768) && (
              <RatingPanel rating={postRating} handleVote={handleVote} voteStatus={ratingVote} voteType='ratingvote'/>
            )}
          </div>
          <div className='comment-info'>
            <FontAwesomeIcon icon={faComment} size='xl'/>
            <span>{post.comments.length} comments</span>
          </div>
        </div>
      </div>
    </div> 
  )
}
export default Post;