import { useState, useEffect } from 'react';
import { FaSearch, FaGithub, FaTwitter, FaPen, FaTrash, FaCode, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import "./index.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdat, setCreatedAt] = useState("0");
  const [status, setStatus] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCreatedat, setNewCreatedat] = useState("0");
  const [newStatus, setNewStatus] = useState(false);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setProjects(storedProjects);
    if (storedProjects.length > 0) {
      setSelectedProject(storedProjects[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    if (newProjectName.trim() !== "") {
      const newProject = {
        id: Date.now(),
        name: newProjectName,
        tasks: []
      };
      setProjects([...projects, newProject]);
      setNewProjectName("");
      if (!selectedProject) {
        setSelectedProject(newProject.id);
      }
    }
  };

  const addTask = async () => {
    const postData = {
      title,
      description,
      created_at: createdat,
      status
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/core/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      const updatedProjects = projects.map(project => 
        project.id === selectedProject 
          ? { ...project, tasks: [...project.tasks, data.id] }
          : project
      );
      setProjects(updatedProjects);
      setPosts([...posts, data]);
    } catch (err) {
      console.log(err);
    }
  };

  const updateTask = async (pk) => {
    const postData = {
      title: newTitle,
      description: newDescription,
      created_at: newCreatedat,
      status: newStatus
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/core/posts/${pk}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json()
      setPosts((prev) => prev.map((post) => post.id === pk ? data : post));
    } catch (err) {
      console.log(err);
    }
  }

  const toggleStatus = async (pk, currentStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/core/posts/${pk}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: !currentStatus }),
      });
      const data = await response.json()
      setPosts((prev) => prev.map((post) => post.id === pk ? { ...post, status: data.status } : post));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (pk) => {
    try {
      await fetch(`http://127.0.0.1:8000/core/posts/${pk}`, {
        method: "DELETE",
      });
      setPosts((prev) => prev.filter((post) => post.id !== pk));
      setProjects(projects.map(project => ({
        ...project,
        tasks: project.tasks.filter(taskId => taskId !== pk)
      })));
    } catch (err) {
      console.log(err);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedProject ? projects.find(p => p.id === selectedProject)?.tasks.includes(post.id) : true)
  );

  // State to manage the visibility of the edit forms
  const [editFormVisible, setEditFormVisible] = useState(
    new Array(posts.length).fill(false)
  );

  // Function to toggle the visibility of the edit form for a specific post
  const toggleEditForm = (index) => {
    const newVisibility = [...editFormVisible];
    newVisibility[index] = !newVisibility[index];
    setEditFormVisible(newVisibility);
  };
  
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/core/posts/");
      const data = await response.json();
      setPosts(data); 
    } catch (err) {
      console.error(err);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);


  useEffect(() => {
    setTimeout(() => {
      fetchPosts();
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <header className="bg-white shadow-md flex flex-col">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaCode className="mr-2" />
            <span>Task Manager</span>
          </h1>
          <button className="text-gray-600 block focus:outline-none" onClick={toggleMenu} > {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />} </button>
        </div>
        <nav>
        <ul className={`${isMenuOpen ? 'block' : 'hidden'} flex space-y-5 py-5 flex-col justify-left ms-3`}>
        <li><a href="#" className="text-gray-600 p-2 w-full rounded-lg bg-gray-300 hover:text-gray-800 transition duration-300">Home</a></li>
          <li><a href="#" className="text-gray-600 p-2 w-full rounded-lg bg-gray-300 hover:text-gray-800 transition duration-300">About</a></li>
          <li><a href="#" className="text-gray-600 p-2 w-full rounded-lg bg-gray-300 hover:text-gray-800 transition duration-300">Contact</a></li>
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
          </button>
        </ul>
      </nav>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        <div className="md:w-1/4 mb-8 md:mb-0 md:mr-8">
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          <div className="mb-4">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="New Project Name"
              className="w-full p-2 border rounded"
            />
            <button 
              onClick={addProject}
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Add Project
            </button>
          </div>
          <ul>
            {projects.map(project => (
              <li 
                key={project.id}
                className={`cursor-pointer p-2 rounded ${selectedProject === project.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                onClick={() => setSelectedProject(project.id)}
              >
                {project.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="posts md:w-1/2">
          <div className="mb-8">
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Search tasks..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-8">
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
                        <label htmlFor={`status-${post.id}`}>
                          Status:
                          <input
                            id={`status-${post.id}`}
                            type="checkbox"
                            checked={post.status}
                            onChange={() => toggleStatus(post.id, post.status)}
                            className="text-xl m-3"
                          />
                        </label>
                        <span className="px-3 py-2 rounded-xl bg-gray-400">{post.status ? 'Done' : 'Not Done'}</span>
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
                          className="mx-2 h-8 p-3 mb-5 rounded-lg border border-gray-500"
                          type="text"
                          placeholder="Task..."
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <input
                          className="mx-2 h-8 p-3 mb-5 rounded-lg border border-gray-500"
                          type="text"
                          placeholder="Description..."
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                        />
                        <input
                          className="mx-2 h-8 p-3 mb-5 rounded-lg border border-gray-500"
                          type="text"
                          placeholder="Due Date..."
                          value={newCreatedat}
                          onChange={(e) => setNewCreatedat(e.target.value)}
                        />
                        <label>
                          Status:
                          <input
                            type="checkbox"
                            checked={newStatus}
                            onChange={(e) => setNewStatus(e.target.checked)}
                            className="ml-2"
                          />
                        </label>
                        <button 
                          onClick={() => updateTask(post.id)}
                          type="submit"
                          className="mt-4 rounded-md outline outline-gray-300 hover:outline-gray-500"
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
        </div>

        <aside className="md:w-1/4 mt-8 md:mt-0">
          <div className="flex flex-col bg-white rounded-lg shadow-md p-3 sticky top-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Add Task</h3>
            <input
              className="mx-2 h-8 p-3 mb-5 rounded-lg border border-gray-500"
              type="text"
              placeholder="Task..."
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="mx-2 h-8 p-3 mb-5 rounded-lg border border-gray-500"
              type="text"
              placeholder="Description..."
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="mx-2 h-8 p-3 mb-5 rounded-lg border border-gray-500"
              type="text"
              placeholder="Due Date..."
              onChange={(e) => setCreatedAt(e.target.value)}
            />
            <div className='flex justify-end'>
              <label className='mt-1'> Done:</label>
              <input
                id="check '{post.id}'"
                className="mb-3 m-3"
                type="checkbox"
                onChange={(e) => setStatus(e.target.checked)}
              />
            </div>
            <button
              className="rounded-md outline outline-gray-300 hover:outline-gray-500"
              type="submit"
              onClick={addTask}
              disabled={!selectedProject}
            >
              Submit
            </button>
          </div>
        </aside>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2024 DevBlog. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300 transition duration-300">
              <FaGithub size={24} />
            </a>
            <a href="#" className="hover:text-gray-300 transition duration-300">
              <FaTwitter size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;