import React, {useState, useContext, useEffect} from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import {ImCross} from 'react-icons/im'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function EditPost() {

  const postId = useParams().id;
  const {user} = useContext(UserContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [file, setFile] = useState("")
  const [cat, setCat] = useState("a")
  const [cats, setCats] = useState([])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/post/${postId}`);
        setTitle(res.data.title);
        setDesc(res.data.desc);
        setFile(res.data.photo);
        setCats(res.data.categories);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [postId]);

  const handleUpdate = async(e) => {
    e.preventDefault();
    const post ={
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats
    }
    if(file){
      const data = new FormData()
      const filename = Date.now() + file.name
      data.append("img",filename)
      data.append("file", file)
      post.photo = filename
  
      try{
        const imgUpload = await axios.post("/api/upload", data)
      }catch(err){
        console.log(err)
      }
    }
    try{
      const res = await axios.put(`/api/posts/post/${postId}`, post, {withCredentials: true})
      console.log(res.data);
      navigate(`/posts/post/${res.data._id}`);
    }catch(err){
      console.log(err)
    }
  }

  const addCategory= () => {
    let updatedCats = [...cats]
    updatedCats.push(cat)
    setCat("")
    setCats(updatedCats)
  }
  
  const deleteCategory = (i) => {
    let updatedCats = [...cats]
    updatedCats.splice(i,1)
    setCats(updatedCats)
  }

  return (
    <div>
      <Navbar/>
      <div className='flex justify-center'>
        <div className='p-4 border w-[70%] flex flex-col justify-center px-6 md:px-[200px] mt-8'>
          <h1 className='font-bold flex justify-center md:text-2xl text-xl'>
            Update Your Post </h1>
            <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
              <input type='text' onChange={(e)=> setTitle(e.target.value)} value={title} placeholder='Enter Post Title' className='px-4 py-2 outline-none'></input>
              <input type='file' className='px-4' onChange={(e) => setFile(e.target.files[0])}></input>
              <div className='flex flex-col'>
                <div className='flex items-center space-x-4 md:space-x-8'>
                  <input type='text' value={cat} onChange={(e) => setCat(e.target.value)} placeholder='Enter Post Category' className='px-4 py-2 outline-none'></input>
                  <div onClick={addCategory} className='bg-black text-white px-4 py-3 font-semibold cursor-pointer'>
                  ADD
                  </div>
                </div>
                <div className='flex px-4 mt-3'>
                  {
                    cats?.map((c,i) => (
                      <div key={i} className='flex justify-center items-center space-x-2 mr-4 bg-gray-300 px-2 py-1 rounded-md'>
                        <p>{c}</p>
                        <p onClick={() => deleteCategory(i)} className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'><ImCross/></p>
                      </div>
                    ))
                  }
                </div>
              </div>
            <textarea onChange={(e) => setDesc(e.target.value)} value={desc} rows={9} cols={30} className='px-4 py-2 outline-none font-semibold' placeholder='Enter Post Description'>

            </textarea>
            <button onClick={handleUpdate} className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg'>Update</button>
            </form>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default EditPost
