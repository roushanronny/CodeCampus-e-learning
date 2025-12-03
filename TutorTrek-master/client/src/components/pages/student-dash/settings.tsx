import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/dashboard/my-profile");
  };

  const handleNotificationSettings = () => {
    // For now, show an alert. Can be replaced with a notification settings page later
    alert("Notification settings feature coming soon!");
  };

  const handlePrivacySettings = () => {
    // For now, show an alert. Can be replaced with a privacy settings page later
    alert("Privacy settings feature coming soon!");
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        <CardBody>
          <div className="flex items-center gap-3 mb-6">
            <FiSettings className="h-6 w-6" />
            <Typography variant="h4" color="blue-gray">
              Settings
            </Typography>
          </div>
          
          <div className="space-y-6">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Account Settings
              </Typography>
              <Typography variant="small" color="gray" className="mb-4">
                Manage your account preferences and settings
              </Typography>
              <Button 
                variant="outlined" 
                color="blue-gray" 
                size="sm"
                onClick={handleEditProfile}
                className="cursor-pointer hover:bg-blue-gray-50 transition-colors"
              >
                Edit Profile
              </Button>
            </div>
            
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Notification Settings
              </Typography>
              <Typography variant="small" color="gray" className="mb-4">
                Configure how you receive notifications
              </Typography>
              <Button 
                variant="outlined" 
                color="blue-gray" 
                size="sm"
                onClick={handleNotificationSettings}
                className="cursor-pointer hover:bg-blue-gray-50 transition-colors"
              >
                Configure Notifications
              </Button>
            </div>
            
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Privacy Settings
              </Typography>
              <Typography variant="small" color="gray" className="mb-4">
                Manage your privacy and data settings
              </Typography>
              <Button 
                variant="outlined" 
                color="blue-gray" 
                size="sm"
                onClick={handlePrivacySettings}
                className="cursor-pointer hover:bg-blue-gray-50 transition-colors"
              >
                Privacy Settings
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Settings;

