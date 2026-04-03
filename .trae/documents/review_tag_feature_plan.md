# 生活复盘Tag功能改造计划

## 需求概述
将生活复盘功能中的分类字段改为tag制，支持：
1. 添加待优化事项时，通过回车键添加多个tag（最多5个）
2. 展示待优化事项时，点击tag可筛选包含该tag的记录
3. 筛选支持多选AND逻辑（同时包含所有所选tag）

## 当前状态分析
- **数据模型**：`category` 为单个字符串字段
- **输入方式**：普通文本输入框
- **展示方式**：单个span标签显示分类
- **筛选功能**：无

## 涉及文件
1. [reviewStore.ts](file:///workspace/src/store/reviewStore.ts) - 数据模型修改
2. [ReviewPage.tsx](file:///workspace/src/pages/ReviewPage.tsx) - 输入组件和筛选逻辑
3. [ReviewCard.tsx](file:///workspace/src/components/ReviewCard.tsx) - 展示组件修改

## 实现步骤

### [x] Task 1: 修改数据模型
- **文件**: `src/store/reviewStore.ts`
- **修改内容**:
  - 将 `category: string` 改为 `tags: string[]`
  - 修改 `addReview` 和 `updateReview` 方法签名
  - 添加数据迁移逻辑兼容旧数据
- **验证**: ✅ TypeScript编译通过

### [x] Task 2: 修改ReviewPage输入组件
- **文件**: `src/pages/ReviewPage.tsx`
- **修改内容**:
  - 将category输入框改为tag输入组件
  - 监听回车键添加tag
  - 显示已添加的tag列表，支持删除
  - 添加筛选状态管理
  - 实现筛选逻辑（AND多选）
- **验证**: ✅ 
  - 回车可添加tag
  - 最多添加5个tag
  - 筛选功能正常工作

### [x] Task 3: 修改ReviewCard展示组件
- **文件**: `src/components/ReviewCard.tsx`
- **修改内容**:
  - 将单个span改为多个tag展示
  - 每个tag可点击触发筛选
  - 编辑模式支持tag的添加和删除
- **验证**: ✅
  - 多tag正确显示
  - 点击tag触发筛选
  - 编辑功能正常

## 数据迁移说明
由于数据结构从 `category: string` 改为 `tags: string[]`，已有数据需要处理：
- 方案：在读取时兼容旧数据，将 `category` 转换为 `tags: [category]`

## 成功标准
- [ ] 可以通过回车添加多个tag（最多5个）
- [ ] tag显示为可点击的标签样式
- [ ] 点击tag可筛选记录
- [ ] 支持多选AND逻辑筛选
- [ ] 编辑时可修改tag
- [ ] 兼容已有数据