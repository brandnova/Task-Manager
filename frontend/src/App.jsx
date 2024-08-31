import { useState, useEffect } from 'react';
import { FaSearch, FaGithub, FaTwitter, FaPen, FaTrash, FaBars, FaTimes, FaSun, FaMoon, FaCheckDouble } from 'react-icons/fa';
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

//   // State to manage the visibility of the edit forms
   const [setEditFormVisible] = useState(Array(posts.length).fill(false));

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
      
      // Clear the editing state
      setEditingTask(null);
      setEditFormVisible(new Array(posts.length).fill(false));
    } catch (err) {
      console.log(err);
    }
  }

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

const [darkMode, setDarkMode] = useState(() => {
  const savedMode = localStorage.getItem('darkMode');
  return savedMode ? JSON.parse(savedMode) : false;
});

useEffect(() => {
  localStorage.setItem('darkMode', JSON.stringify(darkMode));
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);

const toggleDarkMode = () => setDarkMode(!darkMode);
  const [editingTask, setEditingTask] = useState(null);

  // ... (other functions remain the same)

  const toggleEditForm = (postId) => {
    if (editingTask === postId) {
      setEditingTask(null);
    } else {
      setEditingTask(postId);
      const post = posts.find(p => p.id === postId);
      if (post) {
        setNewTitle(post.title);
        setNewDescription(post.description);
        setNewCreatedat(post.created_at);
        setNewStatus(post.status);
      }
    }
  };

  

useEffect(() => {
    setTimeout(() => {
      fetchPosts();
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <header className={`shadow-md transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className={`text-3xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <FaCheckDouble className="mr-2" />
            <span>Task Manager</span>
          </h1>
          <div className="flex items-center">
            {/* Desktop NavBar */}
            <nav className="hidden md:block mr-4">
              <ul className="flex space-x-4">
                <li><a href="#" className={`p-2 rounded-lg transition duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}>Home</a></li>
                <li><a href="#" className={`p-2 rounded-lg transition duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}>About</a></li>
                <li><a href="#" className={`p-2 rounded-lg transition duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}>Contact</a></li>
              </ul>
            </nav>
            {/* Darkmode Toggle Button */}
            <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors duration-300 ${darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            {/* Mobile Navbar Toggle Button */}
            <button className={`ml-4 text-2xl focus:outline-none md:hidden ${darkMode ? 'text-white hover:text-gray-300 bg-gray-900' : 'text-gray-600 hover:text-gray-800 bg-gray-100'}`} onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        {/* Mobile NavBar */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <ul className="flex flex-col space-y-2 py-4 px-4">
            <li><a href="#" className={`block p-2 rounded-lg transition duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}>Home</a></li>
            <li><a href="#" className={`block p-2 rounded-lg transition duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}>About</a></li>
            <li><a href="#" className={`block p-2 rounded-lg transition duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}>Contact</a></li>
          </ul>
        </nav>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        <div className={`md:w-1/4 mb-8 md:mb-0 md:mr-8 ${darkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-800 bg-white'} flex flex-col rounded-lg shadow-md p-3 transition-colors duration-300`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Projects</h2>
            <div className="mb-4">
                <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="New Project Name" className={`w-full p-2 border rounded transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}/>
                <button onClick={addProject} className={`mt-2 w-full p-2 rounded transition-colors duration-300 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
                Add Project
                </button>
            </div>
            <ul>
                {projects.map(project => (
                <li key={project.id} className={`cursor-pointer p-2 rounded transition-colors duration-300 ${selectedProject === project.id ? (darkMode ? 'bg-blue-800 text-white' : 'bg-blue-500 text-white') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')}`} onClick={() => setSelectedProject(project.id)}>
                    {project.name}
                </li>
                ))}
            </ul>
            </div>
        
        {/* Task List Tab */}
        <div className="posts md:w-2/4">
        <div className="mb-8">
            <div className="relative">
              <input id="search" type="text" placeholder="Search tasks..." className={`w-full px-4 py-2 rounded-full border transition-colors duration-300 ${ darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <FaSearch className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${ darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${ darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
          </div>
          ) : (
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="p-6">
                  <div className='flex justify-between'>
                      <div>
                        <h2 className={`text-2xl font-bold mb-2 ${ darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Task: <span className="text-xl">{post.title}</span> 
                        </h2>
                        <h2 className={`text-2xl font-bold mb-2 ${ darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Due: <span className="text-xl">({post.created_at})</span>
                        </h2>
                      </div>
                      {/* Status */}
                      <div>
                        <span className={`px-3 py-2 rounded-xl ${ post.status ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-500 text-white') : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-800')}`}>
                          {post.status ? 'Done' : 'Not Done'}
                        </span>
                      </div>
                    </div>
                    <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{post.description}</p>
                    <div className="flex flex-row justify-between">
                      <div>
                        <button onClick={() => deleteTask(post.id)} className={`inline-block mx-2 p-3 rounded-xl transition-colors duration-300 ${darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-500 hover:bg-red-600' } text-white`}>
                          <FaTrash />
                        </button>
                        <button className={`inline-block mx-2 p-3 rounded-xl transition-colors duration-300 ${ darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-400 hover:bg-yellow-500' } text-white`} onClick={() => toggleEditForm(post.id)}>
                          <FaPen />
                        </button>
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {post.release_date}
                      </span>
                    </div>
                    {/* Edit task form */}
                    {editingTask === post.id && (
                      <div className={`flex flex-col rounded-lg shadow-md p-3 mt-4 ${ darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Edit Task</h3>
                        <input 
                          className={`mx-2 h-8 p-3 mb-5 rounded-lg outline outline-gray-500 ${ darkMode ? 'text-white bg-gray-900 text-gray-100 outline-gray-500 hover:outline-gray-700' : 'text-gray-600 bg-gray-100 text-gray-900 outline-gray-200 hover:outline-gray-400'}`} 
                          type="text" 
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)} 
                        />
                        <input 
                          className={`mx-2 h-8 p-3 mb-5 rounded-lg outline outline-gray-500 ${ darkMode ? 'text-white bg-gray-900 text-gray-100 outline-gray-500 hover:outline-gray-700' : 'text-gray-600 bg-gray-100 text-gray-900 outline-gray-200 hover:outline-gray-400'}`} 
                          type="text" 
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)} 
                        />
                        <input 
                          className={`mx-2 h-8 p-3 mb-5 rounded-lg outline outline-gray-500 ${ darkMode ? 'text-white bg-gray-900 text-gray-100 outline-gray-500 hover:outline-gray-700' : 'text-gray-600 bg-gray-100 text-gray-900 outline-gray-200 hover:outline-gray-400'}`} 
                          type="text" 
                          value={newCreatedat}
                          onChange={(e) => setNewCreatedat(e.target.value)} 
                        />
                        <label className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Status:
                          <input 
                            type="checkbox" 
                            checked={newStatus} 
                            onChange={(e) => setNewStatus(e.target.checked)}
                            className="text-xl m-3" 
                          />
                        </label>
                        <button onClick={() => updateTask(post.id)} type="submit" className={`mt-4 rounded-md text-white ${ darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600' }`}>
                          Update
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        
        <aside className="md:w-1/4 mt-8 md:mt-0  md:ml-8">
          <div className={`flex flex-col rounded-lg shadow-md p-3 sticky top-8 transition-colors duration-300 ${ darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Add Task</h3>

            <input className={`mx-2 h-8 p-3 mb-5 rounded-lg border transition-colors duration-300 ${ darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} type="text" placeholder="Task..." onChange={(e) => setTitle(e.target.value)} />

            <input className={`mx-2 h-8 p-3 mb-5 rounded-lg border transition-colors duration-300 ${ darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} type="text" placeholder="Description..." onChange={(e) => setDescription(e.target.value)} />

            <input className={`mx-2 h-8 p-3 mb-5 rounded-lg border transition-colors duration-300 ${ darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500' }`} type="text" placeholder="Due Date..." onChange={(e) => setCreatedAt(e.target.value)} />

            <div className='flex justify-end'>
              <label className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}> Done:</label>
              <input id="check '{post.id}'" className="mb-3 m-3" type="checkbox" onChange={(e) => setStatus(e.target.checked)} />
            </div>

            <button className={`rounded-md transition-colors duration-300 ${ darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`} type="submit" onClick={addTask}>
              Submit
            </button>
          </div>
        </aside>
      </main>
      <footer className={`py-8 transition-colors duration-300 ${ darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2024 TaskManager. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://github.com/brandnova" className={`transition-colors duration-300 ${ darkMode ? 'hover:text-gray-100' : 'hover:text-gray-900'}`}>
              <FaGithub size={24} />
            </a>
            <a href="#" className={`transition-colors duration-300 ${ darkMode ? 'hover:text-gray-100' : 'hover:text-gray-900'}`}>
              <FaTwitter size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;