
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MapPin, Bell } from 'lucide-react';

interface AreaSubscriptionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialLocation?: { lat: number; lng: number };
}

const AreaSubscription: React.FC<AreaSubscriptionProps> = ({ 
  isOpen, 
  onOpenChange,
  initialLocation 
}) => {
  const { user, subscribeToArea } = useAuth();
  const [name, setName] = useState('');
  const [radius, setRadius] = useState(5);
  const [location, setLocation] = useState(initialLocation || { lat: 0, lng: 0 });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      return;
    }
    
    subscribeToArea({
      name,
      radius,
      location
    });
    
    // Reset form
    setName('');
    setRadius(5);
    onOpenChange(false);
  };
  
  // Function to get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  
  if (!user) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subscribe to Area Alerts</DialogTitle>
          <DialogDescription>
            Receive notifications when new reports are submitted in this area.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="area-name">Area Name</Label>
            <Input
              id="area-name"
              placeholder="Downtown, Home Area, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="radius">Alert Radius</Label>
              <span className="text-sm text-muted-foreground">{radius} km</span>
            </div>
            <Slider
              id="radius"
              min={1}
              max={20}
              step={1}
              value={[radius]}
              onValueChange={(values) => setRadius(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-2 flex-1">
                <div>
                  <Label htmlFor="lat" className="text-xs">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.0001"
                    value={location.lat}
                    onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lng" className="text-xs">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.0001"
                    value={location.lng}
                    onChange={(e) => setLocation({ ...location, lng: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="mt-4"
                onClick={getCurrentLocation}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Use Current
              </Button>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Subscribe to Alerts
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AreaSubscription;
