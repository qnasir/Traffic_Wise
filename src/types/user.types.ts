export interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    points: number;
    badges: Badge[];
    subscribedAreas: SubscribedArea[];
}

export interface SubscribedArea {
    id: string;
    name: string;
    radius: number;
    location: {
      lat: number;
      lng: number;
    };
  }
  
  export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: Date;
  }