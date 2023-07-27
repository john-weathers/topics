import { useEffect, Dispatch, SetStateAction, FormEvent } from 'react'
import { SetErrMsg } from '../types'

type CommentFormProps = {
  previousComment?: string,
  commentText: string,
  setCommentText: Dispatch<SetStateAction<string>>,
  setAddComment: Dispatch<SetStateAction<boolean>>,
  setErrMsg: SetErrMsg,
  handleSubmit: (e: FormEvent) => Promise<void>,
}

const CommentForm = ({ previousComment = '', commentText, setCommentText, setAddComment, setErrMsg, handleSubmit }: CommentFormProps) => {
  useEffect(() => {
    if (commentText.length <= 1000) {
      setErrMsg('');
    }
  }, [commentText])

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        id='comment-text'
        value={commentText || previousComment}
        onChange={(e) => {
          if (commentText.length > 1000) {
            setErrMsg(`Comments must be 1000 characters or less. Trim ${commentText.length - 1000} characters`)
          }
          setCommentText(e.target.value);
        }}
      />
      <div>
        <button type='button' onClick={() => setAddComment(false)}>Cancel</button>
        <button>Submit</button>
      </div>
    </form>
  )
}
export default CommentForm