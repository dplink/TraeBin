import React from 'react';
import ParticleEffect from '../components/ParticleEffect';

const EmptyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ParticleEffect color="rgba(156, 163, 175, 0.3)" count={20} />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-600 mb-6">更多功能</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">功能开发中，敬请期待！</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyPage;