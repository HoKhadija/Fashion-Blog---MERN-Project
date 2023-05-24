import PostItem from "./PostItem";
import "./post.css"

const PostList = ({ posts }) => {
    return ( 
        <div className="post-list">
            {posts.map(item => <PostItem post={item} key={item._id} />)}
        </div>
    );
}

export default PostList;