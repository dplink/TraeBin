import React, { useState } from 'react';
import { useAnimeStore } from '../store/animeStore';
import AnimeReviewCard from '../components/AnimeReviewCard';
import ParticleEffect from '../components/ParticleEffect';

type Season = '冬' | '春' | '夏' | '秋';

const AnimePage: React.FC = () => {
  const { reviews, addReview, deleteReview, updateReview } = useAnimeStore();
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [season, setSeason] = useState<Season>('春');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      addReview(title, parseInt(year), season, content);
      setTitle('');
      setContent('');
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const seasons: Season[] = ['冬', '春', '夏', '秋'];

  return (
    <div className="min-h-screen bg-pink-50 pb-20">
      <ParticleEffect color="rgba(255, 128, 171, 0.3)" count={30} />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-pink-600 mb-6">新番影评</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="新番名称..."
            />
            <div className="flex space-x-2">
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="年份"
                min="2000"
                max="2100"
              />
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as Season)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {seasons.map((s) => (
                  <option key={s} value={s}>{s}季</option>
                ))}
              </select>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows={4}
              placeholder="写下你的影评..."
            />
            <button
              type="submit"
              className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              添加影评
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {sortedReviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">还没有影评记录，开始添加吧！</p>
            </div>
          ) : (
            sortedReviews.map((review) => (
              <AnimeReviewCard
                key={review.id}
                id={review.id}
                title={review.title}
                year={review.year}
                season={review.season}
                content={review.content}
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

export default AnimePage;