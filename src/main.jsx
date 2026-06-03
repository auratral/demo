import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { db } from './firebase'
import { seedDatasetsIfEmpty } from './utils/seeder'

// Run background database seeding if empty
seedDatasetsIfEmpty(db);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

