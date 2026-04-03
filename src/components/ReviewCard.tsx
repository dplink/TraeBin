import React, { useState } from 'react';
import { Trash2, Edit, X } from 'lucide-react';

interface ReviewCardProps {
  id: string;
  content: string;
  tags: string[];
  createdAt: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string, tags: string[]) => void;
  onTagClick: (tag: string) => void;
  selectedTags: string[];
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  content,
  tags,
  createdAt,
  onDelete,
  onUpdate,
  onTagClick,
  selectedTags,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [editTags, setEditTags] = useState<string[]>(tags);
  const [editTagInput, setEditTagInput] = useState('');

  const handleSave = () => {
    onUpdate(id, editContent, editTags);
    setIsEditing(false);
  };

  const handleEditTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editTagInput.trim()) {
      e.preventDefault();
      if (editTags.length < 5 && !editTags.includes(editTagInput.trim())) {
        setEditTags([...editTags, editTagInput.trim()]);
        setEditTagInput('');
      }
    }
  };

  const removeEditTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all duration-300 hover:shadow-lg">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="输入复盘内容..."
          />
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {editTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeEditTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={editTagInput}
              onChange={(e) => setEditTagInput(e.target.value)}
              onKeyDown={handleEditTagKeyDown}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={editTags.length >= 5 ? '已达到最大tag数量' : '输入tag后按回车添加...'}
              disabled={editTags.length >= 5}
            />
            <p className="text-xs text-gray-500">
              已添加 {editTags.length}/5 个tag
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={!editContent.trim() || editTags.length === 0}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              保存
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagClick(tag)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-gray-700">{content}</p>
            </div>
            <div className="flex space-x-2 ml-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500">{formatDate(createdAt)}</div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;