import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Task = ({ task, onUpdate, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
  const [editTitle, setEditTitle] = useState(task.title); // State to hold the title while editing
  const [editDescription, setEditDescription] = useState(task.description); // State to hold the description while editing
  const [isExpanded, setIsExpanded] = useState(false); // State to manage expansion of task details

  // Handle task update
  const handleUpdate = () => {
    if (!editTitle || !editDescription) {
      return toast.error('Please fill in all fields'); // Show error if fields are empty
    }

    const updatedTask = {
      ...task,
      title: editTitle,
      description: editDescription,
      lastUpdated: new Date().toISOString(), // Update last updated timestamp
    };

    onUpdate(task.id, updatedTask); // Call parent update function
    toast.success('Task updated successfully'); // Show success message
    setIsEditing(false); // Exit editing mode
  };

  // Toggle expansion of task details
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isEditing) {
      setIsEditing(false); // Exit editing mode if expanded
      setEditTitle(task.title); // Reset title to original if exiting edit mode
      setEditDescription(task.description); // Reset description to original if exiting edit mode
    }
  };

  // Toggle editing mode
  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    if (isEditing) {
      setEditTitle(task.title); // Reset title to original if exiting edit mode
      setEditDescription(task.description); // Reset description to original if exiting edit mode
    }
    setIsEditing(!isEditing); // Toggle editing state
    if (!isEditing) {
      setIsExpanded(true); // Expand if entering edit mode
    }
  };

  // Toggle task completion status
  const handleToggleClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    onToggle(task.id); // Call parent toggle function
  };

  return (
    <div className="task p-4 rounded-md bg-white shadow-md transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-center cursor-pointer" onClick={handleToggleExpand}>
        <div>
          <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title} {/* Display task title */}
          </h4>
        </div>
        <div className="flex items-center space-x-2">
          {/* Button to toggle task completion */}
          <button
            onClick={handleToggleClick}
            className={`toggle-btn p-2 rounded-md ${task.completed ? 'bg-red-500' : 'bg-green-500'} text-white`}
          >
            {task.completed ? 'Undo' : 'Done'}
          </button>
          {/* Button to enter or exit editing mode */}
          {isEditing ? (
            <button
              onClick={handleEditClick}
              className="p-2 rounded-md bg-red-500 text-white edit-btn"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={handleEditClick}
              className="p-2 rounded-md bg-yellow-500 text-white edit-btn"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      {/* Conditional rendering of task details */}
      <div className={`transition-all duration-500 ease-in-out`}>
        {isExpanded && (
          <div className="mt-2">
            {isEditing ? (
              <>
                {/* Input fields for editing task title and description */}
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300 mb-2"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300 mb-2"
                />
                <button
                  onClick={handleUpdate}
                  className="w-full p-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-300"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {/* Display task description and last updated timestamp */}
                <p className={`text-gray-600 mb-2 ${task.completed ? 'text-gray-500' : ''}`}>{task.description}</p>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(task.lastUpdated).toLocaleString()} {/* Format and display last updated date */}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
