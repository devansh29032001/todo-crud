import React from 'react';
import Task from './Task';

// TaskList component displays a list of tasks
const TaskList = ({ tasks, onUpdate, onToggle }) => {
  return (
    <div className={`task-list space-y-4 p-2 pb-4 overflow-y-auto lg:mb-4 mb-6 lg:max-h-[300px] max-h-[200px]`}>
      {/* Iterate over the tasks array and render a Task component for each task */}
      {tasks.map((task) => (
        <Task
          key={task.id}  // Unique key for each task to help React identify items
          task={task}    // Passing the task object as a prop to the Task component
          onUpdate={onUpdate} // Passing the onUpdate function as a prop for task updates
          onToggle={onToggle} // Passing the onToggle function as a prop for toggling task completion
        />
      ))}
    </div>
  );
};

export default TaskList;
