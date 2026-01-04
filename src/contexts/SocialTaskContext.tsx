import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SocialTask, mockSocialTasks } from '../mock-data/mockData';
import { useAuth } from './AuthContext';

interface SocialTaskContextType {
  tasks: SocialTask[];
  completeTask: (taskId: string) => void;
  resetTasks: () => void;
  resetLikeShareTasks: () => void;
  allTasksCompleted: boolean;
}

const SocialTaskContext = createContext<SocialTaskContextType | undefined>(undefined);

export const SocialTaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<SocialTask[]>(mockSocialTasks);

  // Load tasks from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storageKey = `social_tasks_${user.id}`;
      const savedTasks = localStorage.getItem(storageKey);

      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          // Merge saved completion status with current mock task definitions (in case definitions changed)
          setTasks(prev => prev.map(task => {
            const savedTask = parsedTasks.find((t: SocialTask) => t.id === task.id);
            return savedTask ? { ...task, isCompleted: savedTask.isCompleted } : task;
          }));
        } catch (e) {
          console.error("Error parsing saved tasks", e);
          setTasks(mockSocialTasks);
        }
      } else {
        // New user or no saved data, start fresh
        setTasks(mockSocialTasks);
      }
    } else {
      // Guest mode - reset execution
      setTasks(mockSocialTasks);
    }
  }, [user]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user) {
      const storageKey = `social_tasks_${user.id}`;
      // We only save the ID and completion status to keep it lightweight
      const tasksToSave = tasks.map(t => ({ id: t.id, isCompleted: t.isCompleted }));
      localStorage.setItem(storageKey, JSON.stringify(tasksToSave));
    }
  }, [tasks, user]);

  const resetLikeShareTasks = () => {
    setTasks((prev) =>
      prev.map((task) =>
        task.type === 'like' || task.type === 'share'
          ? { ...task, isCompleted: false }
          : task
      )
    );
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isCompleted: true } : task
      )
    );
  };

  const resetTasks = () => {
    setTasks(mockSocialTasks.map((task) => ({ ...task, isCompleted: false })));
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
