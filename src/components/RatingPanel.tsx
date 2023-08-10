import { FormEvent } from 'react'

type RatingPanelProps = { 
  rating: number,
  topic?: string, 
  handleVote: (e: FormEvent<HTMLFormElement>) => Promise<void>, // update with return type
  voteStatus: '+' | '-' | '', 
  voteType: string,
}

const RatingPanel = ({ rating, handleVote, voteStatus, voteType, topic }: RatingPanelProps) => {
  return (
    <div className={voteType === 'ratingvote' ? 'rating-panel' : 'rel-vote-panel'}>
      <form onSubmit={handleVote}>
        <button name={voteType} value={voteType === 'relvoteoverview' ? `+,${topic}` : '+'} style={{ backgroundColor: voteStatus === '+' ? 'red' : 'white' }}>+</button>
      </form>
      {rating}
      <form onSubmit={handleVote}>
        <button name={voteType} value={voteType === 'relvoteoverview' ? `-,${topic}` : '-'} style={{ backgroundColor: voteStatus === '-' ? 'blue' : 'white' }}>-</button>
      </form>
    </div>
  )
}
export default RatingPanel