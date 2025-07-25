import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Link as LinkIcon, Edit } from 'lucide-react';

const mockCurrentUser = {
  fullName: "Sarah Chen",
  username: "sarahchen",
  email: "sarah@example.com",
  profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
  bio: "Full-stack developer passionate about modern web technologies and user experience. Currently building tools that help developers create better applications.",
  location: "San Francisco, CA",
  website: "https://sarahchen.dev",
  joinedDate: "2023-01-15",
  followers: 1247,
  following: 156
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function ProfileCard() {
  const user = mockCurrentUser;

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto rounded-lg border border-[#1e293b] bg-[#020817] p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Avatar className="h-24 w-24 bg-[#0f172a] md:h-28 md:w-28">
              <AvatarImage src={user.profilePic} alt={user.fullName} />
              <AvatarFallback className="text-3xl">{user.fullName[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                <div>
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  <p className="text-gray-400">@{user.username}</p>
                </div>
                <Button variant="outline" className="mt-4 border-[0.5px] hover:bg-[#1e293b] hover:cursor-pointer md:mt-0 gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              <p className="text-gray-300 mt-4 mb-4 max-w-2xl">{user.bio}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDate(user.joinedDate)}
                </span>
                <span><span className="font-semibold text-white">{user.followers}</span> followers</span>
                <span><span className="font-semibold text-white">{user.following}</span> following</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
