import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginCredentials {
  email: string;
  password: string;
}

// Loading Page Component
const LoadingPage = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0A2543] to-[#1C3B5C] flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        className="text-center text-white"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"
        />
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2"
        >
          Welcome to BH Assurance
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/80"
        >
          Preparing your agent dashboard...
        </motion.p>
      </motion.div>
    </div>
  );
};

const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setCredentials(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Hardcoded credentials - only agent
    const validEmail = "agent@bh.com";
    const validPassword = "agent123";

    if (credentials.email === validEmail && credentials.password === validPassword) {
      // Store authentication data
      const authData = {
        isAuthenticated: true,
        email: credentials.email,
        role: "agent",
        timestamp: new Date().getTime(),
        // Add token expiration (1 hour from now)
        expiresAt: Date.now() + (60 * 60 * 1000)
      };
      
      // Store in localStorage
      localStorage.setItem("authData", JSON.stringify(authData));
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", credentials.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      // Show loading page
      setShowLoadingPage(true);
      
      // Simulate loading process before navigation
      setTimeout(() => {
        navigate("/agent");
        toast({
          title: "Login Successful",
          description: "Welcome back, Agent!",
        });
      }, 2500); // Show loading page for 2.5 seconds
      
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showLoadingPage && <LoadingPage />}
      </AnimatePresence>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A2543] to-[#1C3B5C] p-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 mb-4 rounded-full flex items-center justify-center">
              <img 
                src="/signin.png" 
                alt="Sign In" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-[#0A2543]">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:ring-2 focus:ring-[#DF271C] focus:border-transparent"
                  placeholder="agent@bh.com"
                  required
                  autoComplete="email"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-sm text-[#DF271C] hover:text-[#b52017]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <span className="flex items-center">
                        <EyeOff className="w-4 w-4 mr-1" /> Hide
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Eye className="w-4 w-4 mr-1" /> Show
                      </span>
                    )}
                  </button>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:ring-2 focus:ring-[#DF271C] focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-[#DF271C] focus:ring-[#DF271C] border-gray-300 rounded"
                />
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </Label>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-[#DF271C] hover:bg-[#b52017] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DF271C] disabled:opacity-50 transition-colors duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;