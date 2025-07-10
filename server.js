const express = require('express');
const cors = require('cors');
const { Deepseek } = require('deepseek-sdk'); // 需安装 deepseek-sdk

const app = express();
app.use(cors());
app.use(express.json());

// 初始化 DeepSeek 客户端（替换为你的 API 密钥）
const deepseek = new Deepseek({
    apiKey: '你的DeepSeek API密钥', // 这里填入你之前提供的API码
});

// 聊天接口
app.post('/api/chat', async (req, res) => {
    const { role, message } = req.body;

    try {
        // 调用 DeepSeek 聊天接口
        const response = await deepseek.chat.completions.create({
            model: "deepseek-chat", // 使用合适的模型
            messages: [
                { role: "system", content: role }, // 角色设定
                { role: "user", content: message } // 用户消息
            ]
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error('DeepSeek API 调用失败:', error);
        res.status(500).json({ error: '获取回复失败' });
    }
});

// 静态文件服务（用于部署前端）
app.use(express.static(__dirname));

// 启动服务
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`服务运行在 http://localhost:${PORT}`);
});
