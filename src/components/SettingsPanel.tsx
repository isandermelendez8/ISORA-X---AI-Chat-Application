// ISORA X – Panel de Configuración y Gestión
// Desarrollado por: Isander Yaxiel Devs
//
// Panel lateral completo con gestión de chats, proyectos, configuración,
// idiomas, privacidad, atajos de teclado y toda la información del sistema.

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import {
  X,
  Settings,
  MessageSquare,
  Folder,
  FileText,
  Plus,
  Search,
  Globe,
  Moon,
  Bell,
  Shield,
  Keyboard,
  HelpCircle,
  Zap,
  Crown,
  LogOut,
  Download,
  Puzzle,
  BookOpen,
  GraduationCap,
  FileCode,
  Users,
  History,
  Star,
  Trash2,
  Edit3,
  MoreVertical,
  ChevronRight,
  Bot,
  Image,
  Mic,
  Video,
  Code,
  Sparkles,
  Terminal,
  Globe2,
  Laptop,
  Smartphone,
  Tablet,
  Chrome,
  Github,
  ExternalLink,
  Heart,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Cpu,
  Database,
  Cloud,
  Wifi,
  Server,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  ScanFace,
  KeyRound,
  CreditCard,
  Receipt,
  Wallet,
  Gift,
  Trophy,
  Medal,
  Award,
  Target,
  Rocket,
  Lightbulb,
  Compass,
  Map,
  Navigation,
  Home,
  Building2,
  Briefcase,
  PenTool,
  Palette,
  Brush,
  Layers,
  Layout,
  Grid,
  List,
  Table2,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Activity,
  HeartPulse,
  Stethoscope,
  Pill,
  Syringe,
  Dna,
  Atom,
  FlaskConical,
  Microscope,
  Telescope,
  RocketIcon,
  Plane,
  Car,
  Train,
  Bus,
  Truck,
  Ship,
  Bike,
  Footprints,
  MapPinned,
  Navigation2,
  Locate,
  LocateFixed,
  LocateOff,
  Radar,
  Radio,
  Antenna,
  Satellite,
  WifiIcon,
  Bluetooth,
  Usb,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  Power,
  Plug,
  ZapIcon,
  Fan,
  Thermometer,
  Droplets,
  Wind,
  CloudIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  MoonIcon,
  Sunrise,
  Sunset,
  StarIcon,
  Stars,
  Rainbow,
  Umbrella,
  Snowflake,
  Flame,
  ThermometerIcon,
  Aperture,
  Camera,
  VideoIcon,
  Film,
  ImageIcon,
  Images,
  Album,
  Library,
  BookOpenIcon,
  BookText,
  BookMarked,
  Bookmark,
  Tag,
  Tags,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  Calculator,
  ReceiptIcon,
  Invoice,
  FileSpreadsheet,
  FileCode2,
  FileJson,
  FileType2,
  FileBox,
  Archive,
  ArchiveRestore,
  FolderOpen,
  FolderClosed,
  FolderGit,
  FolderGit2,
  FolderKanban,
  FolderTree,
  FolderArchive,
  FolderCog,
  FolderHeart,
  FolderMinus,
  FolderPlus,
  FolderSearch,
  FolderX,
  Folders,
  File,
  FilePlus,
  FileMinus,
  FileCheck,
  FileX,
  FileQuestion,
  FileWarning,
  FileClock,
  FileHeart,
  FileKey,
  FileLock,
  FileOutput,
  FileInput,
  FileStack,
  Files,
  Copy,
  CopyCheck,
  Clipboard,
  ClipboardCopy,
  ClipboardPaste,
  Scissors,
  Trash,
  Trash2Icon,
  Eraser,
  Delete,
  RemoveFormatting,
  Paintbrush,
  PaintBucket,
  SprayCan,
  Highlighter,
  Pen,
  Pencil,
  PencilRuler,
  Ruler,
  CompassIcon,
  Square,
  Circle,
  Triangle,
  Diamond,
  Octagon,
  Hexagon,
  Pentagon,
  StarIcon as StarIconLucide,
  HeartIcon,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Laugh,
  Annoyed,
  Angry,
  Skull,
  Ghost,
  Alien,
  RocketIcon as RocketIconLucide,
  Bird,
  Bug,
  Fish,
  Cat,
  Dog,
  PawPrint,
  Flower,
  Flower2,
  TreeDeciduous,
  TreePine,
  TreePalm,
  Mountain,
  MountainSnow,
  Volcano,
  Waves,
  Tent,
  Camping,
  FishSymbol,
  Shell,
  Snail,
  BugIcon,
  Beetle,
  Worm,
  BirdIcon,
  Feather,
  Egg,
  Milk,
  Wheat,
  Beef,
  FishIcon,
  Carrot,
  Apple,
  Banana,
  Cherry,
  Grape,
  Citrus,
  Croissant,
  Pizza,
  Hamburger,
  Utensils,
  CupSoda,
  Coffee,
  Beer,
  Wine,
  GlassWater,
  IceCream,
  Candy,
  Cookie,
  BeefIcon,
  Drumstick,
  Soup,
  Salad,
  Sandwich,
  ChefHat,
  CookingPot,
  UtensilsCrossed,
  ForkKnife,
  Paperclip,
  Link,
  Link2,
  Unlink,
  Link2Off,
  PaperclipIcon,
  Pin,
  PinOff,
  PaperPlane,
  Send,
  MailIcon,
  MailOpen,
  MailCheck,
  MailWarning,
  MailX,
  MailPlus,
  MailMinus,
  MailSearch,
  MailQuestion,
  Inbox,
  ArchiveIcon,
  ArchiveX,
  TrashIcon,
  Trash2Icon as Trash2IconLucide,
  DeleteIcon,
  EraserIcon,
  Paintbrush2,
  HighlighterIcon,
  PencilIcon,
  PenToolIcon,
  PenIcon,
  Edit,
  Edit2,
  Edit3Icon,
  Create,
  Save,
  SaveAll,
  Undo,
  Redo,
  RotateCcw,
  RotateCw,
  RefreshCcw,
  RefreshCw,
  Repeat,
  Repeat1,
  Repeat2,
  FlipHorizontal,
  FlipVertical,
  Scale,
  ZoomIn,
  ZoomOut,
  ZoomOutIcon,
  Expand,
  Shrink,
  Maximize,
  Maximize2,
  Minimize,
  Minimize2,
  Move,
  Move3d,
  MoveDiagonal,
  MoveDiagonal2,
  MoveHorizontal,
  MoveVertical,
  MoveDown,
  MoveUp,
  MoveLeft,
  MoveRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpDown,
  ArrowBigUp,
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRightIcon,
  ChevronsUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  CornerLeftUp,
  CornerLeftDown,
  CornerRightUp,
  CornerRightDown,
  Check,
  CheckCheck,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  XIcon,
  XCircle,
  XOctagon,
  XSquare,
  PlusIcon,
  PlusCircle,
  PlusSquare,
  Minus,
  MinusCircle,
  MinusSquare,
  Divide,
  DivideCircle,
  DivideSquare,
  Equal,
  EqualNot,
  NotEqual,
  InfinityIcon,
  PercentIcon,
  PercentDiamond,
  Pi,
  Sigma,
  FunctionSquare,
  Variable,
  Binary,
  Type,
  Text,
  TextSelect,
  TextCursor,
  TextCursorInput,
  Typing,
  Quote,
  QuoteIcon,
  Blockquote,
  CodeIcon,
  Code2,
  Codepen,
  Codesandbox,
  TerminalIcon,
  TerminalSquare,
  Prompt,
  Command,
  KeyboardIcon,
  KeyboardOff,
  Mouse,
  MousePointer,
  MousePointer2,
  MousePointerClick,
  MouseOff,
  Touchpad,
  TouchpadOff,
  Gamepad,
  Gamepad2,
  Joystick,
  Watch,
  Smartwatch,
  WatchIcon,
  Glasses,
  Sunglasses,
  Accessibility,
  AccessibilityNew,
  PersonStanding,
  UserIcon,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  UserCog,
  UserCircle,
  UsersIcon,
  Users2,
  UsersRound,
  Group,
  Contact,
  Contact2,
  IdCard,
  AddressBook,
  Notebook,
  NotebookPen,
  NotebookTabs,
  BookType,
  LibraryIcon,
  LibrarySquare,
  Building,
  Building2Icon,
  Landmark,
  Castle,
  Church,
  School,
  Hospital,
  Hotel,
  Store,
  ShoppingBag,
  ShoppingCart,
  GiftIcon,
  Package,
  PackageOpen,
  PackageCheck,
  PackageX,
  PackageSearch,
  PackagePlus,
  PackageMinus,
  Boxes,
  Container,
  TruckIcon,
  Van,
  CarIcon,
  CarFront,
  CarTaxiFront,
  BusFront,
  BusIcon,
  TrainFront,
  PlaneIcon,
  PlaneTakeoff,
  PlaneLanding,
  Sailboat,
  ShipIcon,
  Anchor,
  RocketIcon as RocketIconLucide2,
  SatelliteIcon,
  RadarIcon,
  AntennaIcon,
  RadioIcon,
  RadioTower,
  Broadcast,
  WifiIcon as WifiIconLucide,
  WifiOff,
  Ethernet,
  Cable,
  SatelliteDish,
  Router,
  HardDrive,
  HardDriveDownload,
  HardDriveUpload,
  Disc,
  Disc2,
  Disc3,
  DiscAlbum,
  Vinyl,
  Cd,
  Dvd,
  UsbIcon,
  Usb2,
  SmartphoneIcon,
  SmartphoneCharging,
  TabletIcon,
  TabletSmartpen,
  LaptopIcon,
  Laptop2,
  Computer,
  Monitor,
  MonitorSmartphone,
  MonitorSpeaker,
  MonitorPlay,
  MonitorStop,
  MonitorPause,
  MonitorX,
  MonitorCheck,
  Tv,
  Tv2,
  Projector,
  Speaker,
  SpeakerIcon,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  VolumeOff,
  Headphones,
  Headset,
  Ear,
  EarOff,
  MicIcon,
  Mic2,
  MicOff,
  Webcam,
  VideoIcon as VideoIconLucide,
  VideoOff,
  Play,
  PlayCircle,
  Pause,
  PauseCircle,
  PauseOctagon,
  StopCircle,
  SkipBack,
  SkipForward,
  SkipForwardIcon,
  Rewind,
  FastForward,
  RepeatIcon,
  Shuffle,
  ListMusic,
  ListVideo,
  ListTodo,
  ListStart,
  ListEnd,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignHorizontalDistributeStart,
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignVerticalDistributeStart,
  AlignVerticalDistributeCenter,
  AlignVerticalDistributeEnd,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Space,
  GapHorizontal,
  GapVertical,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  FlipDiagonal,
  FlipDiagonal2,
  Mirror,
  GlassWaterIcon,
  Droplet,
  DropletOff,
  DropletsIcon,
  Oil,
  Beaker,
  BeakerIcon,
  TestTube,
  TestTube2,
  FlaskConicalIcon,
  FlaskConicalOff,
  FlaskRound,
  FlaskRoundOff,
  AtomIcon,
  Atom2,
  DnaIcon,
  DnaOff,
  MicroscopeIcon,
  Microscope2,
  TelescopeIcon,
  Binoculars,
  GlassWaterIcon as GlassWaterIconLucide,
  CupSodaIcon,
  CoffeeIcon,
  Coffee2,
  CookieIcon,
  CandyIcon,
  CandyOff,
  CherryIcon,
  CitrusIcon,
  GrapeIcon,
  AppleIcon,
  PizzaIcon,
  HamburgerIcon,
  Fries,
  Popcorn,
  SandwichIcon,
  EggIcon,
  EggFried,
  SoupIcon,
  SaladIcon,
  CarrotIcon,
  FishIcon as FishIconLucide,
  BeefIcon as BeefIconLucide,
  DrumstickIcon,
  UtensilsIcon,
  UtensilsCrossedIcon,
  ForkKnifeIcon,
  CookingPotIcon,
  ChefHatIcon,
  Refrigerator,
  WashingMachine,
  AirVent,
  FanIcon,
  Heater,
  ThermometerIcon as ThermometerIconLucide,
  ThermometerSun,
  ThermometerSnowflake,
  DropletsIcon as DropletsIconLucide,
  DropletIcon,
  DropletOffIcon,
  Rain,
  Rain2,
  Rain3,
  Rain4,
  Rain5,
  SnowflakeIcon,
  Snowman,
  WindIcon,
  Tornado,
  CloudHail,
  CloudRainIcon,
  CloudRainWind,
  CloudDrizzle,
  CloudLightningIcon,
  CloudSnowIcon,
  CloudSun,
  CloudMoon,
  CloudFog,
  SunsetIcon,
  SunriseIcon,
  MoonIcon as MoonIconLucide,
  MoonStar,
  SunIcon,
  SunDim,
  SunMedium,
  SunMoon,
  StarIcon as StarIconLucide2,
  StarOff,
  SparklesIcon,
  Sparkle,
  Wand,
  Wand2,
  Magic,
  GhostIcon,
  SkullIcon,
  AlienIcon,
  RocketIcon as RocketIconLucide3,
  SatelliteIcon as SatelliteIconLucide,
  Earth,
  EarthLock,
  GlobeIcon,
  Globe2Icon,
  Globe3,
  Languages,
  Speech,
  AudioLines,
  AudioWaveform,
  Vibrate,
  VibrateOff,
  Phone,
  PhoneIcon,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
  Voicemail,
  Phone2,
  MessageCircleIcon,
  MessageCircleDashed,
  MessageCircleMore,
  MessageSquareDashed,
  MessageSquareMore,
  MessageSquarePlus,
  MessageSquareMinus,
  MessageSquareQuote,
  MessageSquareWarning,
  MessageSquareX,
  MessagesSquare,
  MessagesCircle,
  SendIcon,
  SendHorizontal,
  MailIcon as MailIconLucide,
  Reply,
  ReplyAll,
  Share,
  Share2,
  Forward,
  TrashIcon as TrashIconLucide,
  ArchiveIcon as ArchiveIconLucide,
  ArchiveRestoreIcon,
  ArchiveXIcon,
  HistoryIcon,
  ClockIcon,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12,
  Timer,
  TimerOff,
  TimerReset,
  Stopwatch,
  AlarmClock,
  AlarmClockOff,
  AlarmClockPlus,
  AlarmClockMinus,
  AlarmClockCheck,
  CalendarIcon,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  CalendarFold,
  CalendarHeart,
  CalendarMinus,
  CalendarOff,
  CalendarPlus,
  CalendarRange,
  CalendarSearch,
  CalendarX,
  CalendarSync,
  CalendarCog,
  CalendarCheck2,
  CalendarClock2,
  CalendarHeart2,
  CalendarMinus2,
  CalendarOff2,
  CalendarPlus2,
  CalendarRange2,
  CalendarSearch2,
  CalendarX2,
  CalendarSync2,
  CalendarCog2,
} from 'lucide-react'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

type Language = 'es' | 'en' | 'fr' | 'de' | 'pt' | 'it' | 'zh' | 'ja' | 'ko' | 'ru' | 'ar' | 'hi'

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
]

const SHORTCUTS = [
  { key: 'Ctrl + K', action: 'Abrir búsqueda de comandos' },
  { key: 'Ctrl + N', action: 'Nuevo chat' },
  { key: 'Ctrl + Shift + N', action: 'Nuevo proyecto' },
  { key: 'Ctrl + P', action: 'Abrir proyecto' },
  { key: 'Ctrl + E', action: 'Abrir settings' },
  { key: 'Ctrl + /', action: 'Mostrar atajos' },
  { key: 'Ctrl + B', action: 'Toggle sidebar' },
  { key: 'Ctrl + Shift + C', action: 'Copiar última respuesta' },
  { key: 'Ctrl + ↑', action: 'Editar mensaje anterior' },
  { key: 'Esc', action: 'Cancelar/Cerrar' },
  { key: 'Enter', action: 'Enviar mensaje' },
  { key: 'Shift + Enter', action: 'Nueva línea' },
]

const CHAT_HISTORY = [
  { id: 1, title: 'Análisis de datos Q4', date: 'Hoy', messages: 24, pinned: true },
  { id: 2, title: 'Generar imágenes de marketing', date: 'Hoy', messages: 12, pinned: true },
  { id: 3, title: 'Debug código Python', date: 'Ayer', messages: 8, pinned: false },
  { id: 4, title: 'Resumir paper de IA', date: 'Ayer', messages: 15, pinned: false },
  { id: 5, title: 'Crear presentación', date: 'Hace 3 días', messages: 32, pinned: false },
]

const PROJECTS = [
  { id: 1, name: 'Marketing 2024', chats: 12, files: 45, color: 'bg-blue-500' },
  { id: 2, name: 'Desarrollo Web', chats: 8, files: 23, color: 'bg-purple-500' },
  { id: 3, name: 'Investigación IA', chats: 15, files: 67, color: 'bg-green-500' },
  { id: 4, name: 'Personal', chats: 5, files: 12, color: 'bg-pink-500' },
]

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { user, profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('chats')
  const [language, setLanguage] = useState<Language>('es')
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/50" onClick={onClose} />
      
      {/* Panel */}
      <div className="w-[450px] h-full bg-[#0A0B14] border-l border-[#1E2030] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1E2030]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Configuración</h2>
              <p className="text-xs text-gray-400">ISORA X v2.0</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1E2030] rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b border-[#1E2030] bg-transparent p-0 h-auto flex-wrap">
            {[
              { id: 'chats', icon: MessageSquare, label: 'Chats' },
              { id: 'projects', icon: Folder, label: 'Proyectos' },
              { id: 'language', icon: Globe, label: 'Idioma' },
              { id: 'plan', icon: Zap, label: 'Plan' },
              { id: 'privacy', icon: Shield, label: 'Privacidad' },
              { id: 'shortcuts', icon: Keyboard, label: 'Atajos' },
              { id: 'about', icon: Sparkles, label: 'Acerca de' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 flex-col gap-1 py-3 data-[state=active]:bg-[#1E2030] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-[#3B82F6]"
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-xs">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="flex-1">
            {/* CHATS TAB */}
            <TabsContent value="chats" className="m-0 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Historial de Chats
                </h3>
                <Button size="sm" className="bg-[#3B82F6] hover:bg-[#2563EB]">
                  <Plus className="w-4 h-4 mr-1" />
                  Nuevo Chat
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar conversaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#1E2030] border-[#2A2D45] text-white"
                />
              </div>

              <div className="space-y-2">
                {CHAT_HISTORY.filter(chat => 
                  chat.title.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((chat) => (
                  <div
                    key={chat.id}
                    className="group flex items-center justify-between p-3 rounded-lg bg-[#1E2030] hover:bg-[#2A2D45] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${chat.pinned ? 'bg-[#8B5CF6]' : 'bg-[#3B82F6]'}`} />
                      <div>
                        <p className="text-sm font-medium text-white">{chat.title}</p>
                        <p className="text-xs text-gray-400">{chat.messages} mensajes • {chat.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-[#3B82F6]/20 rounded">
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-red-500/20 rounded">
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* PROJECTS TAB */}
            <TabsContent value="projects" className="m-0 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Proyectos
                </h3>
                <Button size="sm" className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
                  <Plus className="w-4 h-4 mr-1" />
                  Nuevo Proyecto
                </Button>
              </div>

              <div className="grid gap-3">
                {PROJECTS.map((project) => (
                  <div
                    key={project.id}
                    className="group p-4 rounded-xl bg-[#1E2030] hover:bg-[#2A2D45] cursor-pointer transition-all border border-transparent hover:border-[#3B82F6]/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${project.color} flex items-center justify-center`}>
                          <Folder className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{project.name}</h4>
                          <p className="text-xs text-gray-400">{project.chats} chats • {project.files} archivos</p>
                        </div>
                      </div>
                      <button className="p-1.5 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-[#2A2D45] text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        {project.files} docs
                      </Badge>
                      <Badge variant="secondary" className="bg-[#2A2D45] text-xs">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {project.chats} chats
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* LANGUAGE TAB */}
            <TabsContent value="language" className="m-0 p-4 space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Idioma y Región
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-300 mb-2 block">Idioma de la interfaz</Label>
                    <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                      <SelectTrigger className="bg-[#1E2030] border-[#2A2D45] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E2030] border-[#2A2D45]">
                        {LANGUAGES.map((lang) => (
                          <SelectItem 
                            key={lang.code} 
                            value={lang.code}
                            className="text-white hover:bg-[#2A2D45] focus:bg-[#2A2D45]"
                          >
                            <span className="mr-2">{lang.flag}</span>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 rounded-lg bg-[#1E2030] border border-[#2A2D45]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">Idioma principal (por defecto)</span>
                      <Badge className="bg-[#3B82F6]">Inglés</Badge>
                    </div>
                    <p className="text-xs text-gray-400">
                      Cuando no se detecte idioma, ISORA X usará Inglés como idioma principal para todas las respuestas.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#1E2030]">
                    <div>
                      <p className="text-sm font-medium text-white">Detección automática</p>
                      <p className="text-xs text-gray-400">Detectar idioma del sistema</p>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                </div>
              </div>

              <Separator className="bg-[#2A2D45]" />

              <div>
                <h4 className="font-medium text-white mb-3">Formato Regional</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#1E2030]">
                    <span className="text-sm text-gray-300">Formato de fecha</span>
                    <Select defaultValue="DD/MM/YYYY">
                      <SelectTrigger className="w-[140px] bg-[#2A2D45] border-none text-white text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E2030] border-[#2A2D45]">
                        <SelectItem value="DD/MM/YYYY" className="text-white">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY" className="text-white">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD" className="text-white">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#1E2030]">
                    <span className="text-sm text-gray-300">Zona horaria</span>
                    <Select defaultValue="auto">
                      <SelectTrigger className="w-[180px] bg-[#2A2D45] border-none text-white text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E2030] border-[#2A2D45]">
                        <SelectItem value="auto" className="text-white">Automática (UTC-4)</SelectItem>
                        <SelectItem value="UTC-5" className="text-white">EST (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0" className="text-white">GMT (UTC+0)</SelectItem>
                        <SelectItem value="UTC+1" className="text-white">CET (UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* PLAN TAB */}
            <TabsContent value="plan" className="m-0 p-4 space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 border border-[#3B82F6]/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-300">Plan actual</p>
                    <h3 className="text-2xl font-bold text-white capitalize">{profile?.plan || 'Free'}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Mensajes usados</span>
                    <span className="text-white">{profile?.messages_used || 0} / {profile?.messages_limit === -1 ? '∞' : profile?.messages_limit || 50}</span>
                  </div>
                  <div className="h-2 bg-[#1E2030] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]" style={{ width: '45%' }} />
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90">
                  <Zap className="w-4 h-4 mr-2" />
                  Mejorar Plan
                </Button>
              </div>

              <div className="grid gap-3">
                {[
                  { name: 'Basic', price: '$5-10/mes', features: ['200 mensajes/día', 'Imágenes ilimitadas suaves', '1GB documentos'], color: 'blue' },
                  { name: 'Pro', price: '$15-25/mes', features: ['GPT-4 incluido', 'Agentes ilimitados', 'Video + voz básica', '10GB RAG'], color: 'purple', popular: true },
                  { name: 'Ultra', price: '$40+/mes', features: ['Todo ilimitado', 'Multi-agentes', 'API access', 'GPU dedicado'], color: 'amber' },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-4 rounded-lg border ${plan.popular ? 'border-[#8B5CF6] bg-[#8B5CF6]/10' : 'border-[#2A2D45] bg-[#1E2030]'}`}
                  >
                    {plan.popular && <Badge className="bg-[#8B5CF6] mb-2">Más Popular</Badge>}
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{plan.name}</h4>
                      <span className="text-[#3B82F6] font-bold">{plan.price}</span>
                    </div>
                    <ul className="space-y-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#3B82F6]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* PRIVACY TAB */}
            <TabsContent value="privacy" className="m-0 p-4 space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacidad y Seguridad
              </h3>

              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value="data" className="border-[#2A2D45] rounded-lg bg-[#1E2030] px-4">
                  <AccordionTrigger className="text-sm text-white hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#3B82F6]" />
                      Tus Datos
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-400 space-y-2">
                    <p>• Los chats se almacenan cifrados en tu cuenta</p>
                    <p>• Puedes exportar o eliminar tus datos en cualquier momento</p>
                    <p>• No vendemos ni compartimos tu información</p>
                    <p>• Cumplimos con GDPR, CCPA y otras regulaciones</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cookies" className="border-[#2A2D45] rounded-lg bg-[#1E2030] px-4">
                  <AccordionTrigger className="text-sm text-white hover:no-underline">
                    <div className="flex items-center gap-2">
                      <CookieIcon className="w-4 h-4 text-[#8B5CF6]" />
                      Cookies y Rastreo
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {[
                        { label: 'Cookies esenciales', desc: 'Necesarias para el funcionamiento', enabled: true, required: true },
                        { label: 'Cookies de preferencias', desc: 'Recordar tu idioma y configuración', enabled: true },
                        { label: 'Cookies analíticas', desc: 'Mejorar el rendimiento', enabled: false },
                        { label: 'Cookies de marketing', desc: 'Publicidad personalizada', enabled: false },
                      ].map((cookie) => (
                        <div key={cookie.label} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white">{cookie.label}</p>
                            <p className="text-xs text-gray-500">{cookie.desc}</p>
                          </div>
                          <Switch checked={cookie.enabled} disabled={cookie.required} />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="third" className="border-[#2A2D45] rounded-lg bg-[#1E2030] px-4">
                  <AccordionTrigger className="text-sm text-white hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#F59E0B]" />
                      Integraciones de Terceros
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-400">
                    <p className="mb-2">ISORA X se conecta con servicios de código abierto:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Supabase – Autenticación y base de datos</li>
                      <li>• Hugging Face – Modelos de lenguaje</li>
                      <li>• Ollama – LLMs locales (opcional)</li>
                      <li>• ComfyUI – Generación de imágenes</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator className="bg-[#2A2D45]" />

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-[#2A2D45] text-white hover:bg-[#2A2D45]">
                  <FileText className="w-4 h-4 mr-2" />
                  Política de Privacidad
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#2A2D45] text-white hover:bg-[#2A2D45]">
                  <Scale className="w-4 h-4 mr-2" />
                  Términos de Uso
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#2A2D45] text-white hover:bg-[#2A2D45]">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Política de Cookies
                </Button>
              </div>
            </TabsContent>

            {/* SHORTCUTS TAB */}
            <TabsContent value="shortcuts" className="m-0 p-4 space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                Atajos de Teclado
              </h3>

              <div className="grid gap-2">
                {SHORTCUTS.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#1E2030]">
                    <span className="text-sm text-gray-300">{shortcut.action}</span>
                    <kbd className="px-2 py-1 bg-[#2A2D45] rounded text-xs font-mono text-white border border-[#3B82F6]/30">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-[#1E2030] border border-[#2A2D45]">
                <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                  Tips de Productividad
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Usa Ctrl + K para buscar cualquier comando rápidamente</li>
                  <li>• Presiona ↑ para editar tu último mensaje</li>
                  <li>• Ctrl + Shift + C copia la última respuesta de la IA</li>
                  <li>• Usa @ para mencionar archivos o proyectos</li>
                </ul>
              </div>
            </TabsContent>

            {/* ABOUT TAB */}
            <TabsContent value="about" className="m-0 p-4 space-y-4">
              <div className="text-center py-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                  <span className="text-4xl">🧠</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">ISORA X</h2>
                <p className="text-sm text-gray-400">Versión 2.0.0 (Build 2026.04.16)</p>
                <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                  Todo funcionando correctamente
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Recursos y Aprendizaje
                </h4>
                <div className="grid gap-2">
                  {[
                    { icon: GraduationCap, label: 'Academy – Tutoriales y cursos', color: 'blue' },
                    { icon: FileCode, label: 'Documentación API', color: 'purple' },
                    { icon: BookOpen, label: 'Guías de inicio rápido', color: 'green' },
                    { icon: Video, label: 'Video tutoriales (YouTube)', color: 'red' },
                  ].map((item) => (
                    <Button
                      key={item.label}
                      variant="outline"
                      className="w-full justify-start border-[#2A2D45] text-white hover:bg-[#2A2D45]"
                    >
                      <item.icon className={`w-4 h-4 mr-2 text-${item.color}-400`} />
                      {item.label}
                      <ChevronRight className="w-4 h-4 ml-auto text-gray-500" />
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-[#2A2D45]" />

              <div>
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Puzzle className="w-4 h-4" />
                  Apps y Extensiones
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Laptop, label: 'Desktop App', status: 'Disponible' },
                    { icon: Smartphone, label: 'iOS App', status: 'Próximamente' },
                    { icon: Smartphone, label: 'Android App', status: 'Próximamente' },
                    { icon: Chrome, label: 'Chrome Extension', status: 'Beta' },
                    { icon: Terminal, label: 'CLI Tool', status: 'Gratis' },
                    { icon: Bot, label: 'Discord Bot', status: 'Beta' },
                  ].map((app) => (
                    <div key={app.label} className="p-3 rounded-lg bg-[#1E2030] flex items-center gap-2">
                      <app.icon className="w-5 h-5 text-[#3B82F6]" />
                      <div>
                        <p className="text-xs text-white">{app.label}</p>
                        <p className="text-[10px] text-gray-500">{app.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-[#2A2D45]" />

              <div className="text-center space-y-3">
                <p className="text-xs text-gray-400">
                  Desarrollado con ❤️ por <span className="text-[#3B82F6]">Isander Yaxiel Devs</span>
                </p>
                <div className="flex justify-center gap-2">
                  <a href="#" className="p-2 rounded-lg bg-[#1E2030] hover:bg-[#2A2D45] transition-colors">
                    <Github className="w-4 h-4 text-gray-400" />
                  </a>
                  <a href="#" className="p-2 rounded-lg bg-[#1E2030] hover:bg-[#2A2D45] transition-colors">
                    <Twitter className="w-4 h-4 text-gray-400" />
                  </a>
                  <a href="#" className="p-2 rounded-lg bg-[#1E2030] hover:bg-[#2A2D45] transition-colors">
                    <Linkedin className="w-4 h-4 text-gray-400" />
                  </a>
                  <a href="#" className="p-2 rounded-lg bg-[#1E2030] hover:bg-[#2A2D45] transition-colors">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
                <p className="text-[10px] text-gray-500">
                  © 2026 ISORA X. Todos los derechos reservados.
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E2030]">
          <Button
            variant="destructive"
            className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
            onClick={() => {
              signOut()
              onClose()
              toast.success('Sesión cerrada correctamente')
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  )
}
