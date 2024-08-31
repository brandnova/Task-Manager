/* eslint-disable no-undef */
// /* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';


function PostsList({ posts, isLoading, searchTerm }) {

  const [theme, setTheme] = useState('neon');
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const themeStyles = {
    neon: 'text-neon-blue',
    purple: 'text-purple-600',
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-8 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300">
          {filteredPosts.map((post, index) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105">
              
              <div className="p-6">
                <div className='flex justify-between'>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-500">
                      Task: <span className=" text-xl">{post.title}</span> 
                    </h2>
                    <h2 className="text-2xl font-bold mb-2 text-gray-500">
                      Due: <span className=" text-xl">({post.created_at})</span>
                    </h2>
                  </div>
                  <div>
                    <label> Done:</label>
                      <input
                        id="check '{post.id}'"
                        className="text-xl m-3"
                        type="checkbox"
                        onChange={(e) => setNewStatus(e.target.value)}
                      />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex flex-row justify-between">
                  <div>
                  <button onClick={() => deleteTask(post.id)} className="inline-block mx-2 bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition duration-300"><FaTrash className='' /></button>

                  <button
                    className="inline-block mx-2 bg-yellow-300 text-white p-3 rounded-xl hover:bg-yellow-500 transition duration-300"
                    onClick={() => toggleEditForm(index)}>
                    <FaPen className='' />
                  </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {post.release_date}
                  </span>
                </div>

                {/* Conditionally render the edit form based on the state */}
                {editFormVisible[index] && (
                  <div className="flex flex-col bg-white rounded-lg shadow-md p-3 mt-4">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Task</h3>
                    <input
                      id="edit1"
                      className="mx-2 h-8 p-3 mb-5 rounded-lg border border-gray-500"
                      type="text"
                      placeholder="Task..."
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <input
                      id="edit2"
                      className="mx-2 h-8 p-3 mb-5 rounded-lg border border-gray-500"
                      type="text"
                      placeholder="Description..."
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <input
                      id="edit3"
                      className="mx-2 h-8 p-3 mb-5 rounded-lg border border-gray-500"
                      type="text"
                      placeholder="Due Date..."
                      onChange={(e) => setNewCreatedat(e.target.value)}
                    />
                    <button 
                      onClick={() => updateTask(post.id)}
                      type="submit"
                      className="rounded-md outline outline-gray-300 hover:outline-gray-500"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export default PostsList;
