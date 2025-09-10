import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const EmailChangeVerification = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020817] text-white p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Link to="/profile" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <CardTitle className="text-2xl">Change Email</CardTitle>
                    </div>
                    <CardDescription>
                        Enter your new email address to receive a verification code.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">New Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your new email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                            {email && !isValidEmail(email) && (
                                <p className="text-sm text-destructive">Please enter a valid email address</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#6b40e2] hover:cursor-pointer text-black transition-transform duration-200 hover:scale-105"
                            disabled={isLoading || !email || !isValidEmail(email)}
                        >
                            {isLoading ? "Sending Code..." : "Send Verification Code"}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                You will receive a verification code at the new email address to confirm the change.
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmailChangeVerification;
