import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Edit, UserPlus, MessageCircle, Camera } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetUserProfileQuery } from "@/redux/api/userApiSlice";

export default function Profile() {
  const { username } = useParams();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: ""
  });
  const [profileUser, setProfileUser] = useState(null);

  const currentUser = useSelector((state) => state.user.user);

  const { data, error, isLoading } = useGetUserProfileQuery(username);

  // sync API data into local state
  useEffect(() => {
    if (data) {
      setProfileUser({
        fullName: data?.data.fullName,
        username: data?.data.username,
        email: data?.data.email,
        profilePic: data?.data.profilePic,
        bio: data?.data.bio || "No bio yet.",
        joinedDate: data?.data.createdAt,
        followers: data?.data.followersCount,
        following: data?.data.followingCount,
        isFollowing: data?.data.isFollowing,
        isOwnProfile: username === currentUser?.username
      });

      setFormData({
        fullName: data?.data.fullName,
        username: data?.data.username,
        bio: data?.data.bio || ""
      });
    }
  }, [data, username, currentUser]);

  console.log("data", data?.data.fullName);
  console.log("profile", profileUser);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handleEditProfile = () => setIsEditDialogOpen(true);

  const handleEditProfilePic = () => {
    // handle upload later
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // update API call goes here
    setIsEditDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading profile</div>;
  }

  if (!profileUser) {
    return null; // or skeleton UI
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative border border-[#1e293b] bg-[#0f172a] rounded-full">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32">
                    <AvatarImage src={profileUser.profilePic} alt={profileUser.fullName} />
                    <AvatarFallback className="text-2xl">
                      {profileUser.fullName?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  {profileUser.isOwnProfile && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-0 bg-[#122759] cursor-pointer -right-0 h-8 w-8 rounded-full"
                      onClick={handleEditProfilePic}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-1">{profileUser.fullName}</h1>
                      <p className="text-muted-foreground">@{profileUser.username}</p>
                      <p className="text-muted-foreground text-sm">{profileUser.email}</p>
                    </div>

                    <div className="flex gap-2 mt-4 md:mt-0">
                      {profileUser.isOwnProfile ? (
                        <Button variant="outline" className="gap-2" onClick={handleEditProfile}>
                          <Edit className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant={profileUser.isFollowing ? "secondary" : "default"}
                            className="gap-2 bg-[#6c46e2]"
                          >
                            <UserPlus className="h-4 w-4" />
                            {profileUser.isFollowing ? "Following" : "Follow"}
                          </Button>
                          <Button variant="outline" size="icon">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 max-w-2xl">{profileUser.bio}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDate(profileUser.joinedDate)}
                    </div>
                  </div>

                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-semibold">{profileUser.followers}</span>{" "}
                      <span className="text-muted-foreground">followers</span>
                    </div>
                    <div>
                      <span className="font-semibold">{profileUser.following}</span>{" "}
                      <span className="text-muted-foreground">following</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#020817] text-white">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#6b40e2] hover:cursor-pointer text-black transition-transform duration-200 hover:scale-105"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
