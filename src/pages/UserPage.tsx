import React, { useState } from 'react';
import ParticleEffect from '../components/ParticleEffect';
import { useReviewStore } from '../store/reviewStore';
import { useAnimeStore } from '../store/animeStore';

const UserPage: React.FC = () => {
  const [importOption, setImportOption] = useState<'overwrite' | 'merge'>('overwrite');
  const [file, setFile] = useState<File | null>(null);
  const [importMessage, setImportMessage] = useState('');
  
  const { reviews, setReviews, addReviews } = useReviewStore();
  const { reviews: animeReviews, setReviews: setAnimeReviews, addReviews: addAnimeReviews } = useAnimeStore();

  // 导出功能
  const handleExport = () => {
    const exportData = {
      appVersion: '1.0.0',
      exportDate: new Date().toISOString(),
      data: {
        reviewData: reviews,
        animeData: animeReviews
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImportMessage('');
    }
  };

  // 导入功能
  const handleImport = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') {
          setImportMessage('无效的文件格式');
          return;
        }

        const importData = JSON.parse(result);

        // 验证数据格式
        if (!importData.data || !Array.isArray(importData.data.reviewData) || !Array.isArray(importData.data.animeData)) {
          setImportMessage('无效的数据格式');
          return;
        }

        // 根据选择执行导入
        if (importOption === 'overwrite') {
          setReviews(importData.data.reviewData);
          setAnimeReviews(importData.data.animeData);
          setImportMessage('数据已成功覆盖');
        } else {
          // 去重：过滤掉已存在的 ID
          const existingReviewIds = new Set(reviews.map(r => r.id));
          const newReviews = importData.data.reviewData.filter(r => !existingReviewIds.has(r.id));
          
          const existingAnimeIds = new Set(animeReviews.map(a => a.id));
          const newAnimeReviews = importData.data.animeData.filter(a => !existingAnimeIds.has(a.id));
          
          addReviews(newReviews);
          addAnimeReviews(newAnimeReviews);
          
          const totalImported = newReviews.length + newAnimeReviews.length;
          const totalSkipped = (importData.data.reviewData.length - newReviews.length) + 
                              (importData.data.animeData.length - newAnimeReviews.length);
          
          if (totalSkipped > 0) {
            setImportMessage(`成功合并 ${totalImported} 条数据，跳过 ${totalSkipped} 条重复数据`);
          } else {
            setImportMessage(`成功合并 ${totalImported} 条数据`);
          }
        }

        // 清空文件选择
        setFile(null);
      } catch (error) {
        setImportMessage('导入失败：' + (error instanceof Error ? error.message : '未知错误'));
      }
    };
    reader.onerror = () => {
      setImportMessage('文件读取失败');
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ParticleEffect color="rgba(156, 163, 175, 0.3)" count={20} />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-600 mb-6">我的</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">数据管理</h2>
          
          <div className="mb-6">
            <button 
              onClick={handleExport}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              导出数据
            </button>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">导入数据</h3>
            <input 
              type="file" 
              accept=".json"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">导入选项</h3>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="importOption" 
                  value="overwrite" 
                  checked={importOption === 'overwrite'}
                  onChange={() => setImportOption('overwrite')}
                  className="mr-2"
                />
                覆盖现有数据
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="importOption" 
                  value="merge" 
                  checked={importOption === 'merge'}
                  onChange={() => setImportOption('merge')}
                  className="mr-2"
                />
                合并现有数据
              </label>
            </div>
          </div>
          
          <button 
            onClick={handleImport}
            disabled={!file}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            导入数据
          </button>
          
          {importMessage && (
            <p className="mt-4 text-sm text-gray-600">{importMessage}</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">关于应用</h2>
          <p className="text-sm text-gray-600">版本: 1.0.0</p>
          <p className="text-sm text-gray-600 mt-2">这是一个个人记录应用，用于记录生活复盘和动漫观看体验。</p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;