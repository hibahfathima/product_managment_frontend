import React from 'react';
import Navbar from '../Layout/Navbar';
import Sidebar from '../Layout/Sidebar';
import MainScreen from './MainScreen';

const Home = () => {
    const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            {/* Navbar pinned to top */}
            <Navbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onMenuToggle={() => setIsSidebarOpen(prev => !prev)}
            />

            {/* Main Content Area: Sidebar + Scrollable Content */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                    selectedSubCategoryId={selectedSubCategoryId}
                    setSelectedSubCategoryId={setSelectedSubCategoryId}
                    setSearchTerm={setSearchTerm}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <MainScreen
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                    selectedSubCategoryId={selectedSubCategoryId}
                    setSelectedSubCategoryId={setSelectedSubCategoryId}
                    searchTerm={searchTerm}
                />
            </div>
        </div>
    );
};

export default Home;
