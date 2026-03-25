import React from 'react'
import ReactDOM from 'react-dom/client';
import './index.css'
import {App} from './App.tsx'
import {GoogleOAuthProvider} from "@react-oauth/google";

const clientId = import.meta.env.GOOGLE_OAUTH_CLIENTID;

const react = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// 使用<React.StrictMode>内部每个组件会同时渲染两次
react.render(
    // <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
        <App />
    </GoogleOAuthProvider>
    // </React.StrictMode>,
);
