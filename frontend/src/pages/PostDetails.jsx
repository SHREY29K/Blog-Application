import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { URL, IF } from "../url";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

function PostDetails() {
  const PostID = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get("/api/posts/post/" + PostID, {
          withCredentials: true,
        });
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [PostID]);

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete("/api/posts" + PostID, {
        withCredentials: true,
      });
      console.log(res.data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchPostComments = async () => {
      setLoader(true);
      try {
        const res = await axios.get(URL + "/api/comments/post/" + PostID, {
          withCredentials: true,
        });
        console.log('Fetched Comments:', res.data); // Log fetched comments
        setComments(res.data);
        setLoader(false);
      } catch (err) {
        setLoader(false);
        console.log(err);
      }
    };
  
    fetchPostComments();
  }, [PostID]);
  
  

  const postComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        URL + "/api/comments/create/",
        {
          comment: comment,
          author: user.username,
          postId: PostID,
          userId: user._id,
        },
        { withCredentials: true, }
      );
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      {loader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className='px-8 md:px-[200px] mt-8'>
        <div className='border p-3 shadow'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold text-black md:text-3xl'>
              {post.title}
            </h1>
            {user?._id === post?.userId && (
              <div className='flex items-center justify-center space-x-2'>
                <p className='cursor-pointer' onClick={() => navigate("/edit/" + PostID)}>
                  <BiEdit style={{ fontSize: "24px", color: "black" }} />
                </p>
                <p className='cursor-pointer' onClick={handleDeletePost}>
                  <MdDelete style={{ fontSize: "24px", color: "black" }} />
                </p>
              </div>
            )}
          </div>
          <div className='w-[100%] flex flex-col justify-center'>
            <img
              src={IF + post.photo}
              className='object-cover h-[45vh] mx-auto mt-8'
              alt=" "
            />
            <p className='mx-auto mt-8 w-[80vh] border p-5 shadow-xl'>
              {post.desc}
            </p>
      
            <div className='flex justify-center items-center mt-8 space-x-4 font-semibold'>
              <p>Categories: </p>
              <div className='flex justify-center items-center space-x-2'>
                {post.categories?.map((c, i) => (
                  <div key={i} className='bg-gray-300 rounded-xl px-3 py-1'>
                    {c}
                  </div>
                ))}
              </div>
            </div>
      
            <div className='mt-4'>
              <h3 className='text-xl font-semibold'>Comments:</h3>
              <div className='mt-4'>
                {comments?.map((c) => (
                  <Comment key={c._id} c={c} />
                ))}
              </div>
              <div className='border flex flex-col md:flex-row mt-4'>
                <input
                  onChange={(e) => setComment(e.target.value)}
                  type="text"
                  placeholder="Write your Comment"
                  className='w-full md:w-[80%] outline-none py-2 px-4'
                />
                <button
                  onClick={postComment}
                  className='bg-black text-sm text-white font-semibold px-2 py-2 w-full md:w-[20%]'
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      )}
      <Footer />
    </div>
  );
}

export default PostDetails;
