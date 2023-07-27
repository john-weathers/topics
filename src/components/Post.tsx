import { useState, FormEvent, Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { PostProps, SetErrMsg } from '../types';
import RatingPanel from './RatingPanel';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

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
  const [ownsPost, setOwnsPost] = useState(auth?.username === post.user.username ? true : false)

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
      setRatingVote(prev => prev === raV ? '' : raV);
      // SERVER CALL (vote and vote type)
      
    } else if (reV) {
      setRelVote(prev => prev === reV ? '' : reV);
      // SERVER CALL (vote and vote type)

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
        <RatingPanel rating={post.rating} handleVote={handleVote} voteStatus={ratingVote} voteType='ratingvote'/>
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
                <span>{post.topic.relStatus.keep} keep / {post.topic.relStatus.replace} replace</span>
                <RatingPanel rating={post.topic.relStatus.keep - post.topic.relStatus.replace} handleVote={handleVote} voteStatus={relVote ? relVote : ''} voteType='relvote'/>
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
        </div>
        <div className='post-body'>
          {post.description.length > 300 ? (
            <p>{post.description.slice(0, 300).trim() + '...'}</p>
          ) : (
            <p>{post.description}</p>
          )}
          {post.edited && (
          <span><i>edited</i></span>
          )}
        </div>
        <div className='post-footer'>
          <div>
            {(!wrapped || windowWidth <= 768) && (
              <RatingPanel rating={post.rating} handleVote={handleVote} voteStatus={ratingVote} voteType='ratingvote'/>
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