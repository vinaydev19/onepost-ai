import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const EmailChangeConfirmation = () => {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    const handleResend = () => {
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020817] text-white p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Link to="/email-change-verification" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <CardTitle className="text-2xl">Confirm Email Change</CardTitle>
                    </div>
                    <CardDescription>
                        Enter the 6-digit code sent to your new email address.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={code}
                                onChange={(value) => setCode(value)}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <Button type="submit" className="w-full bg-[#6b40e2] hover:cursor-pointer text-black transition-transform duration-200 hover:scale-105" disabled={isLoading || code.length !== 6}>
                            {isLoading ? "Confirming..." : "Confirm Email Change"}
                        </Button>
                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the code?
                            </p>
                            <Button variant="ghost" onClick={handleResend} className="text-sm cursor-pointer hover:bg-[#1e293b]">
                                Resend code
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmailChangeConfirmation;
