import React from 'react'
import {IF} from '../url'




function HomePost({ post }) {
  return (
    <div className='h-[46vh] flex flex-col bg-white border-gray-200 shadow'>
      <div className='overflow-hidden h-[21vh]'>
        <img className='object-cover w-full h-full' src={IF + post.photo} alt='' />
      </div>
      <div className='pl-3 pt-2'>
        <h5 className='text-xl font-bold tracking-tight text-gray-900'>
          {post.title}
        </h5>
        <div className='text-xs font-semibold text-gray-500 flex items-center'>
          <p className='text-blue-400'>BY: {post.username}</p>
        </div>
        <div className='mt-2 font-normal text-gray-700'>
          <p> {post.desc.slice(0,45) + "...Read More"} </p>
        </div>
        <div className='flex flex-wrap pt-4 text-gray-400 text-xs'>
          <p> {new Date(post.updatedAt).toString().slice(3,15)} </p>
        </div>
      </div>
    </div>
  );
}

export default HomePost;
