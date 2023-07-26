import { FormEvent } from 'react'

type RatingPanelProps = { 
  rating: number, 
  handleVote: (e: FormEvent<HTMLFormElement>) => Promise<void>, 
  voteStatus: string | undefined, 
  voteType: string,
}

const RatingPanel = ({ rating, handleVote, voteStatus, voteType }: RatingPanelProps) => {
  return (
    <div className={voteType === 'ratinvote' ? 'rating-panel' : 'rel-vote-panel'}>
      <form onSubmit={handleVote}>
        <button name={voteType} value='+' style={{ backgroundColor: voteStatus === '+' ? 'red' : 'white' }}>+</button>
      </form>
      {rating}
      <form onSubmit={handleVote}>
        <button name={voteType} value='-' style={{ backgroundColor: voteStatus === '-' ? 'blue' : 'white' }}>-</button>
      </form>
    </div>
  )
}
export default RatingPanel