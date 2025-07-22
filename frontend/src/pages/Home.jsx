import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button';
import React from 'react'

function Home() {
    const user = {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
        email: "john@example.com"
    };
    return (
        <div className='min-h-screen bg-[#020817]'>
            <Navbar isAuthenticated={true} user={user} />
            <div className='container mx-auto px-4 py-8'>
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#6c46e2]">
                        Discover Amazing Stories
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                        Explore thought-provoking articles, insights, and stories from our community of writers and creators.
                    </p>
                    <Button variant="hero" size="lg" className="bg-[#6c46e2] transition-transform duration-200 hover:scale-105 hover:cursor-pointer">
                        Start Reading
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Home