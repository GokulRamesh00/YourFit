import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserCircle, History, Settings, Ruler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate();

  if (!isLoaded) {
    return <div className="container mx-auto py-12">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
        <Button onClick={() => navigate("/sign-in")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                  <AvatarFallback>
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.fullName}</h2>
                <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
              </div>

              <div className="mt-8">
                <Button
                  variant={activeTab === "account" ? "default" : "ghost"}
                  className="w-full justify-start mb-2"
                  onClick={() => setActiveTab("account")}
                >
                  <UserCircle className="mr-2 h-5 w-5" />
                  Account
                </Button>
                <Button
                  variant={activeTab === "size-history" ? "default" : "ghost"}
                  className="w-full justify-start mb-2"
                  onClick={() => setActiveTab("size-history")}
                >
                  <History className="mr-2 h-5 w-5" />
                  Size History
                </Button>
                <Button
                  variant={activeTab === "size-settings" ? "default" : "ghost"}
                  className="w-full justify-start mb-2"
                  onClick={() => setActiveTab("size-settings")}
                >
                  <Ruler className="mr-2 h-5 w-5" />
                  Size Settings
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-3/4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "account" && "Account Information"}
                {activeTab === "size-history" && "Size History"}
                {activeTab === "size-settings" && "Size Settings"}
                {activeTab === "settings" && "Settings"}
              </CardTitle>
              <CardDescription>
                {activeTab === "account" && "Manage your account details"}
                {activeTab === "size-history" && "Your saved size preferences"}
                {activeTab === "size-settings" && "Configure your size preferences"}
                {activeTab === "settings" && "Update your account settings"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === "account" && (
                <div>
                  <div className="grid gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p>{user.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p>{user.primaryEmailAddress?.emailAddress}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Account Management</h3>
                      <div className="space-y-2">
                        <Button variant="outline">Edit Profile</Button>
                        <Button variant="outline">Change Password</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "size-history" && (
                <div>
                  <Tabs defaultValue="tops">
                    <TabsList className="grid grid-cols-3 w-full max-w-md">
                      <TabsTrigger value="tops">Tops</TabsTrigger>
                      <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
                      <TabsTrigger value="footwear">Footwear</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tops" className="pt-4">
                      <p className="text-gray-500 mb-2">Your preferred top size: <span className="font-medium">M</span></p>
                      <p className="text-sm text-gray-400">Based on your previous selections</p>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Recent size quiz results:</h4>
                        <div className="bg-gray-50 p-3 rounded-md mb-2">
                          <div className="flex justify-between">
                            <span className="text-sm">May 15, 2023</span>
                            <span className="font-medium">Size M</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between">
                            <span className="text-sm">March 3, 2023</span>
                            <span className="font-medium">Size S</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="bottoms" className="pt-4">
                      <p className="text-gray-500 mb-2">Your preferred bottom size: <span className="font-medium">M</span></p>
                      <p className="text-sm text-gray-400">Based on your previous selections</p>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Recent size quiz results:</h4>
                        <div className="bg-gray-50 p-3 rounded-md mb-2">
                          <div className="flex justify-between">
                            <span className="text-sm">April 20, 2023</span>
                            <span className="font-medium">Size M</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="footwear" className="pt-4">
                      <p className="text-gray-500 mb-2">Your preferred footwear size: <span className="font-medium">9</span></p>
                      <p className="text-sm text-gray-400">Based on your previous selections</p>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Recent size quiz results:</h4>
                        <div className="bg-gray-50 p-3 rounded-md mb-2">
                          <div className="flex justify-between">
                            <span className="text-sm">May 2, 2023</span>
                            <span className="font-medium">Size 9</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6">
                    <Link to="/sizing-demo">
                      <Button>Take Size Quiz Again</Button>
                    </Link>
                  </div>
                </div>
              )}
              
              {activeTab === "size-settings" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Default Size Preferences</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      These sizes will be pre-selected when shopping
                    </p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Tops Size</label>
                          <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yourfit-primary focus:border-yourfit-primary sm:text-sm rounded-md">
                            <option>XS</option>
                            <option>S</option>
                            <option selected>M</option>
                            <option>L</option>
                            <option>XL</option>
                            <option>XXL</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Bottoms Size</label>
                          <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yourfit-primary focus:border-yourfit-primary sm:text-sm rounded-md">
                            <option>XS</option>
                            <option>S</option>
                            <option selected>M</option>
                            <option>L</option>
                            <option>XL</option>
                            <option>XXL</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Footwear Size</label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yourfit-primary focus:border-yourfit-primary sm:text-sm rounded-md">
                          <option>6</option>
                          <option>7</option>
                          <option>8</option>
                          <option selected>9</option>
                          <option>10</option>
                          <option>11</option>
                          <option>12</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Fit Preference</label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yourfit-primary focus:border-yourfit-primary sm:text-sm rounded-md">
                          <option>Tight/Compression</option>
                          <option selected>Regular Fit</option>
                          <option>Loose/Relaxed</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-2">Size Recommendations</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">Show size recommendations when shopping</p>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yourfit-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                    <p className="text-sm text-gray-500 mb-4">Manage how you receive notifications</p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Email Notifications
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Push Notifications
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Privacy</h3>
                    <p className="text-sm text-gray-500 mb-4">Manage your privacy settings</p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Privacy Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Data Management
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile; 