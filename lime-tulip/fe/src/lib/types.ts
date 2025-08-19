export interface User {
    id : number
    username : string
    email : string
}

export interface Post {
    id : number
    title : string
    authorId : number
}

export interface Comment {
    id : number
    postId : number
    userId : number
    text : string
    date : string
    likes : number
    replies : number
    isEdited : boolean
    mentions : string
    hashtags : string
}