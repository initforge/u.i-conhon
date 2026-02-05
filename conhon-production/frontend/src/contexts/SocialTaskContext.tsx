import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SocialTask, SOCIAL_TASKS } from '../types';
import { useAuth } from './AuthContext';
import { completeUserTask } from '../services/api';

interface SocialTaskContextType {
  tasks: SocialTask[];
  completeTask: (taskId: string) => void;
  resetTasks: () => void;
  resetLikeShareTasks: () => void;
  allTasksCompleted: boolean;
}

const SocialTaskContext = createContext<SocialTaskContextType | undefined>(undefined);

export const SocialTaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState<SocialTask[]>(SOCIAL_TASKS);

  // Load completed tasks from user.completed_tasks (database) when user changes
  useEffect(() => {
    if (user) {
      const completedTaskIds = user.completed_tasks || [];
      // Merge DB completion status with task definitions
      setTasks(SOCIAL_TASKS.map(task => ({
        ...task,
        isCompleted: completedTaskIds.includes(task.id)
      })));
    } else {
      // Guest mode - reset to default
      setTasks([...SOCIAL_TASKS]);
    }
  }, [user]);

  const resetLikeShareTasks = () => {
    setTasks((prev) =>
      prev.map((task) =>
        task.type === 'like' || task.type === 'share'
          ? { ...task, isCompleted: false }
          : task
      )
    );
  };

  const completeTask = async (taskId: string) => {
    // Optimistic update for UI
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isCompleted: true } : task
      )
    );

    // Persist to database via API
    if (user) {
      try {
        const result = await completeUserTask(taskId);
        // Update user context with new completed_tasks array
        updateUser({ completed_tasks: result.completed_tasks });
      } catch (error) {
        console.error('Failed to save task completion:', error);
        // Revert optimistic update on error
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, isCompleted: false } : task
          )
        );
      }
    }
  };

  const resetTasks = () => {
    setTasks(SOCIAL_TASKS.map((task) => ({ ...task, isCompleted: false })));
  };

  const allTasksCompleted = tasks.every((task) => !task.required || task.isCompleted);

  return (
    <SocialTaskContext.Provider
      value={{
        tasks,
        completeTask,
        resetTasks,
        resetLikeShareTasks,
        allTasksCompleted,
      }}
    >
      {children}
    </SocialTaskContext.Provider>
  );
};

export const useSocialTasks = () => {
  const context = useContext(SocialTaskContext);
  if (context === undefined) {
    throw new Error('useSocialTasks must be used within a SocialTaskProvider');
  }
  return context;
};
