import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  ChartLine,
  Check,
  ClipboardList,
  Clock,
  Compass,
  Eye,
  FileText,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Layers,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { isKnownIconName, type IconName } from "@/lib/icons/icon-names";

const ICONS: Record<IconName, LucideIcon> = {
  search: Search,
  "clipboard-list": ClipboardList,
  users: Users,
  "chart-line": ChartLine,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  layers: Layers,
  "shield-check": ShieldCheck,
  mail: Mail,
  phone: Phone,
  clock: Clock,
  star: Star,
  check: Check,
  target: Target,
  lightbulb: Lightbulb,
  briefcase: Briefcase,
  award: Award,
  building: Building2,
  globe: Globe,
  heart: Heart,
  rocket: Rocket,
  settings: Settings,
  "trending-up": TrendingUp,
  handshake: Handshake,
  "book-open": BookOpen,
  "file-text": FileText,
  "graduation-cap": GraduationCap,
  eye: Eye,
  compass: Compass,
  "badge-check": BadgeCheck,
  zap: Zap,
  "arrow-right": ArrowRight,
};

type IconProps = {
  name: string;
  className?: string;
};

export function Icon({ name, className = "size-5 shrink-0" }: IconProps) {
  const Component = isKnownIconName(name) ? ICONS[name] : Sparkles;
  return <Component aria-hidden="true" className={className} />;
}
