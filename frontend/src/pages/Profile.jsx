import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { URL } from '../url';
import { useNavigate, useParams } from 'react-router-dom';

function Profile() {
  const param = useParams().id;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(`${URL}/api/users/${user._id}`, { withCredentials: true });
          setUsername(res.data.username || "");
          setEmail(res.data.email || "");
          setPassword(res.data.password || "");
        } catch (err) {
          console.log(err);
        }
      };

      fetchProfile();
    }
  }, [param, user]);

  const handleUserUpdated = async () => {
    setUpdated(false);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        throw new Error('Failed to update user');
      }

      const data = await res.json();
      console.log(data);
      setUpdated(true);
    } catch (err) {
      console.log(err);
      setUpdated(false);
    }
  };

  const handleUserDelete = async () => {
    try {
      const res = await axios.delete(`/api/users/${user._id}`, { withCredentials: true });
      setUser(null);
      navigate("/");
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center min-h-screen'>
        <div className='border p-3 text-center flex justify-center w-full md:w-1/2 lg:w-1/3 shadow-2xl shadow-gray-500'>
          <div className='flex flex-col space-y-4 justify-center text-center'>
            <h1 className='text-xl font-bold mb-4'>
              PROFILE
            </h1>

            <input
              type='text'
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              className='outline-none py-2 text-gray-500'
              placeholder='Your Username'
            />

            <input
              type='email'
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              className='outline-none py-2 text-gray-500'
              placeholder='Your Email'
            />

            <input
              type='password'
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
              className='outline-none py-2 text-gray-500'
              placeholder='Your Password'
            />
            <div className='flex items-center space-x-6 mt-8'>
              <button
                className='text-white font-semibold bg-black px-4 py-2 hover:text-black hover:bg-gray-400'
                onClick={handleUserUpdated}
              >
                UPDATE
              </button>

              <button
                className='text-white font-semibold bg-black px-4 py-2 hover:text-black hover:bg-gray-400'
                onClick={handleUserDelete}
              >
                DELETE
              </button>
            </div>
            {updated && (
              <h3 className='text-green-500 text-sm text-center mt-4'>
                Updated Successfully!
              </h3>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
