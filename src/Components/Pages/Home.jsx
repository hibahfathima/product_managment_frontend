import React from 'react';
import Navbar from '../Layout/Navbar';
import Sidebar from '../Layout/Sidebar';
import MainScreen from './MainScreen';

const Home = () => {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            {/* Navbar pinned to top */}
            <Navbar />

            {/* Main Content Area: Sidebar + Scrollable Content */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <MainScreen />
            </div>
        </div>
    );
};

export default Home;