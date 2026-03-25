# Edu Agent

# Edu Agent - 智能教学辅助系统

## 项目简介
Edu Agent 是一个基于 AI Agent 架构的智能教学辅助系统，专注于为教育工作者提供高效的教学内容生成服务。系统采用前后端分离架构，前端基于 React 构建，后端基于 Spring AI 框架，通过自主研发的多智能体协作机制，能够在 **10 分钟内自动生成 PPT 文档、教学教案、教学试题**等教学资料，极大提升备课效率。

## 核心特性

### ⚡ 高效内容生成
- **PPT 文档生成**：自动生成结构清晰、排版美观的教学演示文稿
- **教学教案生成**：包含教学目标、重难点分析、教学过程设计等完整教案要素DOCX文档
- **教学试题生成**：支持选择题、填空题、简答题等多种题型的DOCX文档

### 🤖 智能 Agent 架构
系统采用自研的多智能体协作框架，突破了传统单一 Agent 的局限，实现更智能、更专业的教学内容生成：

- **Multi-Agent 协作机制**：多个专业 Agent 协同工作，支持多个Agent并行或串行执行，包括联网搜索资料子Agent、PPTX生成子Agent、DOCX文档生成子Agent 等，通过智能调度和任务分配，确保生成内容的质量和一致性

- **AgentSkills 技能系统**：为 Agent 赋予专业化教学能力，包括：
    - 智慧ppt创作引擎
    - DOCX文档生成
    - 终端命令行
    - 文章内容总结
    - 精美板书设计
    - ...

- **Agentic RAG 增强检索**：基于 Agent 的智能检索增强生成技术，能够：
    - 动态判断PPTX文档模版需求，自动调用PPTX模版知识库获取合适的PPTX模版

## 技术架构

### 前端技术栈
- React 18.x
- TypeScript
- TailwindCSS / Ant Design / lucide-react
- Vite 构建工具
- Axios 网络请求

### 后端技术栈
- Spring Boot 3.5.6
- Spring AI 框架
- 自研 Multi-Agent 框架
- PostgreSQL / PGVector
- Redis 缓存

## 快速开始

### 环境要求
- Node.js 18+
- Java 17+

### 前端启动

```bash
# 进入前端目录
cd edu-agent
# 安装依赖
npm install
# 启动开发服务器
npm run dev
# 构建生产版本
npm run build
```
