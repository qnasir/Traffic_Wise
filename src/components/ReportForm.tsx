
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAlerts, ReportType, AlertSeverity, Location } from '@/context/AlertsContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  AlertTriangle,
  Construction,
  Car,
  Upload,
  Camera,
  XCircle
} from "lucide-react";
import AuthDialog from './AuthDialog';

interface ReportFormProps {
  userLocation?: Location;
}

const ReportForm: React.FC<ReportFormProps> = ({ userLocation }) => {
  const { user, isAuthenticated } = useAuth();
  const { addReport } = useAlerts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pothole' as ReportType,
    severity: 'medium' as AlertSeverity,
    location: {
      lat: userLocation?.lat || 37.7749,
      lng: userLocation?.lng || -122.4194,
      address: 'Current location'
    },
    imageFile: null as File | null,
    imageUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData((prev) => ({ 
          ...prev, 
          imageFile: file,
          imageUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({ 
      ...prev, 
      imageFile: null,
      imageUrl: ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      try {
        if (user) {
          addReport({
            title: formData.title,
            description: formData.description,
            type: formData.type,
            severity: formData.severity,
            location: formData.location,
            reportedBy: user.id,
            imageUrl: formData.imageUrl
          });
          
          // Clear form after submission
          setFormData({
            title: '',
            description: '',
            type: 'pothole',
            severity: 'medium',
            location: {
              lat: userLocation?.lat || 37.7749,
              lng: userLocation?.lng || -122.4194,
              address: 'Current location'
            },
            imageFile: null,
            imageUrl: '',
          });
          setPreviewImage(null);
        }
      } catch (error) {
        console.error("Error submitting report:", error);
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <>
      <Card className="neo-card transition-all duration-500 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Report an Issue</CardTitle>
          <CardDescription>
            Help other drivers by reporting road hazards, traffic, or accidents.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Brief description of the issue"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide more details about the issue"
                rows={3}
                required
                value={formData.description}
                onChange={handleInputChange}
                className="glass-input"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="font-medium">
                  Issue Type <span className="text-red-500">*</span>
                </Label>
                <Select 
                  defaultValue={formData.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pothole" className="flex items-center">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <span>Pothole</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="accident">
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2" />
                        <span>Accident</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="traffic">
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2" />
                        <span>Traffic Jam</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="construction">
                      <div className="flex items-center">
                        <Construction className="h-4 w-4 mr-2" />
                        <span>Construction</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <span>Other</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="severity" className="font-medium">
                  Severity <span className="text-red-500">*</span>
                </Label>
                <Select 
                  defaultValue={formData.severity}
                  onValueChange={(value) => handleSelectChange('severity', value as AlertSeverity)}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-alert-low flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-alert-low"></div>
                      <span>Low - Minor issue</span>
                    </SelectItem>
                    <SelectItem value="medium" className="text-alert-medium flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-alert-medium"></div>
                      <span>Medium - Caution needed</span>
                    </SelectItem>
                    <SelectItem value="high" className="text-alert-high flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-alert-high"></div>
                      <span>High - Dangerous</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="font-medium">
                Location
              </Label>
              <div className="relative">
                <Input
                  id="location"
                  name="location"
                  value="Using your current location"
                  readOnly
                  className="pl-10 glass-input bg-gray-50 dark:bg-gray-800"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                We're using your device's location. For privacy reasons, exact coordinates won't be shared publicly.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image" className="font-medium">
                Upload Image (Optional)
              </Label>
              
              {!previewImage ? (
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-primary hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG or WEBP (MAX. 5MB)
                      </p>
                    </div>
                    <Input 
                      id="image-upload" 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-2 right-2 bg-white dark:bg-gray-800 opacity-80 hover:opacity-100"
                    onClick={clearImage}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                <span>Submit Report</span>
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <AuthDialog
        isOpen={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
      />
    </>
  );
};

export default ReportForm;
