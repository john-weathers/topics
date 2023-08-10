import { useEffect, Dispatch, SetStateAction, FormEvent } from 'react'
import { SetErrMsg } from '../types'

type PostFormProps = {
  title: string,
  setTitle?: Dispatch<SetStateAction<string>>,
  prevDescription?: string,
  description: string,
  setDescription: Dispatch<SetStateAction<string>>,
  setAddPost: Dispatch<SetStateAction<boolean>>,
  setErrMsg: SetErrMsg,
  handleSubmit: (e: FormEvent) => Promise<void>,
}

const PostForm = ({ title, setTitle, prevDescription = '', description, setDescription, setAddPost, setErrMsg, handleSubmit }: PostFormProps) => {
  useEffect(() => {
    if (title.length <= 140) {
      setErrMsg('');
    }
  }, [title])

  return (
    <form onSubmit={handleSubmit}>
      {setTitle ? (
        <>
          <label htmlFor='post-title' className='text-label'>Post Title</label>
          <input 
            id='post-title'
            type='text'
            value={title}
            onChange={(e) => {
              if (title.length > 140) {
                setErrMsg(`Post titles must be 140 characters or less. Trim ${title.length - 140} ${title.length - 140 === 1 ? 'character' : 'characters'}`);
              }
              setTitle(e.target.value);
            }}
            required
            className='text-field'
          />
        </>
      ) : (
        <h3>{title}</h3>
      )}
      <label htmlFor='post-text'>Post Description</label>
      <textarea
        id='post-text'
        value={description || prevDescription}
        onChange={(e) => {
          if (description.length > 1000) {
            setErrMsg(`Post descriptions must be 1000 characters or less. Trim ${description.length - 1000} ${description.length - 1000 === 1 ? 'character' : 'characters'}`);
          }
          setDescription(e.target.value);
        }}
        className='textarea-field'
      />
      <div>
        <button type='button' onClick={() => {
          setAddPost(false);
          setDescription('');
          if (setTitle) {
            setTitle('');
          }
        }}>Cancel</button>
        <button disabled={(setTitle && title.length > 140) || description.length > 1000 ? true : false}>Submit</button>
      </div>
    </form>
  )
}
export default PostForm