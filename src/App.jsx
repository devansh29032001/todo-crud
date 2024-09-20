import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import { useLocation, useNavigate } from 'react-router-dom';
import data from './data.json';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom hook to get query parameters from the URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

function App() {
  // State hooks for managing tasks, search query, new task inputs, date filter, and expansion state
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Initialize query hook and navigation hook
  const query = useQuery();
  const navigate = useNavigate();

  // Load tasks from data.json when the component mounts
  useEffect(() => {
    setTasks(data);
  }, []);

  // Update search query from URL query parameters
  useEffect(() => {
    const search = query.get('search');
    if (search) {
      setSearchQuery(decodeURIComponent(search));
    }
  }, [query]);

  // Function to handle adding a new task
  const handleAddTask = () => {
    // Validate new task inputs
    if (!newTaskTitle && !newTaskDescription) {
      return toast.error("Title and Description are required!");
    }
    if (!newTaskTitle) {
      return toast.error("Title is required!");
    }
    if (!newTaskDescription) {
      return toast.error("Description is required!");
    }

    // Create a new task and add it to the tasks array
    const newTask = {
      id: tasks.length + 1,
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      lastUpdated: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setFilterDate(""); // Clear date filter after adding a task
    toast.success("Task Added Successfully!");
    setIsExpanded(false); // Collapse the form after adding a task
  };

  // Function to handle updating an existing task
  const handleUpdateTask = (id, updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, ...updatedTask, lastUpdated: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
  };

  // Function to toggle the completion status of a task
  const handleToggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    toast.success("Task status updated!");
  };

  // Function to toggle the form expansion state
  const handleToggleExpand = () => {
    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsExpanded(!isExpanded);
  };

  // Function to handle changes in the date filter input
  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  // Function to clear the date filter
  const handleClearDateFilter = () => {
    setFilterDate("");
  };

  // Function to handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    navigate(`/?search=${encodeURIComponent(value)}`); // Update URL with the search query
  };

  // Filter tasks based on search query and date filter
  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.lastUpdated).toISOString().split('T')[0];
    const filterDateISO = filterDate ? new Date(filterDate).toISOString().split('T')[0] : '';
    return (
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) && (filterDateISO ? taskDate === filterDateISO : true);
  });

  return (
    <div className={`App bg-gray-100 min-h-screen lg:py-6 p-2 ${isExpanded ? 'lg:pt-12' : ''}`}>
      <ToastContainer />
      
      {/* Main container with flex layout to handle task list and form display */}
      <div className={`flex flex-col ${isExpanded ? 'lg:flex-row lg:space-x-6 lg:items-center lg:justify-center' : 'lg:items-center lg:justify-center'}`}>
        
        {/* Task list section */}
        <div className={`flex-1 lg:w-1/2 shadow-[0px_20px_20px_10px_#bee3f8] p-8 lg:p-6 my-8 ${isExpanded ? 'lg:my-0' : ''}`}>
          <h1 className="text-4xl font-bold text-center mb-6 bg-blue-500 p-3 rounded-xl lg:mb-6 lg:mt-2 text-white">Todo List</h1>
          
          {/* Search input */}
          <div className='px-4 mb-4'>
            <div className="flex items-center w-full h-10 rounded-lg focus-within:shadow-lg bg-white overflow-hidden lg:mb-4">
              <div className="grid place-items-center h-full w-12 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                className='peer h-full w-full outline-none text-sm text-gray-700 pr-2'
                type="text"
                id="search"
                placeholder="Search something.." 
                value={searchQuery}
                onChange={handleSearch} 
              /> 
            </div>
          </div>
          
          {/* Date filter input */}
          <h3 className="text-lg font-semibold my-4 px-4">Filter by date</h3>
          <div className='px-4'>
            <div className="flex justify-between w-full h-10 rounded-lg focus-within:shadow-lg bg-white overflow-hidden lg:mb-8">
              <input
                type="date"
                value={filterDate}
                onChange={handleFilterDateChange}
                className='peer h-full w-full outline-none text-lg text-gray-700 px-2'
              />
              <button
                onClick={handleClearDateFilter}
                className="px-2 m-2 text-sm h-6 rounded-md bg-red-400 text-white font-semibold hover:bg-red-500 transition duration-300"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Display filtered tasks */}
          <h3 className="text-2xl font-semibold my-2 text-center">Your Task List</h3>
          <TaskList tasks={filteredTasks} onUpdate={handleUpdateTask} onToggle={handleToggleTask}/>

          {/* Button to toggle the form visibility */}
          {!isExpanded && (
            <div className="flex justify-center">
              <h3
                className="text-2xl font-semibold w-full my-4 p-3 rounded-xl bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition duration-300 text-center"
                onClick={handleToggleExpand}
              >
                Add New Task
              </h3>
            </div>
          )}
        </div>
        
        {/* Form to add a new task */}
        {isExpanded && (
          <div className="flex-1 lg:w-1/2 lg:py-6 lg:mt-0 my-6 shadow-[0px_20px_20px_10px_#bee3f8] lg:px-6 p-4">
            <div className="flex flex-col h-full">
              <input
                type="text"
                placeholder="Title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 mb-4"
              />
              <textarea
                placeholder="Description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 mb-4"
              />
              <button
                onClick={handleAddTask}
                className="w-full p-3 my-4 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300"
              >
                Add Task
              </button>
              <button
                onClick={handleToggleExpand}
                className="w-full p-3 rounded-md bg-red-500 text-white font-semibold transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
