import React from 'react';
import { useSocialTasks } from '../contexts/SocialTaskContext';

const SocialTaskGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tasks, completeTask, allTasksCompleted } = useSocialTasks();

  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.isCompleted) {
      completeTask(taskId);
    }
  };

  return (
    <div className="card mb-6">
      <h3 className="text-xl font-bold text-tet-red-700 mb-4">
        Nhiệm vụ bắt buộc
      </h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-3 rounded-lg border-2 ${
              task.isCompleted
                ? 'bg-tet-red-50 border-tet-red-300'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => handleTaskToggle(task.id)}
                className="w-5 h-5 text-tet-red-600 rounded focus:ring-tet-red-500"
              />
              <span className={task.isCompleted ? 'line-through text-gray-500' : ''}>
                {task.name}
              </span>
            </div>
            {!task.isCompleted && (
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-tet-red-600 hover:text-tet-red-700 underline"
              >
                Thực hiện
              </a>
            )}
          </div>
        ))}
      </div>
      {allTasksCompleted && (
        <div className="mt-4 p-3 bg-tet-red-100 border border-tet-red-300 rounded-lg">
          <p className="text-tet-red-700 font-semibold">
            ✓ Bạn đã hoàn thành tất cả nhiệm vụ! Bây giờ bạn có thể mua con vật.
          </p>
        </div>
      )}
      {!allTasksCompleted && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-yellow-700">
            ⚠ Vui lòng hoàn thành tất cả nhiệm vụ để mở khóa tính năng mua hàng.
          </p>
        </div>
      )}
      {allTasksCompleted && children}
    </div>
  );
};

export default SocialTaskGate;

