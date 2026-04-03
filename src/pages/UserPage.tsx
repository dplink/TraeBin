import React, { useState, useRef } from 'react';
import ParticleEffect from '../components/ParticleEffect';
import { useReviewStore } from '../store/reviewStore';
import { useAnimeStore } from '../store/animeStore';
import { useUserStore } from '../store/userStore';
import { User, Camera, Download, Upload, Settings, Info, Edit2, Check } from 'lucide-react';

const UserPage: React.FC = () => {
  const [importOption, setImportOption] = useState<'overwrite' | 'merge'>('overwrite');
  const [file, setFile] = useState<File | null>(null);
  const [importMessage, setImportMessage] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const { reviews, setReviews, addReviews } = useReviewStore();
  const { reviews: animeReviews, setReviews: setAnimeReviews, addReviews: addAnimeReviews } = useAnimeStore();
  const { username, avatar, setUsername, setAvatar } = useUserStore();

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

  // 处理头像上传
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setAvatar(result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // 开始编辑用户名
  const startEditUsername = () => {
    setTempUsername(username);
    setIsEditingUsername(true);
  };

  // 保存用户名
  const saveUsername = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
    }
    setIsEditingUsername(false);
  };

  // 取消编辑用户名
  const cancelEditUsername = () => {
    setIsEditingUsername(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-24">
      <ParticleEffect color="rgba(99, 102, 241, 0.2)" count={25} />
      
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90"></div>
        
        <div className="container mx-auto px-4 pt-8 relative z-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">个人中心</h1>
            <p className="text-white/80 text-sm">记录生活，珍藏回忆</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 transform transition-all duration-300 hover:shadow-3xl">
            <div className="flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                  {avatar ? (
                    <img src={avatar} alt="头像" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                      <User className="w-14 h-14 text-white" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-3 border-white"
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex items-center space-x-2 mb-1">
                {isEditingUsername ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveUsername();
                        if (e.key === 'Escape') cancelEditUsername();
                      }}
                      className="text-xl font-bold text-gray-800 px-2 py-1 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      autoFocus
                    />
                    <button onClick={saveUsername} className="text-green-500 hover:text-green-600">
                      <Check className="w-5 h-5" />
                    </button>
                    <button onClick={cancelEditUsername} className="text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-800">{username}</h2>
                    <button onClick={startEditUsername} className="text-gray-400 hover:text-indigo-500 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              
              <div className="flex space-x-8 mt-4 w-full justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{reviews.length}</div>
                  <div className="text-xs text-gray-500">生活复盘</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{animeReviews.length}</div>
                  <div className="text-xs text-gray-500">动漫记录</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{reviews.length + animeReviews.length}</div>
                  <div className="text-xs text-gray-500">总记录</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-600 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  数据管理
                </h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                <button
                  onClick={handleExport}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800">导出数据</div>
                      <div className="text-xs text-gray-500">备份所有记录到本地</div>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mr-4">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-800">导入数据</div>
                        <div className="text-xs text-gray-500">{file ? file.name : '选择JSON文件'}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      选择文件
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className="flex space-x-3 mb-4">
                    <label className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer transition-all ${
                      importOption === 'overwrite' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="importOption"
                        value="overwrite"
                        checked={importOption === 'overwrite'}
                        onChange={() => setImportOption('overwrite')}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">覆盖</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer transition-all ${
                      importOption === 'merge' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="importOption"
                        value="merge"
                        checked={importOption === 'merge'}
                        onChange={() => setImportOption('merge')}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">合并</span>
                    </label>
                  </div>
                  
                  <button
                    onClick={handleImport}
                    disabled={!file}
                    className={`w-full py-3 rounded-xl font-medium transition-all ${
                      file
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-[1.02]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    开始导入
                  </button>
                  
                  {importMessage && (
                    <div className={`mt-3 p-3 rounded-lg text-sm ${
                      importMessage.includes('成功') 
                        ? 'bg-green-50 text-green-700' 
                        : importMessage.includes('失败') || importMessage.includes('无效')
                        ? 'bg-red-50 text-red-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {importMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-600 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  关于应用
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">版本</span>
                  <span className="text-gray-800 font-medium">1.0.0</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">开发者</span>
                  <span className="text-gray-800 font-medium">洛芙</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    这是一个个人记录应用，用于记录生活复盘和动漫观看体验～
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;