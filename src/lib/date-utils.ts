
export const isOverdue = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return `${Math.floor(diffInHours / 24)} days ago`;
  }
};

export const getTaskPriorityOrder = (priority: 'low' | 'medium' | 'high'): number => {
  const priorityMap = { high: 3, medium: 2, low: 1 };
  return priorityMap[priority];
};
