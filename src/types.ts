import { Dispatch, SetStateAction } from 'react'

export type RelStatus = {
  id: string,
  voted: '+' | '-' | '',
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

export type CommentProps = {
  id: string,
  ref?: boolean,
  text: string,
  edited: boolean,
  rating: number,
  rated: '+' | '-' | '',
  created: Date,
  user: User,
}

export type PostProps = {
  id: string,
  version: number,
  topic: TopicProps,
  title: string,
  description: string,
  edited: boolean,
  rated: '+' | '-' | '',
  rating: number,
  created: Date,
  user: User,
  comments: CommentProps[] | [],
}

export type Home = {
  topics: TopicProps[],
  feed: PostProps[] | [],
}

export type SetErrMsg = Dispatch<SetStateAction<string | string[]>>;