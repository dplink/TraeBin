import React, { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';

type Season = '冬' | '春' | '夏' | '秋';

interface AnimeReviewCardProps {
  id: string;
  title: string;
  year: number;
  season: Season;
  tags: string[];
  content: string;
  createdAt: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, year: number, season: Season, content: string) => void;
  onTagClick: (tag: string) => void;
  selectedTags: string[];
}

const AnimeReviewCard: React.FC<AnimeReviewCardProps> = ({
  id,
  title,
  year,
  season,
  tags,
  content,
  createdAt,
  onDelete,
  onUpdate,
  onTagClick,
  selectedTags,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editYear, setEditYear] = useState(year.toString());
  const [editSeason, setEditSeason] = useState<Season>(season);
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onUpdate(id, editTitle, parseInt(editYear), editSeason, editContent);
    setIsEditing(false);
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

  const seasons: Season[] = ['冬', '春', '夏', '秋'];

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="新番名称..."
          />
          <div className="flex space-x-2">
            <input
              type="number"
              value={editYear}
              onChange={(e) => setEditYear(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="年份"
              min="2000"
              max="2100"
            />
            <select
              value={editSeason}
              onChange={(e) => setEditSeason(e.target.value as Season)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {seasons.map((s) => (
                <option key={s} value={s}>{s}季</option>
              ))}
            </select>
          </div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={4}
            placeholder="个人影评..."
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }}
              className="px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              disabled={!editTitle.trim() || !editContent.trim()}
              className="px-3 py-1 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              保存
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-pink-600">{title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          {isExpanded && (
            <div className="space-y-2 mt-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagClick(tag);
                    }}
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 text-pink-800 hover:bg-pink-200'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-700">{content}</p>
              <div className="text-xs text-gray-500">{formatDate(createdAt)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimeReviewCard;