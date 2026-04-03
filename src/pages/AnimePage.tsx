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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      addReview(title, parseInt(year), season, content);
      setTitle('');
      setContent('');
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
              disabled={!title.trim() || !content.trim()}
              className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              添加影评
            </button>
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
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
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
                {selectedTags.length > 0 ? '没有找到匹配的记录' : '还没有影评记录，开始添加吧！'}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <AnimeReviewCard
                key={review.id}
                id={review.id}
                title={review.title}
                year={review.year}
                season={review.season}
                tags={review.tags}
                content={review.content}
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

export default AnimePage;