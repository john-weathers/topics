export type RelStatus = {
  id: string,
  voted: string,
  keep: number,
  replace: number,
  competitor: string,
}

export type TopicProps = {
  name: string,
  id: string,
  ranking: number,
  relStatus?: RelStatus,
}

export type User = {
  username: string,
  rating: number,
}

export type Comment = {
  comment: string,
  rating: number,
  rated: string,
  created: Date,
  commenter: User,
}

export type PostProps = {
  id: string,
  topic: TopicProps,
  title: string,
  description: string,
  rated: string,
  rating: number,
  created: Date,
  user: User,
  comments: Comment[],
}

export type Home = {
  topics: TopicProps[],
  feed: PostProps[],
}