import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation, usePasswordChangeMutation } from "@/redux/api/userApiSlice";
import toast from "react-hot-toast";
import { getEmail, getMyProfile, getUser, logout } from "@/redux/features/userSlice";
import { useDispatch } from "react-redux";
// import { useToast } from "@/hooks/use-toast";

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    // const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [passwordChange, { isLoading }] = usePasswordChangeMutation()
    const [logoutApi] = useLogoutMutation()



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSignOut = async () => {
        try {
            const res = await logoutApi().unwrap();
            dispatch(logout());
            toast.success(res.message)
            navigate("/login");
        } catch (error) {
            console.log(`something want wrong while logout`);
            console.log(error);
            toast.error(error.data.message)
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await passwordChange(formData).unwrap()
            toast.success(res.message)
            console.log(res);
            handleSignOut()
        } catch (error) {
            console.log(`something want wrong while change the password`);
            console.log(error);
            toast.error(error.data.message)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020817] text-white p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Link to="/profile" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <CardTitle className="text-2xl">Change Password</CardTitle>
                    </div>
                    <CardDescription>
                        Enter your current password and choose a new one.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="oldPassword"
                                    name="oldPassword"
                                    type={showPasswords.oldPassword ? "text" : "password"}
                                    value={formData.oldPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => togglePasswordVisibility("oldPassword")}
                                >
                                    {showPasswords.oldPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPasswords.newPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => togglePasswordVisibility("newPassword")}
                                >
                                    {showPasswords.newPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPasswords.confirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => togglePasswordVisibility("confirmPassword")}
                                >
                                    {showPasswords.confirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-[#6b40e2] hover:cursor-pointer text-black transition-transform duration-200 hover:scale-105" disabled={isLoading}>
                            {isLoading ? "Changing Password..." : "Change Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChangePassword;
