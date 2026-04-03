// 全局变量
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
let streak = parseInt(localStorage.getItem('streak')) || 0;
let lastActivityDate = localStorage.getItem('lastActivityDate');

// 初始化页面
function init() {
    updateDate();
    setupTabs();
    renderTasks();
    renderReviews();
    updateProgress();
    setupEventListeners();
    checkStreak();
}

// 更新日期
function updateDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('zh-CN', options);
}

// 设置标签页切换
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // 移除所有标签页的活动状态
            tabs.forEach(t => t.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // 添加当前标签页的活动状态
            tab.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 添加任务
    document.getElementById('add-task').addEventListener('click', addTask);
    document.getElementById('task-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // 保存复盘
    document.getElementById('save-review').addEventListener('click', saveReview);
}

// 添加任务
function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    
    if (text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            date: new Date().toISOString()
        };
        
        tasks.push(task);
        saveTasks();
        renderTasks();
        updateProgress();
        input.value = '';
    }
}

// 渲染任务列表
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="task-delete" data-id="${task.id}">×</button>
        `;
        taskList.appendChild(li);
    });

    // 添加任务点击事件
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', toggleTask);
    });

    document.querySelectorAll('.task-delete').forEach(button => {
        button.addEventListener('click', deleteTask);
    });
}

// 切换任务完成状态
function toggleTask(e) {
    const taskId = parseInt(e.target.getAttribute('data-id'));
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = e.target.checked;
        saveTasks();
        renderTasks();
        updateProgress();
        updateStreak();
    }
}

// 删除任务
function deleteTask(e) {
    const taskId = parseInt(e.target.getAttribute('data-id'));
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
    updateProgress();
}

// 保存任务到本地存储
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 保存复盘
function saveReview() {
    const input = document.getElementById('review-input');
    const content = input.value.trim();
    
    if (content) {
        const review = {
            id: Date.now(),
            content: content,
            date: new Date().toISOString()
        };
        
        reviews.unshift(review); // 添加到开头
        saveReviews();
        renderReviews();
        input.value = '';
        
        // 显示保存成功动画
        const button = document.getElementById('save-review');
        button.classList.add('success-animation');
        setTimeout(() => button.classList.remove('success-animation'), 500);
    }
}

// 渲染复盘历史
function renderReviews() {
    const reviewHistory = document.getElementById('review-history');
    reviewHistory.innerHTML = '';
    
    reviews.forEach(review => {
        const div = document.createElement('div');
        div.className = 'review-item';
        
        const date = new Date(review.date);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = date.toLocaleDateString('zh-CN', dateOptions);
        
        div.innerHTML = `
            <div class="review-date">${dateString}</div>
            <div class="review-content">${review.content}</div>
        `;
        reviewHistory.appendChild(div);
    });
}

// 保存复盘到本地存储
function saveReviews() {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

// 更新进度统计
function updateProgress() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
    document.getElementById('streak-days').textContent = streak;
    document.getElementById('total-tasks').textContent = totalTasks;
    
    renderProgressChart();
}

// 渲染进度图表
function renderProgressChart() {
    const canvas = document.getElementById('progress-canvas');
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 生成最近7天的数据
    const days = [];
    const completedCounts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        days.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        
        // 计算当天完成的任务数
        const dayTasks = tasks.filter(t => {
            const taskDate = new Date(t.date).toISOString().split('T')[0];
            return taskDate === dateString && t.completed;
        });
        
        completedCounts.push(dayTasks.length);
    }
    
    // 绘制图表
    const chartWidth = canvas.width - 80;
    const chartHeight = canvas.height - 60;
    const barWidth = chartWidth / days.length - 10;
    
    // 绘制网格线
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = 30 + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(canvas.width - 40, y);
        ctx.stroke();
    }
    
    // 绘制柱状图
    const maxCount = Math.max(...completedCounts, 1);
    
    completedCounts.forEach((count, index) => {
        const x = 40 + index * (barWidth + 10);
        const barHeight = (count / maxCount) * chartHeight;
        const y = 30 + chartHeight - barHeight;
        
        // 渐变填充
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, '#6a5acd');
        gradient.addColorStop(1, '#9370db');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // 绘制数值
        ctx.fillStyle = '#333';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(count, x + barWidth / 2, y - 5);
    });
    
    // 绘制日期标签
    ctx.fillStyle = '#666';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    days.forEach((day, index) => {
        const x = 40 + index * (barWidth + 10) + barWidth / 2;
        ctx.fillText(day, x, canvas.height - 10);
    });
}

// 检查连续天数
function checkStreak() {
    const today = new Date().toISOString().split('T')[0];
    
    if (lastActivityDate === today) {
        // 今天已经有活动
        return;
    } else if (lastActivityDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        if (lastActivityDate === yesterdayString) {
            // 连续天数+1
            streak++;
        } else {
            // 中断了，重置为1
            streak = 1;
        }
    } else {
        // 第一次使用
        streak = 1;
    }
    
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastActivityDate', today);
}

// 更新连续天数
function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastActivityDate', today);
    checkStreak();
    updateProgress();
}

// 创建粒子背景
function createParticles() {
    const particleCount = 20;
    const colors = ['#6a5acd', '#9370db', '#f8bbd0', '#e1bee7', '#d1c4e9'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机大小
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // 随机颜色
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // 随机位置
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // 随机动画持续时间
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // 随机延迟
        particle.style.animationDelay = `${Math.random() * 10}s`;
        
        document.body.appendChild(particle);
    }
}

// 任务完成时的动画效果
function showCompletionAnimation(taskElement) {
    // 创建火花效果
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '8px';
        sparkle.style.height = '8px';
        sparkle.style.backgroundColor = '#f8bbd0';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '100';
        sparkle.style.animation = 'sparkle 0.6s ease-out';
        
        // 计算火花位置
        const rect = taskElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 随机方向
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 30;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        document.body.appendChild(sparkle);
        
        // 动画结束后移除
        setTimeout(() => sparkle.remove(), 600);
    }
}

// 切换任务完成状态
function toggleTask(e) {
    const taskId = parseInt(e.target.getAttribute('data-id'));
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = e.target.checked;
        saveTasks();
        
        // 显示完成动画
        if (task.completed) {
            const taskElement = e.target.closest('.task-item');
            showCompletionAnimation(taskElement);
        }
        
        renderTasks();
        updateProgress();
        updateStreak();
    }
}

// 初始化应用
init();

// 创建粒子背景
createParticles();