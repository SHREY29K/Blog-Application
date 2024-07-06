import React, {useState, useContext} from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { ImCross } from 'react-icons/im'
import {UserContext} from '../context/UserContext'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


function CreatePost() {
const [title, setTitle] = useState("")
const [desc, setDesc] = useState("")
const [file, setFile] = useState("")  
const {user} = useContext(UserContext)
const [cat, setCat] = useState("a")
const [cats, setCats] = useState([])

const navigate = useNavigate()

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

const handleCreate = async (e) => {
  e.preventDefault()
  const post = {
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
    const res = await axios.post("/api/posts/post/create", post, {withCredentials: true})
    console.log(res.data);
    navigate("/posts/post/" + res.data._id)
  }catch(err){
    console.log(err)
  }
}

  return (
    <div>
      <Navbar/>
      <div className='flex justify-center'>
        <div className='px-6 m-4 border flex flex-col w-[70%] shadow-xl md:px-[200px] mt-8'>
          <h1 className='font-bold md:text-2xl text-2xl mt-3 flex justify-center'>
            Create a Post
          </h1>

          <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'> 
            <input onChange={(e) => setTitle(e.target.value)} type='text' placeholder='Enter Post Title' className='px-4 py-2 outline-none'></input>
            <input onChange={(e) => setFile(e.target.files[0])} type='file' className='px-4'>
            </input>
            <div className='flex flex-col'>
              <div className='flex items-center space-x-4 md:space-x-8'>
                <select name='' id="" value={cat} onChange={(e) => setCat(e.target.value)}>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Big Data">Big Data</option>
                  <option value="Block Chain">Block Chain</option>
                  <option value="Business Management">Business Management</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Databse">Database</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Operating System">Operating System</option>
                  <option value="Enterprise">Enterprises</option>
                </select>

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

            <textarea onChange={(e) => setDesc(e.target.value)} rows={9} cols={30} className='px-4 py-2 outline-none font-semibold' placeholder='Enter Post Description'>

            </textarea>
            <button onClick={handleCreate} className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg'> Create</button>

            </div>
          </form>

        </div>

      </div>
      <Footer/>
    </div>
  )
}

export default CreatePost
