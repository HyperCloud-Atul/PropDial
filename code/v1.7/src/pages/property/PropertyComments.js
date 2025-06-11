import { useState } from "react"
import { timestamp } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useFirestore } from "../../hooks/useFirestore"
import Avatar from "../../components/Avatar"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function PropertyComments({ property }) {
    const { user } = useAuthContext()
    const { updateDocument, response } = useFirestore("properties-propdial")
    const [newComment, setNewComment] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        const commentToAdd = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            content: newComment,
            createdAt: timestamp.fromDate(new Date()),
            id: Math.random()
        }

        await updateDocument(property.id, {
            comments: [...property.comments, commentToAdd],
        })
        if (!response.error) {
            setNewComment('')
        }
    }

    return (
        <div className="project-comments">
            <h4>Property Comments</h4>

            <ul>
                {property.comments.length > 0 && property.comments.map(comment => (
                    <li key={comment.id}>
                        <div className="comment-author">
                            <Avatar src={comment.photoURL} />
                            <p>{comment.displayName}</p>
                        </div>
                        <div className="comment-date">
                            <p>{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
                        </div>
                        <div className="comment-content">
                            <p>{comment.content}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <form className="add-comment" onSubmit={handleSubmit}>
                <label>
                    <span>Add new comment:</span>
                    <textarea
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                    ></textarea>
                </label>
                <button className="btn">Add Comment</button>
            </form>
        </div>
    )
}