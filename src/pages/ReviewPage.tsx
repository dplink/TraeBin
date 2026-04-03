import React, { useState } from 'react';
import { useReviewStore } from '../store/reviewStore';
import ReviewCard from '../components/ReviewCard';
import ParticleEffect from '../components/ParticleEffect';

const ReviewPage: React.FC = () => {
  const { reviews, addReview, deleteReview, updateReview } = useReviewStore();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('工作');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addReview(content, category);
      setContent('');
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
            <div className="flex space-x-2">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="分类（如：工作、生活、学习）"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          {sortedReviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">还没有复盘记录，开始添加吧！</p>
            </div>
          ) : (
            sortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                content={review.content}
                category={review.category}
                createdAt={review.createdAt}
                onDelete={deleteReview}
                onUpdate={updateReview}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;