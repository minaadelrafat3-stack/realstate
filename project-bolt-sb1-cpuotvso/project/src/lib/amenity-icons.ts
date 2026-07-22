import {
  Wifi, Waves, Dumbbell, Utensils, Sparkles, Plane, Car, Shirt,
  Briefcase, Bell, Sun, type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  wifi: Wifi,
  waves: Waves,
  dumbbell: Dumbbell,
  utensils: Utensils,
  sparkles: Sparkles,
  plane: Plane,
  car: Car,
  shirt: Shirt,
  briefcase: Briefcase,
  bell: Bell,
  sun: Sun,
};

export function getAmenityIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? Sparkles;
}
