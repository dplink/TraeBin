import React, { useState } from 'react';
import { useReviewStore } from '../store/reviewStore';
import ReviewCard from '../components/ReviewCard';
import ParticleEffect from '../components/ParticleEffect';
import { X } from 'lucide-react';

const ReviewPage: React.FC = () => {
  const { reviews, addReview, deleteReview, updateReview } = useReviewStore();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (tags.length < 5 && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && tags.length > 0) {
      addReview(content, tags);
      setContent('');
      setTags([]);
    }
  };

  const toggleFilterTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredReviews = sortedReviews.filter((review) => {
    if (selectedTags.length === 0) return true;
    return selectedTags.every((tag) => review.tags.includes(tag));
  });

  const allTags = Array.from(new Set(reviews.flatMap((review) => review.tags)));

  return (
    <div className="min-h-screen bg-blue-50 pb-20">
      <ParticleEffect color="rgba(100, 181, 246, 0.3)" count={30} />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">生活复盘</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="space-y-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="记录今天的待优化事项..."
            />
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={tags.length >= 5 ? '已达到最大tag数量' : '输入tag后按回车添加...'}
                  disabled={tags.length >= 5}
                />
                <button
                  type="submit"
                  disabled={!content.trim() || tags.length === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  添加
                </button>
              </div>
              <p className="text-xs text-gray-500">
                已添加 {tags.length}/5 个tag
              </p>
            </div>
          </div>
        </form>

        {allTags.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">筛选标签</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleFilterTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  key="clear-filter"
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                  清除筛选
                </button>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">
                {selectedTags.length > 0 ? '没有找到匹配的记录' : '还没有复盘记录，开始添加吧！'}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                content={review.content}
                tags={review.tags}
                createdAt={review.createdAt}
                onDelete={deleteReview}
                onUpdate={updateReview}
                onTagClick={toggleFilterTag}
                selectedTags={selectedTags}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;